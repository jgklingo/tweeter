export interface UserImageDao {
    insert: (fileName: string, imageStringBase64Encoded: string) => Promise<string>;  // returns s3 url
}
