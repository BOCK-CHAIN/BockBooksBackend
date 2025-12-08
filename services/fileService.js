// fileService.js
import { Storage } from "@google-cloud/storage";
import dotenv from "dotenv";

dotenv.config();

const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

export async function uploadBufferToGCS(buffer, filePath, contentType) {
  const file = bucket.file(filePath);
  await file.save(buffer, {
    metadata: { contentType },
    resumable: false,
  });
  return filePath; // store relative path in DB
}

export const generateUploadURL = async (filePath, contentType) => {
  const file = bucket.file(filePath);

  const [url] = await file.getSignedUrl({
    action: "write",
    expires: Date.now() + 50 * 60 * 1000, // 10 mins
    contentType,
  });

  return url;
};

export const generateReadURL = async (filePath) => {
  const file = bucket.file(filePath);

  const [url] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + 50 * 60 * 1000,
  });

  return url;
};
