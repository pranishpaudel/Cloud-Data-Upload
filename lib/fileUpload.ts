import fs from "fs";
import AWS from "aws-sdk";
import formidable from "formidable";

const s3 = new AWS.S3({
  endpoint: process.env.DO_SPACES_URL,
  region: "blr1",
  credentials: {
    accessKeyId: process.env.DO_SPACES_ID as string,
    secretAccessKey: process.env.DO_SPACES_SECRET as string,
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};
