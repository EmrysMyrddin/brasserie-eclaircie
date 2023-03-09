import type { ActionFunction, LoaderFunction, LinksFunction } from "@remix-run/node";
import { logout, requireUser, requireUserId } from "~/services/session.server";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useCatch, useLoaderData } from "@remix-run/react";
import styles from "~/styles/backoffice/backoffice.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
}

export const loader: LoaderFunction = async ({ request }) => {
  const me = await requireUser(request)
  return json({ me })
}

export const action: ActionFunction = async ({ request }) => {
  await requireUserId(request)
  return logout(request)
}

export default function BackofficeLayout() {
  const { me: { email } } = useLoaderData()
  return (
    <div className="backoffice-screen">
      <Form method="post" className="backoffice-header">
        <h1>Backoffice</h1>
        <Link to="/">Aller au site</Link>
        <div className="authentication">
          <div>{email}</div>
          <button type="submit" name="logout">Déconnexion</button>
        </div>
      </Form>
      <nav>
        <NavLink to="beers">Bières</NavLink>
        <NavLink to="engagement">Engagement</NavLink>
        <NavLink to="users">Utilisateurs</NavLink>
        <NavLink to="blog">Blog</NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export function CatchBoundary() {
  const caught = useCatch();
  console.log('error caught', caught)

  return (
    <div>
      Oups ! Un problème est survenu :-(
      <pre>
        {caught.data.message ?? JSON.stringify(caught.data, null, 2)}
      </pre>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.log(error)
  return (
    <div>
      <p>Oups ! Une erreur est survenue :-(</p>
      <pre>{error.stack}</pre>
    </div>
  );
}