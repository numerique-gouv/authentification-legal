import { exportMemoizedGoogleDoc } from "./google-doc-exporter.js";
import express from "express";
import morgan from "morgan";
import "dotenv/config.js";

const { MCP_CONVENTION_D_ADHESION_ID } = process.env;
const PORT = parseInt(process.env.PORT, 10) || 3000;

const app = express();

const logger = morgan("combined");
app.use(logger);

const legalControllerFactory = (fileId) => async (req, res, next) => {
  try {
    console.log(fileId, "fileId");
    const htmlContent = await exportMemoizedGoogleDoc(fileId);

    return res.send(htmlContent);
  } catch (e) {
    return next(e);
  }
};

app.get(
  "/mcp-convention-d-adhesion",
  legalControllerFactory(MCP_CONVENTION_D_ADHESION_ID),
);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
