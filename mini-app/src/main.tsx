import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import App from "./App";
import "./index.css";

const MANIFEST_URL =
  import.meta.env.VITE_TC_MANIFEST_URL ??
  "https://raw.githubusercontent.com/studynakamoto/1ton/main/mini-app/public/tonconnect-manifest.json";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TonConnectUIProvider manifestUrl={MANIFEST_URL}>
      <App />
    </TonConnectUIProvider>
  </StrictMode>
);
