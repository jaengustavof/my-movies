// src/entry-server.tsx

import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "./App";

export default function render(url: string) {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );
}
