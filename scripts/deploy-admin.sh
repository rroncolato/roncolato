#!/bin/bash

echo "🚀 Admin Area Vercel Deployment Setup"
echo "======================================"
echo ""

# Check if .env exists
if [ -f .env ]; then
  echo "✓ .env file found"
else
  echo "⚠️  .env file not found. Creating from .env.example..."
  cp .env.example .env
  echo "✓ .env created - please edit it with your credentials"
fi

# Generate JWT_SECRET if not present
if grep -q "your-super-secret" .env; then
  echo ""
  echo "🔐 Generating JWT_SECRET..."
  JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
  sed -i "s/your-super-secret-jwt-key-here-min-32-characters/$JWT_SECRET/" .env
  echo "✓ JWT_SECRET generated and added to .env"
fi

echo ""
echo "📦 Next steps:"
echo "1. Edit .env file to set your admin credentials"
echo "2. Configure data persistence (see ADMIN_DEPLOYMENT.md)"
echo "3. Run: npm run deploy"
echo ""
echo "For more details, see ADMIN_DEPLOYMENT.md"
