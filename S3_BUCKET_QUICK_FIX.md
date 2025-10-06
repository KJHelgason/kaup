# S3 Bucket Configuration Quick Fix

## Problem
You're getting the error: **"The bucket does not allow ACLs"**

## Solution
Your S3 bucket needs to be configured to allow public read access via bucket policy instead of ACLs.

### Step 1: Configure S3 Bucket Settings

1. Go to [AWS S3 Console](https://s3.console.aws.amazon.com/s3/buckets)
2. Find your bucket: `kaup-images`
3. Click on the bucket name

### Step 2: Disable "Block Public Access"

1. Go to the **Permissions** tab
2. Click **Edit** under "Block public access (bucket settings)"
3. **Uncheck** "Block all public access"
4. Click **Save changes**
5. Type `confirm` when prompted

### Step 3: Add Bucket Policy

1. Still in the **Permissions** tab
2. Scroll down to **Bucket policy**
3. Click **Edit**
4. Paste this policy (replace `kaup-images` if you used a different bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::kaup-images/*"
    }
  ]
}
```

5. Click **Save changes**

### Step 4: Verify ACL Settings

1. Still in the **Permissions** tab
2. Scroll to **Object Ownership**
3. Make sure it's set to **"ACLs disabled (recommended)"**
   - This is why we removed ACLs from the code

### Step 5: Test Upload

1. Refresh your frontend page
2. Try uploading a profile image again
3. It should work now!

## What This Does

- **Bucket Policy**: Allows anyone to READ (download) objects from your bucket
- **Upload permissions**: Your IAM user can upload via the access keys
- **Public access**: Images are accessible via their S3 URLs

## Security Note

This makes all uploaded images publicly accessible, which is what you want for a marketplace site. Only images uploaded to this bucket will be public - users still need AWS credentials to upload.

## Troubleshooting

### If you still get ACL errors:
- Make sure you saved the bucket policy
- Make sure "Block public access" is OFF
- Wait 30 seconds and try again (AWS can take a moment to apply changes)

### If upload fails with permission error:
- Check your IAM policy (see AWS_S3_SETUP.md)
- Make sure your access keys are correct in appsettings.Development.json
- Verify your IAM user has PutObject permission

### If images upload but don't display:
- Check the bucket policy is applied correctly
- Try accessing the image URL directly in your browser
- Make sure the Resource ARN matches your bucket name
