# AWS Setup Guide for Daily Words

This guide will help you set up AWS S3, CloudFront, and GitHub Actions for automated deployment of the Daily Words application.

## Prerequisites

- AWS Account
- GitHub Account
- AWS CLI installed (optional, but recommended)

## Step 1: Create an S3 Bucket

1. Log in to the AWS Management Console
2. Navigate to S3
3. Click "Create bucket"
4. Configure the bucket:
   - **Bucket name**: Choose a unique name (e.g., `daily-words-app`)
   - **Region**: Select your preferred region (e.g., `us-east-1`)
   - **Block Public Access settings**: Uncheck "Block all public access" (we'll configure specific permissions)
   - Acknowledge the warning about public access
5. Click "Create bucket"

## Step 2: Configure S3 Bucket for Static Website Hosting

1. Go to your bucket
2. Click on the "Properties" tab
3. Scroll down to "Static website hosting"
4. Click "Edit"
5. Enable static website hosting
6. Set:
   - **Index document**: `index.html`
   - **Error document**: `index.html` (for React Router support)
7. Click "Save changes"
8. Note the endpoint URL provided

## Step 3: Set Bucket Policy for Public Access

1. Go to the "Permissions" tab
2. Scroll to "Bucket policy"
3. Click "Edit"
4. Add the following policy (replace `YOUR-BUCKET-NAME` with your actual bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```

5. Click "Save changes"

## Step 4: Create CloudFront Distribution

1. Navigate to CloudFront in AWS Console
2. Click "Create distribution"
3. Configure the distribution:
   - **Origin domain**: Select your S3 bucket from the dropdown
   - **Origin access**: Select "Origin access control settings (recommended)"
   - Click "Create control setting" and then "Create"
   - **Viewer protocol policy**: Redirect HTTP to HTTPS
   - **Allowed HTTP methods**: GET, HEAD, OPTIONS
   - **Cache policy**: CachingOptimized
   - **Default root object**: `index.html`
4. Click "Create distribution"
5. Wait for the distribution to deploy (this may take 15-20 minutes)
6. Note your **Distribution ID** and **Distribution domain name**

## Step 5: Update S3 Bucket Policy for CloudFront

After creating the CloudFront distribution, you'll need to update your S3 bucket policy to allow CloudFront access:

1. Go back to your S3 bucket's "Permissions" tab
2. CloudFront will provide a policy statement to add
3. Update your bucket policy to include CloudFront Origin Access Control

## Step 6: Create IAM User for GitHub Actions

1. Navigate to IAM in AWS Console
2. Click "Users" → "Add users"
3. Set:
   - **User name**: `github-actions-deploy`
   - **Access type**: Programmatic access
4. Click "Next: Permissions"
5. Click "Attach existing policies directly"
6. Create a custom policy or attach these policies:
   - `AmazonS3FullAccess` (or create a more restrictive policy for your specific bucket)
   - `CloudFrontFullAccess` (or create a more restrictive policy)
7. Better option: Create a custom policy with minimal permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR-BUCKET-NAME",
        "arn:aws:s3:::YOUR-BUCKET-NAME/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "arn:aws:cloudfront::YOUR-ACCOUNT-ID:distribution/YOUR-DISTRIBUTION-ID"
    }
  ]
}
```

8. Complete the user creation
9. **Important**: Save the Access Key ID and Secret Access Key (you won't be able to see the secret key again)

## Step 7: Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret" and add the following secrets:

   - **AWS_ACCESS_KEY_ID**: Your IAM user's access key ID
   - **AWS_SECRET_ACCESS_KEY**: Your IAM user's secret access key
   - **AWS_REGION**: Your AWS region (e.g., `us-east-1`)
   - **S3_BUCKET_NAME**: Your S3 bucket name
   - **CLOUDFRONT_DISTRIBUTION_ID**: Your CloudFront distribution ID

## Step 8: Test Deployment

1. Push your code to the `main` branch
2. Go to "Actions" tab in your GitHub repository
3. Watch the deployment workflow run
4. Once completed, visit your CloudFront domain name to see your app

## Custom Domain (Optional)

To use a custom domain:

1. **Register domain** (or use existing one in Route 53 or another registrar)
2. **Request SSL certificate** in AWS Certificate Manager (must be in us-east-1 for CloudFront)
3. **Add alternate domain name** to CloudFront distribution
4. **Configure DNS** to point to CloudFront distribution
5. **Update bucket policy** if needed

## Troubleshooting

### Issue: GitHub Actions fails with permission error
- Verify your IAM user has the correct permissions
- Check that all GitHub secrets are set correctly

### Issue: Website shows 403 Forbidden
- Check your S3 bucket policy allows public read access
- Verify CloudFront distribution is properly configured

### Issue: Changes don't appear immediately
- CloudFront caches content; the invalidation in the workflow should clear this
- You can manually create an invalidation for `/*` in CloudFront console

### Issue: React Router routes show 404
- Ensure your error document is set to `index.html` in S3 bucket settings
- Configure custom error responses in CloudFront to return `index.html` with 200 status

## Security Notes

- Never commit AWS credentials to your repository
- Use IAM policies with minimal required permissions
- Enable MFA on your AWS account
- Regularly rotate access keys
- Monitor AWS CloudWatch for unusual activity

## Cost Considerations

- **S3**: Very low cost for static hosting (typically under $1/month for small apps)
- **CloudFront**: First 1TB of data transfer is often free tier eligible
- **Route 53**: ~$0.50/month per hosted zone (if using custom domain)

## Support

For issues with AWS services, refer to:
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
