import { UserImageDao } from "../interface/UserImageDao";
import { ObjectCannedACL, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export class S3UserImageDao implements UserImageDao {
    private readonly BUCKET = "jgklingo-tweeter";
    private readonly REGION = "us-east-1";

    async insert(
        fileName: string,
        imageStringBase64Encoded: string
    ): Promise<string> {
        let decodedImageBuffer: Buffer = Buffer.from(
            imageStringBase64Encoded,
            "base64"
        );
        const s3Params = {
            Bucket: this.BUCKET,
            Key: "image/" + fileName,
            Body: decodedImageBuffer,
            ContentType: "image/png",
            ACL: ObjectCannedACL.public_read,
        };
        const c = new PutObjectCommand(s3Params);
        const client = new S3Client({ region: this.REGION });
        try {
            await client.send(c);
            return (
                `https://${this.BUCKET}.s3.${this.REGION}.amazonaws.com/image/${fileName}`
            );
        } catch (error) {
            throw Error("[Internal Server Error] s3 put image failed with: " + error);
        }
    }
}