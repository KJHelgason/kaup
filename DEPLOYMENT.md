# Azure Deployment Guide - Kaup Backend

⚠️ **SECURITY NOTICE**: Never commit real credentials to git. All secrets should be managed via environment variables.

## Prerequisites

1. Azure account with active subscription
2. GitHub repository secrets configured
3. AWS credentials (stored securely in Azure App Service)

## Deployment Steps

### 1. Create Azure Web App

1. Go to [Azure Portal](https://portal.azure.com)
2. Create new **Web App**:
   - Resource Group: `kaup-backend`
   - Name: `kaup-backend` (or your chosen name)
   - Runtime: **.NET 8 (LTS)**
   - Operating System: **Linux**
   - Region: Choose nearest
   - Pricing: **Free F1** or **Basic B1**

### 2. Configure Environment Variables in Azure

Go to: Web App → Settings → Environment variables

Add these variables (get values from your secure storage):

```
ASPNETCORE_ENVIRONMENT = Production

# AWS S3 Configuration (NEVER commit these values)
AWS__AccessKey = <your-aws-access-key>
AWS__SecretKey = <your-aws-secret-key>
AWS__Region = eu-north-1
AWS__BucketName = kaup-images

# JWT Configuration
Jwt__Key = <generate-secure-random-64-char-string>
Jwt__Issuer = https://your-app-name.azurewebsites.net
Jwt__Audience = https://your-app-name.azurewebsites.net
```

**To generate a secure JWT key (PowerShell):**
```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
```

### 3. Configure GitHub Secrets

Go to: https://github.com/YOUR-USERNAME/kaup/settings/secrets/actions

Add this secret:
- Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
- Value: Download from Azure Portal → Your Web App → "Get publish profile"

### 4. Deploy

Push to GitHub `main` branch - GitHub Actions will automatically deploy.

## Local Development Setup

1. Copy the template file:
   ```bash
   cp backend/Kaup.Api/appsettings.Development.json.template backend/Kaup.Api/appsettings.Development.json
   ```

2. Edit `appsettings.Development.json` with your **local** AWS credentials
   - ⚠️ This file is `.gitignored` - never commit it!

3. Run the backend:
   ```bash
   cd backend/Kaup.Api
   dotnet run
   ```

## Security Best Practices

✅ **DO:**
- Use environment variables for all secrets in production
- Store credentials in Azure Key Vault (advanced)
- Rotate credentials regularly
- Use different AWS IAM users for dev/prod
- Enable AWS CloudTrail for audit logs

❌ **DON'T:**
- Commit `appsettings.Development.json` to git
- Put real credentials in documentation
- Share AWS credentials in chat/email
- Use production credentials in development
- Hardcode secrets in source code

## What to Do If Credentials Are Exposed

1. **Immediately** rotate the exposed credentials in AWS
2. Check AWS CloudTrail for unauthorized access
3. Remove from git history: `git filter-branch` or contact GitHub support
4. Update all environments with new credentials
5. Review IAM policies and reduce permissions

## Monitoring

- Azure Portal → Your Web App → Monitoring → Logs
- AWS CloudWatch for S3 access logs
- GitHub Actions → Deployments tab

---

For questions or issues, check the Azure documentation: https://learn.microsoft.com/azure/app-service/
