import type {ActionFunction, LoaderFunction, LinksFunction} from "@remix-run/node";
import {logout, requireUser} from "~/services/session.server";
import {json} from "@remix-run/node";
import {Form, NavLink, Outlet, useLoaderData} from "@remix-run/react";
import styles from "~/styles/backoffice/backoffice.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
}

export const loader: LoaderFunction = async ({request}) => {
  const me = await requireUser(request)
  return json({ me })
}

export const action: ActionFunction = async ({request}) => {
  return logout(request)
}

export default function BackofficeLayout() {
  const { me: {email}} = useLoaderData()
  return (
    <div className="backoffice-screen">
      <Form method="post" className="backoffice-header">
        <h1>Backoffice</h1>
        <div>{email}</div>
        <button type="submit" name="logout">Déconnexion</button>
      </Form>
      <nav>
        <NavLink to="beers">Bières</NavLink>
        <NavLink to="users">Utilisateurs</NavLink>
        <NavLink to="blog">Blog</NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
