import { exportMemoizedGoogleDoc } from "./google-doc-exporter.js";
import express from "express";
import morgan from "morgan";
import "dotenv/config.js";

const {
  MCP_CONVENTION_D_ADHESION_ID,
  MCP_POLITIQUE_DE_CONFIDENTIALITE_ID,
  MCP_CONDITIONS_GENERALES_D_UTILISATION_ID,
} = process.env;
const PORT = parseInt(process.env.PORT, 10) || 3000;

const app = express();

const logger = morgan("combined");
app.use(logger);
app.get("/favicon.ico", (req, res, next) =>
  res.sendFile("favicon.ico", { root: "." }),
);

const legalControllerFactory = (fileId) => async (req, res, next) => {
  try {
    const htmlContent = await exportMemoizedGoogleDoc(fileId);

    return res.send(htmlContent);
  } catch (e) {
    return next(e);
  }
};

app.get(
  "/moncomptepro-convention-d-adhesion",
  legalControllerFactory(MCP_CONVENTION_D_ADHESION_ID),
);
app.get(
  "/moncomptepro-politique-de-confidentialite",
  legalControllerFactory(MCP_POLITIQUE_DE_CONFIDENTIALITE_ID),
);
app.get(
  "/moncomptepro-conditions-generales-d-utilisation",
  legalControllerFactory(MCP_CONDITIONS_GENERALES_D_UTILISATION_ID),
);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
