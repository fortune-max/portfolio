import stylesheet from "~/tailwind.css";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Header } from "./components/Header";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet }
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Fortune's Portfolio",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Header/>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <span>_</span>
      </body>
    </html>
  );
}
