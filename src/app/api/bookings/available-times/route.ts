import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';

// Initialize the DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const docClient = DynamoDBDocumentClient.from(client);

export async function GET(request: NextRequest) {
  try {
    // Get the date and barberId from the URL parameters
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const barberId = searchParams.get('barberId');

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    // Query DynamoDB for bookings on this date
    // Use ExpressionAttributeNames to handle reserved keyword 'date'
    const queryParams: QueryCommandInput = {
      TableName: process.env.DYNAMODB_TABLE_NAME || 'customerBookings',
      KeyConditionExpression: '#dateAttr = :dateValue',
      ExpressionAttributeNames: {
        '#dateAttr': 'date'  // Use this to reference the reserved keyword "date"
      },
      ExpressionAttributeValues: {
        ':dateValue': date,
      },
    };

    // If barberId is provided, filter for that specific barber
    if (barberId) {
      queryParams.FilterExpression = 'barberId = :barberId';
      if (!queryParams.ExpressionAttributeValues) {
        queryParams.ExpressionAttributeValues = {};
      }
      queryParams.ExpressionAttributeValues[':barberId'] = barberId;
    }

    const command = new QueryCommand(queryParams);
    const response = await docClient.send(command);

    // Extract the booked time slots
    const bookedTimeSlots = response.Items?.map(item => {
      // Parse the sortKey to get the time
      const sortKey = item['time#barberId#customerId'] as string;
      const time = sortKey.split('#')[0];
      return {
        time,
        barberId: item.barberId,
        date: item.date,
      };
    }) || [];

    return NextResponse.json({
      success: true,
      bookedTimeSlots,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch available time slots', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 