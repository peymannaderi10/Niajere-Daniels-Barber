import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

// Initialize the DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const docClient = DynamoDBDocumentClient.from(client);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      date, 
      time, 
      barberId, 
      barberName, 
      firstName, 
      lastName, 
      email, 
      phone, 
      notes,
      paymentIntentId,
      paymentStatus
    } = body;

    // Validate required fields
    if (!date || !time || !barberId || !firstName || !lastName || !email || !phone || !paymentIntentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a unique customer ID
    const customerId = `customer-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    
    // Create the sort key value
    const sortKeyValue = `${time}#${barberId}#${customerId}`;

    // Prepare the booking data for DynamoDB
    // Using the exact attribute name expected by your DynamoDB table
    const bookingItem = {
      date: date, // Partition key
      ["time#barberId#customerId"]: sortKeyValue, // Sort key with the exact name expected
      firstName,
      lastName,
      email,
      phone,
      notes: notes || '',
      barberName,
      barberId,
      time,
      paymentIntentId,
      paymentStatus: paymentStatus || 'pending',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    // Create a PutCommand to add the booking to DynamoDB
    const command = new PutCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || 'customerBookings',
      Item: bookingItem,
    });

    // Execute the command
    await docClient.send(command);

    // Format the response data to include standard sort key for the client
    const responseData = {
      ...bookingItem,
      sortKey: sortKeyValue, // Include this for the client
    };

    // Return success response with the booking details
    return NextResponse.json({ 
      success: true, 
      booking: responseData
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create booking', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined 
      },
      { status: 500 }
    );
  }
} 