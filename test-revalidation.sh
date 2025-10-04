#!/bin/bash

# Revalidation Test Script
# This script helps you test the revalidation endpoint

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔄 Testing Revalidation Endpoint${NC}"
echo ""

# Check if token is provided
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: No token provided${NC}"
    echo ""
    echo "Usage: ./test-revalidation.sh YOUR_SECRET_TOKEN [URL]"
    echo ""
    echo "Examples:"
    echo "  ./test-revalidation.sh my-secret-token"
    echo "  ./test-revalidation.sh my-secret-token https://yourdomain.com"
    echo ""
    exit 1
fi

TOKEN=$1
URL=${2:-"http://localhost:3000"}

echo "🌐 Testing URL: $URL/api/revalidate"
echo "🔑 Using token: ${TOKEN:0:10}..."
echo ""

# Make the request
RESPONSE=$(curl -s -w "\n%{http_code}" "$URL/api/revalidate?token=$TOKEN")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "📡 Response:"
echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
echo ""

# Check HTTP status code
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Success! Status code: $HTTP_CODE${NC}"
    echo ""
    echo -e "${GREEN}🎉 Revalidation completed successfully!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Make a change in Sanity Studio"
    echo "2. Run this script again"
    echo "3. Refresh your website to see the changes"
elif [ "$HTTP_CODE" = "401" ]; then
    echo -e "${RED}❌ Unauthorized! Status code: $HTTP_CODE${NC}"
    echo ""
    echo "Possible issues:"
    echo "- Token doesn't match SANITY_REVALIDATE_SECRET in .env.local"
    echo "- SANITY_REVALIDATE_SECRET is not set"
    echo "- Token has extra spaces or special characters"
elif [ "$HTTP_CODE" = "500" ]; then
    echo -e "${RED}❌ Server Error! Status code: $HTTP_CODE${NC}"
    echo ""
    echo "Check your server logs for more details"
else
    echo -e "${RED}❌ Failed! Status code: $HTTP_CODE${NC}"
fi

echo ""
