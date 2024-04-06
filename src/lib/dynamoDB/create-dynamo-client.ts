import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { config } from 'dotenv';
import { AWS_REGION, DYNAMO_DB_URI } from '../../consts';
config();


const createDynamoClient = () => {
  let dynamoClient: DynamoDBDocument | null = null;

  if (!dynamoClient) {
    const client = new DynamoDBClient({
      region: AWS_REGION,
      endpoint: process.env.IS_OFFLINE ? DYNAMO_DB_URI : undefined,
      retryMode: 'adaptive',
      maxAttempts: 5,
    })

    const marshallOptions = {
      convertEmptyValues: true,
      removeUndefinedValues: true,
      convertClassInstanceToMap: true,
    }

    const translateConfig = { marshallOptions }

    dynamoClient = DynamoDBDocument.from(client, translateConfig)
    return dynamoClient
  }

  return dynamoClient
}

export default createDynamoClient
