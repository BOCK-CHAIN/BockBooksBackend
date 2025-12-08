import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  keyFilename: "service-account.json",     // path to the JSON file
});

export const bucket = storage.bucket("bock-books-bucket"); 
