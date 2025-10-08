# Azure Backend Deployment Guide

## ✅ You've Completed Step 1-5 (Azure Portal Setup)

Now let's complete Step 6: Automatic GitHub Deployment

---

## 📝 Step 6: Configure GitHub Actions Deployment

### 1. Get Your Azure Publish Profile

In the Azure Portal:

1. Go to your Web App: **kaup-backend** (or whatever you named it)
2. Click **"Get publish profile"** button (top menu)
3. This downloads a `.PublishSettings` file
4. Open the file in a text editor and **copy all the contents**

### 2. Add Publish Profile to GitHub Secrets

1. Go to your GitHub repository: https://github.com/KJHelgason/kaup
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
5. Value: **Paste the entire contents** of the `.PublishSettings` file
6. Click **"Add secret"**

### 3. Update the Workflow File

The workflow file has been created at: `.github/workflows/azure-backend-deploy.yml`

**Update line 12** with your actual Azure Web App name:
```yaml
AZURE_WEBAPP_NAME: kaup-backend    # Replace with YOUR actual name
```

### 4. Configure Azure Environment Variables

In Azure Portal → Your Web App → **Settings** → **Environment variables**, add:

#### Required Variables:
- `ASPNETCORE_ENVIRONMENT` = `Production`
- `AWS__AccessKey` = `YOUR_AWS_ACCESS_KEY`
- `AWS__SecretKey` = `YOUR_AWS_SECRET_KEY`
- `AWS__Region` = `eu-north-1`
- `AWS__BucketName` = `kaup-images`
- `Jwt__Key` = `[Generate a secure random string - at least 32 characters]`
- `Jwt__Issuer` = `https://YOUR-APP-NAME.azurewebsites.net`
- `Jwt__Audience` = `https://YOUR-APP-NAME.azurewebsites.net`

#### Optional (if you switch to PostgreSQL):
- `ConnectionStrings__DefaultConnection` = `Your PostgreSQL connection string`

### 5. Deploy!

Now you have two deployment options:

#### Option A: Push to GitHub (Automatic)
```powershell
cd "c:\Users\Kjart\OneDrive\Desktop\kaup\new version"
git add .
git commit -m "Add Azure deployment workflow"
git push origin main
```

The GitHub Action will automatically deploy your backend to Azure!

#### Option B: Manual Deploy via Portal
1. In Azure Portal → Your Web App
2. Go to **Deployment Center**
3. Choose deployment source: **GitHub**
4. Authorize and select:
   - Organization: KJHelgason
   - Repository: kaup
   - Branch: main
5. Save

### 6. Update Frontend Environment Variable

Once deployed, update your Vercel frontend:

1. Go to: https://vercel.com/kjartans-projects-4a4ddebf/kaup/settings/environment-variables
2. Update `NEXT_PUBLIC_API_URL` to: `https://YOUR-APP-NAME.azurewebsites.net`
3. Redeploy frontend

---

## 🔐 Security Notes

**IMPORTANT**: The AWS credentials are currently in `appsettings.Development.json`. 

For better security:
1. Remove them from the file
2. Only set them as Azure Environment Variables
3. Add `appsettings.Development.json` to `.gitignore` (if not already)

---

## 🧪 Testing Your Deployment

Once deployed, test your API:
```
https://YOUR-APP-NAME.azurewebsites.net/api/health
```

Or check Swagger UI:
```
https://YOUR-APP-NAME.azurewebsites.net/swagger
```

---

## 📊 Monitor Your App

In Azure Portal → Your Web App:
- **Log stream**: See real-time logs
- **App Service logs**: Enable application logging
- **Metrics**: Monitor performance
- **Diagnose and solve problems**: Troubleshoot issues

---

## 🎯 Next Steps

1. ✅ Add publish profile to GitHub secrets
2. ✅ Update workflow with your app name
3. ✅ Configure Azure environment variables
4. ✅ Push to GitHub to trigger deployment
5. ✅ Update Vercel frontend with Azure backend URL
6. ✅ Test your deployed API

Need help? Check the GitHub Actions tab to see deployment progress!
