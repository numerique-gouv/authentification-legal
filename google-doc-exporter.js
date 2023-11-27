import { google } from "googleapis";
import { memoize } from "lodash-es";
import { CacheWithExpiration } from "./cache.js";
import "dotenv/config.js";

const { CLIENT_EMAIL, PRIVATE_KEY } = process.env;
const CACHE_EXPIRATION_IN_SECONDS =
  parseInt(process.env.CACHE_EXPIRATION_IN_SECONDS, 10) || 1 * 60 * 60; // 1 hour

const auth = new google.auth.JWT({
  email: CLIENT_EMAIL,
  key: PRIVATE_KEY,
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

const drive = google.drive({
  version: "v3",
  auth,
});

const exportGoogleDoc = async (fileId) => {
  console.log(`Downloading doc ${fileId}...`);
  const response = await drive.files.export(
    {
      fileId: fileId,
      mimeType: "text/html",
    },
    { responseType: "stream" },
  );

  return new Promise((resolve, reject) => {
    let htmlContent = "";
    response.data
      .on("data", (data) => {
        htmlContent += data.toString();
      })
      .on("end", () => {
        console.log(`Doc ${fileId} downloaded!`);
        resolve(htmlContent);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

export const exportMemoizedGoogleDoc = memoize(exportGoogleDoc);

exportMemoizedGoogleDoc.cache = new CacheWithExpiration(
  CACHE_EXPIRATION_IN_SECONDS * 1000,
);
