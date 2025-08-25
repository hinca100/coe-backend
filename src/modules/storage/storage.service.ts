import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import * as path from 'path';

@Injectable()
export class StorageService {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000', // MinIO local
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || 'minio',
        secretAccessKey: process.env.S3_SECRET_KEY || 'minio123',
      },
      forcePathStyle: true, // necesario para MinIO
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const key = `${uuid()}${path.extname(file.originalname)}`;
    await this.s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET || 'coe-bucket',
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return `${process.env.S3_PUBLIC_URL || this.s3.config.endpoint}/${process.env.S3_BUCKET || 'coe-bucket'}/${key}`;
  }
}