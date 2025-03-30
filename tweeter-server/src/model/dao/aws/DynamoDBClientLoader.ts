import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class DynamoDBClientLoader {
    private static instance: DynamoDBClientLoader | null = null;
    public documentClient = DynamoDBDocumentClient.from(new DynamoDBClient());

    private constructor() { }

    public static getInstance(): DynamoDBClientLoader {
        if (this.instance === null) {
            this.instance = new DynamoDBClientLoader();
        }
        return this.instance;
    }
}