import type {ActionFunction, LoaderFunction} from "@remix-run/node";
import {logout, requireUser} from "~/services/session.server";
import {json} from "@remix-run/node";
import {Form, Outlet, useLoaderData} from "@remix-run/react";

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
    <div>
      <Form method="post">
        {email}
        <button type="submit" name="logout">Déconnection</button>
      </Form>
      <Outlet />
    </div>
  )
}
