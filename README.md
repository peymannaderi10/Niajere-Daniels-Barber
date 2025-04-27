# CleanCuts Barber Website

A modern website for CleanCuts Barber Shop featuring online booking, service information, and contact details.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure AWS credentials:
   - Create a `.env.local` file in the root directory
   - Add the following environment variables with your AWS credentials:
   ```
   AWS_ACCESS_KEY_ID=your_access_key_here
   AWS_SECRET_ACCESS_KEY=your_secret_key_here
   AWS_REGION=your_aws_region (default: us-east-1)
   DYNAMODB_TABLE_NAME=customerBookings
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## DynamoDB Schema

The application uses a DynamoDB table with the following structure:

- Table Name: `customerBookings`
- Partition Key: `date` (String) - Format: YYYY-MM-DD
- Sort Key: `time#barberId#customerId` (String) - The attribute name is literally "time#barberId#customerId"

Example item:
```json
{
  "date": "2023-11-25",
  "time#barberId#customerId": "3:30 PM#1#customer-12345",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "5551234567",
  "notes": "Short on sides, trim on top",
  "barberName": "Mark Smith",
  "barberId": "1",
  "time": "3:30 PM",
  "status": "confirmed",
  "createdAt": "2023-11-20T14:30:00Z"
}
```

## Deployment

This is a Next.js application that can be deployed to platforms like Vercel, Render, or AWS Amplify.

When deploying to a hosting service, make sure to set the environment variables (AWS credentials and region) in the hosting service's settings.

**IMPORTANT:** Never commit your actual AWS credentials to the repository. Always use environment variables for secrets.
