import { S3Client } from '@aws-sdk/client-s3';

export class S3ClientSingleton {
    private static instance: S3Client;

    public static getInstance(): S3Client {
        if (!S3ClientSingleton.instance) {
            S3ClientSingleton.instance = new S3Client({ region: process.env.AWS_REGION });
        }
        return S3ClientSingleton.instance;
    }
}
