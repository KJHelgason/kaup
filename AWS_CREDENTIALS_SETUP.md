# AWS S3 Configuration

⚠️ **IMPORTANT**: Your AWS credentials are stored in `appsettings.Development.json` which is excluded from git.

## Setup Instructions

1. Copy the example file:
   ```powershell
   Copy-Item backend/Kaup.Api/appsettings.Development.json.example backend/Kaup.Api/appsettings.Development.json
   ```

2. Edit `backend/Kaup.Api/appsettings.Development.json` and add your credentials:
   ```json
   {
     "AWS": {
       "AccessKey": "YOUR_ACTUAL_ACCESS_KEY",
       "SecretKey": "YOUR_ACTUAL_SECRET_KEY",
       "Region": "eu-north-1",
       "BucketName": "kaup-images"
     }
   }
   ```

3. **Never commit this file to git!** It's already in `.gitignore`.

## Security Note

The `.gitignore` file includes:
```
backend/Kaup.Api/appsettings.Development.json
```

This prevents your credentials from being committed to git.
