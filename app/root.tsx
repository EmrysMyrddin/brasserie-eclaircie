import {
  Links, LinksFunction,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  MetaFunction,
} from "remix";

import stylesUrl from "./styles/global.css";
import type { ReactNode} from "react";

export const meta: MetaFunction = () => {
  return { title: "Brasserie l'Éclaircie" };
};

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function App() {
  return (
    <Document>
      <Outlet/>
    </Document>
  )
}

export function Document({children}: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}


export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document>
      <h1>Une erreur est survenue</h1>
      <p>
        Veuillez contacter l'administrateur avec le message d'erreur suivant :
      </p>
      <pre>{error.message}</pre>
    </Document>
  );
}
