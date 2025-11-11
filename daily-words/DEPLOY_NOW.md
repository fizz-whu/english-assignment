# Deploy Your App Now - Quick Guide

Your code is already on GitHub! Follow these steps to get it live on AWS.

## Prerequisites

- AWS Account
- AWS CLI installed and configured (`aws configure`)

## Option 1: Automated Setup Script (Recommended)

I'll create a script to automate most of this for you.

## Option 2: Manual Setup (15 minutes)

### Step 1: Create S3 Bucket

Choose a unique bucket name (e.g., `daily-words-app-fizz`) and run:

```bash
# Set your bucket name
BUCKET_NAME="daily-words-app-fizz"
REGION="us-east-1"

# Create bucket
aws s3 mb s3://$BUCKET_NAME --region $REGION

# Enable static website hosting
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# Set bucket policy for public access
cat > /tmp/bucket-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::BUCKET_NAME_HERE/*"
    }
  ]
}
EOF

# Replace bucket name in policy
sed "s/BUCKET_NAME_HERE/$BUCKET_NAME/g" /tmp/bucket-policy.json > /tmp/bucket-policy-final.json

# Apply policy
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file:///tmp/bucket-policy-final.json

# Disable block public access
aws s3api put-public-access-block --bucket $BUCKET_NAME --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
```

### Step 2: Create CloudFront Distribution

```bash
# Create CloudFront distribution
cat > /tmp/cf-config.json << 'EOF'
{
  "CallerReference": "daily-words-'$(date +%s)'",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-BUCKET_NAME_HERE",
        "DomainName": "BUCKET_NAME_HERE.s3-website-us-east-1.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only"
        }
      }
    ]
  },
  "DefaultRootObject": "index.html",
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-BUCKET_NAME_HERE",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"],
      "CachedMethods": {
        "Quantity": 2,
        "Items": ["GET", "HEAD"]
      }
    },
    "Compress": true,
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {"Forward": "none"}
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000
  },
  "Enabled": true,
  "Comment": "Daily Words App"
}
EOF

# Replace bucket name
sed "s/BUCKET_NAME_HERE/$BUCKET_NAME/g" /tmp/cf-config.json > /tmp/cf-config-final.json

# Create distribution (this takes 15-20 minutes)
aws cloudfront create-distribution --distribution-config file:///tmp/cf-config-final.json
```

### Step 3: Set GitHub Secrets

Go to your GitHub repository:
https://github.com/fizz-whu/english-assignment/settings/secrets/actions

Click "New repository secret" and add these:

1. **AWS_ACCESS_KEY_ID**: Your AWS access key
2. **AWS_SECRET_ACCESS_KEY**: Your AWS secret key
3. **AWS_REGION**: `us-east-1` (or your chosen region)
4. **S3_BUCKET_NAME**: Your bucket name
5. **CLOUDFRONT_DISTRIBUTION_ID**: From CloudFront console

### Step 4: Trigger Deployment

```bash
# Make a small change to trigger deployment
echo "# Deploy" >> README.md
git add README.md
git commit -m "Trigger deployment"
git push origin main
```

### Step 5: Get Your URL

Check GitHub Actions: https://github.com/fizz-whu/english-assignment/actions

Once complete, your app will be live at:
- **S3 URL**: `http://BUCKET_NAME.s3-website-us-east-1.amazonaws.com`
- **CloudFront URL**: Check CloudFront console for the domain name (e.g., `d1234567890.cloudfront.net`)

---

## Quick Deploy Script

Want me to create an automated script that does all of this for you? Let me know!

## Alternative: Manual First Deployment

If you want to see it live immediately without CloudFront:

```bash
cd daily-words
npm run build
aws s3 sync dist/ s3://$BUCKET_NAME --delete
```

Then visit: `http://BUCKET_NAME.s3-website-us-east-1.amazonaws.com`
