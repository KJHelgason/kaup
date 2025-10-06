# AWS Deployment Guide for Kaup

## Overview

This guide walks you through deploying Kaup to AWS using best practices for scalability, security, and cost-efficiency.

## Architecture Components

```
Internet
    ↓
Route 53 (DNS)
    ↓
CloudFront (CDN)
    ↓
┌─────────────────────┬─────────────────────┐
│                     │                     │
│  AWS Amplify        │  Application        │
│  (Frontend)         │  Load Balancer      │
│                     │                     │
└─────────────────────┴──────────┬──────────┘
                                 │
                        ┌────────┴────────┐
                        │                 │
                    ECS Fargate      Amazon RDS
                    (.NET API)      (PostgreSQL)
                        │
                    ┌───┴───┐
                    │       │
                   S3    Cognito
                (Images)  (Auth)
```

## Prerequisites

1. AWS Account
2. AWS CLI installed and configured
3. Docker installed
4. Git repository (GitHub, GitLab, or Bitbucket)

## Step-by-Step Deployment

### Phase 1: Database Setup (Amazon RDS)

#### 1.1 Create PostgreSQL Database

```bash
# Using AWS CLI
aws rds create-db-instance \
    --db-instance-identifier kaup-db \
    --db-instance-class db.t4g.micro \
    --engine postgres \
    --engine-version 15.4 \
    --master-username admin \
    --master-user-password YourSecurePassword123! \
    --allocated-storage 20 \
    --vpc-security-group-ids sg-xxxxx \
    --db-subnet-group-name default \
    --backup-retention-period 7 \
    --preferred-backup-window "03:00-04:00" \
    --preferred-maintenance-window "mon:04:00-mon:05:00" \
    --publicly-accessible false \
    --storage-encrypted \
    --enable-cloudwatch-logs-exports '["postgresql"]'
```

Or use AWS Console:
1. Go to RDS Console
2. Click "Create database"
3. Choose PostgreSQL 15
4. Template: Production (or Dev/Test for lower costs)
5. DB instance identifier: `kaup-db`
6. Master username: `admin`
7. Set strong password
8. Instance configuration: db.t4g.micro (Free tier eligible)
9. Storage: 20 GB GP3
10. Enable storage autoscaling
11. Multi-AZ: No (enable for production)
12. VPC: Default or create new
13. Public access: No
14. Create new security group: `kaup-db-sg`
15. Enable automated backups
16. Encryption: Enable

#### 1.2 Configure Security Group

Allow inbound traffic from ECS tasks:
```bash
aws ec2 authorize-security-group-ingress \
    --group-id sg-xxxxx \
    --protocol tcp \
    --port 5432 \
    --source-group sg-ecs-tasks
```

#### 1.3 Get Database Endpoint

```bash
aws rds describe-db-instances \
    --db-instance-identifier kaup-db \
    --query 'DBInstances[0].Endpoint.Address' \
    --output text
```

Save this endpoint for later use.

### Phase 2: Container Registry (Amazon ECR)

#### 2.1 Create ECR Repository

```bash
aws ecr create-repository \
    --repository-name kaup-api \
    --region us-east-1
```

#### 2.2 Build and Push Docker Image

```bash
# Get login credentials
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com

# Build the image
cd backend
docker build -t kaup-api .

# Tag the image
docker tag kaup-api:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/kaup-api:latest

# Push to ECR
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/kaup-api:latest
```

### Phase 3: Backend Deployment (ECS Fargate)

#### 3.1 Create ECS Cluster

```bash
aws ecs create-cluster \
    --cluster-name kaup-cluster \
    --capacity-providers FARGATE \
    --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1
```

#### 3.2 Create Task Execution Role

Create `ecs-task-execution-role-policy.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

```bash
aws iam create-role \
    --role-name ecsTaskExecutionRole \
    --assume-role-policy-document file://ecs-task-execution-role-policy.json

aws iam attach-role-policy \
    --role-name ecsTaskExecutionRole \
    --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
```

#### 3.3 Create Task Definition

Create `task-definition.json`:
```json
{
  "family": "kaup-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "kaup-api",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/kaup-api:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "ASPNETCORE_ENVIRONMENT",
          "value": "Production"
        },
        {
          "name": "ConnectionStrings__DefaultConnection",
          "value": "Host=kaup-db.xxxxxx.us-east-1.rds.amazonaws.com;Database=kaup;Username=admin;Password=YourPassword"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/kaup-api",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

Register the task definition:
```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

#### 3.4 Create Application Load Balancer

```bash
# Create load balancer
aws elbv2 create-load-balancer \
    --name kaup-alb \
    --subnets subnet-xxxxx subnet-yyyyy \
    --security-groups sg-xxxxx \
    --scheme internet-facing \
    --type application \
    --ip-address-type ipv4

# Create target group
aws elbv2 create-target-group \
    --name kaup-targets \
    --protocol HTTP \
    --port 80 \
    --vpc-id vpc-xxxxx \
    --target-type ip \
    --health-check-path /health

# Create listener
aws elbv2 create-listener \
    --load-balancer-arn arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/kaup-alb/xxxxx \
    --protocol HTTP \
    --port 80 \
    --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/kaup-targets/xxxxx
```

#### 3.5 Create ECS Service

```bash
aws ecs create-service \
    --cluster kaup-cluster \
    --service-name kaup-api-service \
    --task-definition kaup-api:1 \
    --desired-count 2 \
    --launch-type FARGATE \
    --platform-version LATEST \
    --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx,subnet-yyyyy],securityGroups=[sg-xxxxx],assignPublicIp=ENABLED}" \
    --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/kaup-targets/xxxxx,containerName=kaup-api,containerPort=80"
```

### Phase 4: Frontend Deployment (AWS Amplify)

#### 4.1 Connect Git Repository

1. Go to AWS Amplify Console
2. Click "New app" → "Host web app"
3. Choose your Git provider (GitHub, GitLab, etc.)
4. Authorize AWS Amplify
5. Select repository: `kaup`
6. Select branch: `main`

#### 4.2 Configure Build Settings

AWS Amplify will auto-detect Next.js. Customize `amplify.yml` if needed:

Create `frontend/amplify.yml`:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd frontend
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: frontend/.next
    files:
      - '**/*'
  cache:
    paths:
      - frontend/node_modules/**/*
```

#### 4.3 Set Environment Variables

In Amplify Console:
1. Go to App settings → Environment variables
2. Add:
   - `NEXT_PUBLIC_API_URL`: `http://kaup-alb-xxxxx.us-east-1.elb.amazonaws.com/api`
   - `NEXT_PUBLIC_SITE_URL`: Your domain or Amplify URL

#### 4.4 Configure Custom Domain (Optional)

1. In Amplify Console → Domain management
2. Add domain
3. Follow DNS configuration steps
4. Wait for SSL certificate provision

### Phase 5: Storage (Amazon S3)

#### 5.1 Create S3 Bucket for Images

```bash
aws s3api create-bucket \
    --bucket kaup-images \
    --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
    --bucket kaup-images \
    --versioning-configuration Status=Enabled

# Configure CORS
aws s3api put-bucket-cors \
    --bucket kaup-images \
    --cors-configuration file://cors-config.json
```

Create `cors-config.json`:
```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://yourdomain.com"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

#### 5.2 Create CloudFront Distribution for S3

```bash
aws cloudfront create-distribution \
    --origin-domain-name kaup-images.s3.amazonaws.com \
    --default-root-object index.html
```

### Phase 6: Authentication (Amazon Cognito)

#### 6.1 Create User Pool

```bash
aws cognito-idp create-user-pool \
    --pool-name kaup-users \
    --auto-verified-attributes email \
    --username-attributes email \
    --password-policy "MinimumLength=8,RequireUppercase=true,RequireLowercase=true,RequireNumbers=true,RequireSymbols=true"
```

#### 6.2 Create User Pool Client

```bash
aws cognito-idp create-user-pool-client \
    --user-pool-id us-east-1_xxxxx \
    --client-name kaup-web-client \
    --generate-secret \
    --explicit-auth-flows ALLOW_USER_PASSWORD_AUTH ALLOW_REFRESH_TOKEN_AUTH
```

#### 6.3 Configure Google OAuth (Optional)

1. Go to Cognito Console → User Pools → kaup-users
2. Sign-in experience → Add identity provider
3. Select Google
4. Enter Google Client ID and Secret
5. Configure OAuth scopes

### Phase 7: Monitoring and Logging

#### 7.1 Create CloudWatch Log Groups

```bash
aws logs create-log-group --log-group-name /ecs/kaup-api
aws logs create-log-group --log-group-name /aws/amplify/kaup
```

#### 7.2 Set Up CloudWatch Alarms

```bash
# High CPU alarm
aws cloudwatch put-metric-alarm \
    --alarm-name kaup-api-high-cpu \
    --alarm-description "Alert when CPU exceeds 80%" \
    --metric-name CPUUtilization \
    --namespace AWS/ECS \
    --statistic Average \
    --period 300 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2

# Database connections alarm
aws cloudwatch put-metric-alarm \
    --alarm-name kaup-db-connections \
    --alarm-description "Alert when DB connections exceed 80%" \
    --metric-name DatabaseConnections \
    --namespace AWS/RDS \
    --statistic Average \
    --period 300 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2
```

### Phase 8: CI/CD Pipeline

#### 8.1 Create buildspec.yml for Backend

Create `backend/buildspec.yml`:
```yaml
version: 0.2

phases:
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
  build:
    commands:
      - echo Build started on `date`
      - cd backend
      - docker build -t $IMAGE_REPO_NAME:$IMAGE_TAG .
      - docker tag $IMAGE_REPO_NAME:$IMAGE_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME:$IMAGE_TAG
  post_build:
    commands:
      - echo Build completed on `date`
      - docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME:$IMAGE_TAG
      - echo Writing image definitions file...
      - printf '[{"name":"kaup-api","imageUri":"%s"}]' $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME:$IMAGE_TAG > imagedefinitions.json

artifacts:
  files: imagedefinitions.json
```

#### 8.2 Create CodePipeline

```bash
aws codepipeline create-pipeline --cli-input-json file://pipeline.json
```

## Security Best Practices

### 1. Use AWS Secrets Manager

Store sensitive data:
```bash
aws secretsmanager create-secret \
    --name kaup/db/password \
    --secret-string "YourSecurePassword123!"

aws secretsmanager create-secret \
    --name kaup/jwt/secret \
    --secret-string "your-jwt-secret-key-here"
```

Update task definition to use secrets:
```json
{
  "secrets": [
    {
      "name": "DB_PASSWORD",
      "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:kaup/db/password"
    }
  ]
}
```

### 2. Enable WAF for ALB

```bash
aws wafv2 create-web-acl \
    --name kaup-waf \
    --scope REGIONAL \
    --default-action Allow={} \
    --rules file://waf-rules.json
```

### 3. Enable VPC Flow Logs

```bash
aws ec2 create-flow-logs \
    --resource-type VPC \
    --resource-ids vpc-xxxxx \
    --traffic-type ALL \
    --log-destination-type cloud-watch-logs \
    --log-group-name /aws/vpc/flowlogs
```

## Cost Optimization

### 1. Use Spot Instances for Non-Critical Workloads

```bash
aws ecs put-cluster-capacity-providers \
    --cluster kaup-cluster \
    --capacity-providers FARGATE FARGATE_SPOT \
    --default-capacity-provider-strategy capacityProvider=FARGATE_SPOT,weight=1
```

### 2. Set Up Auto Scaling

```bash
aws application-autoscaling register-scalable-target \
    --service-namespace ecs \
    --scalable-dimension ecs:service:DesiredCount \
    --resource-id service/kaup-cluster/kaup-api-service \
    --min-capacity 1 \
    --max-capacity 10

aws application-autoscaling put-scaling-policy \
    --service-namespace ecs \
    --scalable-dimension ecs:service:DesiredCount \
    --resource-id service/kaup-cluster/kaup-api-service \
    --policy-name cpu-scaling \
    --policy-type TargetTrackingScaling \
    --target-tracking-scaling-policy-configuration file://scaling-policy.json
```

### 3. Use CloudFront for Static Assets

Enable caching for better performance and lower costs.

## Monitoring URLs

After deployment, save these URLs:

- **Frontend**: `https://main.xxxxx.amplifyapp.com`
- **Backend API**: `http://kaup-alb-xxxxx.us-east-1.elb.amazonaws.com`
- **Database**: `kaup-db.xxxxx.us-east-1.rds.amazonaws.com:5432`
- **CloudWatch Logs**: AWS Console → CloudWatch → Log groups
- **RDS Monitoring**: AWS Console → RDS → kaup-db → Monitoring

## Rollback Strategy

If deployment fails:

```bash
# Rollback ECS service
aws ecs update-service \
    --cluster kaup-cluster \
    --service kaup-api-service \
    --task-definition kaup-api:PREVIOUS_VERSION

# Rollback Amplify
aws amplify start-job \
    --app-id xxxxx \
    --branch-name main \
    --job-type RELEASE \
    --job-id PREVIOUS_JOB_ID
```

## Testing Deployment

1. **Health Check**:
   ```bash
   curl http://your-alb-url/health
   ```

2. **API Test**:
   ```bash
   curl http://your-alb-url/api/listings
   ```

3. **Frontend Test**:
   Open browser to Amplify URL

## Estimated Monthly Costs

### Small Scale (< 1,000 users/day)
- RDS db.t4g.micro: $15
- ECS Fargate (1 task): $15
- ALB: $20
- Amplify: $0 (Free tier)
- S3 + CloudFront: $5
- **Total: ~$55/month**

### Medium Scale (< 10,000 users/day)
- RDS db.t4g.large: $70
- ECS Fargate (2-4 tasks): $60
- ALB: $20
- Amplify: $15
- S3 + CloudFront: $30
- ElastiCache: $50
- **Total: ~$245/month**

### Large Scale (> 100,000 users/day)
- RDS db.r6g.xlarge: $300
- ECS Fargate (10+ tasks): $500
- ALB: $50
- Amplify: $50
- S3 + CloudFront: $150
- ElastiCache: $150
- **Total: ~$1,200/month**

## Support and Maintenance

1. **Regular Updates**: Update dependencies monthly
2. **Backups**: Automated RDS backups (7-day retention)
3. **Monitoring**: Set up CloudWatch dashboards
4. **Security**: Run security audits quarterly
5. **Cost Review**: Review AWS costs monthly

## Troubleshooting

### ECS Task Fails to Start
- Check CloudWatch logs
- Verify security group rules
- Check IAM permissions

### Database Connection Issues
- Verify security group allows ECS → RDS
- Check connection string
- Verify RDS is in available state

### Amplify Build Fails
- Check build logs in Amplify console
- Verify environment variables
- Test build locally

## Next Steps

1. Set up custom domain with Route 53
2. Configure SSL certificates
3. Implement backup strategy
4. Set up staging environment
5. Configure monitoring alerts
6. Implement disaster recovery plan

## Resources

- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [AWS RDS Best Practices](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_BestPractices.html)
- [AWS Cost Calculator](https://calculator.aws/)
