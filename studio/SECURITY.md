# Security Guidelines

## Environment Variables

**IMPORTANT**: This project uses environment variables for all sensitive configuration. Never commit real API keys, secrets, or credentials to the repository.

### Required Environment Variables

All sensitive data must be stored in a `.env` file (which is git-ignored) or exported as environment variables.

#### Required for all deployments:
- `GOOGLE_AI_API_KEY` - Your Google AI API key for Gemini
- `COGNITO_USER_POOL_ID` - AWS Cognito User Pool ID
- `NEXT_PUBLIC_COGNITO_USER_POOL_ID` - Same as above (for frontend)
- `NEXT_PUBLIC_COGNITO_CLIENT_ID` - AWS Cognito App Client ID

#### Required for AWS deployments only:
- `AWS_ACCESS_KEY_ID` - AWS access key for deployment
- `AWS_SECRET_ACCESS_KEY` - AWS secret key for deployment
- `EC2_KEY_PAIR_NAME` - Your EC2 key pair name
- `SECURITY_GROUP_ID` - Security group ID for EC2
- `SUBNET_ID` - (Optional) Subnet ID for EC2

### Setup Instructions

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your actual values:
   ```bash
   # NEVER commit this file!
   nano .env
   ```

3. Verify `.env` is in `.gitignore`:
   ```bash
   grep -q "^\.env" .gitignore && echo "✅ .env is properly ignored" || echo "❌ Add .env to .gitignore!"
   ```

## Pre-commit Checklist

Before pushing to a public repository:

- [ ] All API keys are in `.env` or environment variables
- [ ] `.env` file is listed in `.gitignore`
- [ ] `.env.example` contains only placeholder values
- [ ] No hardcoded credentials in source code
- [ ] No AWS credentials in deployment scripts
- [ ] No Cognito Pool IDs hardcoded in code

## Deployment Security

### Simple Deployment (deploy-simple.sh)
The deployment script automatically loads `.env` and validates required variables:
```bash
./deploy-simple.sh
```

### AWS Deployment (deploy-aws.sh)
Ensure all required environment variables are set before running:
```bash
./deploy-aws.sh
```

## If Credentials Are Leaked

If you accidentally commit credentials:

1. **Immediately revoke/rotate** all exposed credentials
2. **Remove from git history** using:
   ```bash
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch studio/.env" \
   --prune-empty --tag-name-filter cat -- --all
   ```
3. **Force push** (only if safe to do so):
   ```bash
   git push origin --force --all
   ```
4. **Create new credentials** and update `.env`

## Best Practices

1. **Never** hardcode secrets in source code
2. **Always** use environment variables for configuration
3. **Keep** `.env` out of version control
4. **Use** `.env.example` as a template with placeholder values
5. **Rotate** credentials regularly
6. **Limit** AWS IAM permissions to minimum required
7. **Enable** AWS CloudTrail for audit logging
8. **Use** AWS Secrets Manager for production deployments

## Reporting Security Issues

If you discover a security vulnerability, please email the maintainers directly. Do not open a public issue.
