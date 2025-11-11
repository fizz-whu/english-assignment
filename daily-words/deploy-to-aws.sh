#!/bin/bash

# Automated AWS Deployment Script for Daily Words App
# This script sets up S3, CloudFront, and deploys your app

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Daily Words AWS Deployment ===${NC}\n"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed${NC}"
    echo "Install it from: https://aws.amazon.com/cli/"
    exit 1
fi

# Check if AWS is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not configured${NC}"
    echo "Run: aws configure"
    exit 1
fi

echo -e "${GREEN}✓ AWS CLI is configured${NC}\n"

# Prompt for bucket name
read -p "Enter S3 bucket name (e.g., daily-words-app-fizz): " BUCKET_NAME
if [ -z "$BUCKET_NAME" ]; then
    echo -e "${RED}Error: Bucket name is required${NC}"
    exit 1
fi

# Set region
REGION="us-east-1"
echo -e "Using region: ${GREEN}$REGION${NC}\n"

# Get AWS account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo -e "AWS Account ID: ${GREEN}$ACCOUNT_ID${NC}\n"

# Step 1: Create S3 Bucket
echo -e "${YELLOW}Step 1: Creating S3 bucket...${NC}"
if aws s3 ls "s3://$BUCKET_NAME" 2>&1 | grep -q 'NoSuchBucket'; then
    aws s3 mb "s3://$BUCKET_NAME" --region "$REGION"
    echo -e "${GREEN}✓ Bucket created${NC}\n"
else
    echo -e "${YELLOW}! Bucket already exists${NC}\n"
fi

# Step 2: Configure static website hosting
echo -e "${YELLOW}Step 2: Configuring static website hosting...${NC}"
aws s3 website "s3://$BUCKET_NAME" \
    --index-document index.html \
    --error-document index.html
echo -e "${GREEN}✓ Website hosting configured${NC}\n"

# Step 3: Disable block public access
echo -e "${YELLOW}Step 3: Configuring public access...${NC}"
aws s3api put-public-access-block \
    --bucket "$BUCKET_NAME" \
    --public-access-block-configuration \
    "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
echo -e "${GREEN}✓ Public access configured${NC}\n"

# Step 4: Set bucket policy
echo -e "${YELLOW}Step 4: Setting bucket policy...${NC}"
cat > /tmp/bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy \
    --bucket "$BUCKET_NAME" \
    --policy file:///tmp/bucket-policy.json
echo -e "${GREEN}✓ Bucket policy applied${NC}\n"

# Step 5: Build the application
echo -e "${YELLOW}Step 5: Building application...${NC}"
npm run build
echo -e "${GREEN}✓ Application built${NC}\n"

# Step 6: Deploy to S3
echo -e "${YELLOW}Step 6: Deploying to S3...${NC}"
aws s3 sync dist/ "s3://$BUCKET_NAME" --delete
echo -e "${GREEN}✓ Deployed to S3${NC}\n"

# Calculate S3 website URL
S3_URL="http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"

echo -e "${GREEN}=== Deployment Complete! ===${NC}\n"
echo -e "Your website is now live at:"
echo -e "${GREEN}$S3_URL${NC}\n"

# Ask about CloudFront
echo -e "${YELLOW}Would you like to set up CloudFront CDN? (recommended for production)${NC}"
echo -e "This will give you HTTPS and better performance, but takes 15-20 minutes to deploy."
read -p "Set up CloudFront? (y/n): " SETUP_CLOUDFRONT

if [ "$SETUP_CLOUDFRONT" = "y" ] || [ "$SETUP_CLOUDFRONT" = "Y" ]; then
    echo -e "\n${YELLOW}Setting up CloudFront...${NC}"

    # Create CloudFront distribution
    cat > /tmp/cf-config.json << EOF
{
  "CallerReference": "daily-words-$(date +%s)",
  "Comment": "Daily Words App",
  "Enabled": true,
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-$BUCKET_NAME",
        "DomainName": "$BUCKET_NAME.s3-website-$REGION.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only",
          "OriginSslProtocols": {
            "Quantity": 1,
            "Items": ["TLSv1.2"]
          }
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-$BUCKET_NAME",
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
      "Cookies": {
        "Forward": "none"
      },
      "Headers": {
        "Quantity": 0
      }
    },
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000
  }
}
EOF

    DISTRIBUTION_OUTPUT=$(aws cloudfront create-distribution --distribution-config file:///tmp/cf-config.json)
    DISTRIBUTION_ID=$(echo "$DISTRIBUTION_OUTPUT" | grep -o '"Id": "[^"]*"' | head -1 | cut -d'"' -f4)
    DISTRIBUTION_DOMAIN=$(echo "$DISTRIBUTION_OUTPUT" | grep -o '"DomainName": "[^"]*"' | head -1 | cut -d'"' -f4)

    echo -e "${GREEN}✓ CloudFront distribution created${NC}\n"
    echo -e "Distribution ID: ${GREEN}$DISTRIBUTION_ID${NC}"
    echo -e "Distribution Domain: ${GREEN}$DISTRIBUTION_DOMAIN${NC}\n"
    echo -e "${YELLOW}Note: CloudFront is deploying... This takes 15-20 minutes.${NC}"
    echo -e "Your site will be available at: ${GREEN}https://$DISTRIBUTION_DOMAIN${NC}\n"
fi

# Step 7: Save configuration for GitHub Actions
echo -e "${YELLOW}Step 7: Saving configuration...${NC}"
cat > deployment-config.txt << EOF
# GitHub Secrets Configuration
# Add these secrets to: https://github.com/fizz-whu/english-assignment/settings/secrets/actions

AWS_REGION=$REGION
S3_BUCKET_NAME=$BUCKET_NAME
CLOUDFRONT_DISTRIBUTION_ID=$DISTRIBUTION_ID

# Your AWS Access Keys (get from IAM console):
AWS_ACCESS_KEY_ID=<YOUR_ACCESS_KEY>
AWS_SECRET_ACCESS_KEY=<YOUR_SECRET_KEY>

# Current Deployment URLs:
S3 Website: $S3_URL
EOF

if [ -n "$DISTRIBUTION_DOMAIN" ]; then
    echo "CloudFront URL: https://$DISTRIBUTION_DOMAIN" >> deployment-config.txt
fi

echo -e "${GREEN}✓ Configuration saved to deployment-config.txt${NC}\n"

echo -e "${GREEN}=== Next Steps ===${NC}"
echo -e "1. Visit your site: ${GREEN}$S3_URL${NC}"
if [ -n "$DISTRIBUTION_DOMAIN" ]; then
    echo -e "2. Wait 15-20 minutes, then visit: ${GREEN}https://$DISTRIBUTION_DOMAIN${NC}"
fi
echo -e "3. Add GitHub secrets from deployment-config.txt for automatic deployments"
echo -e "4. View configuration: ${GREEN}cat deployment-config.txt${NC}\n"

echo -e "${GREEN}🎉 Deployment successful!${NC}"
