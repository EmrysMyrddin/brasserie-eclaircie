import {Form, NavLink, Outlet, useCatch, useLoaderData, useTransition} from "@remix-run/react";
import type {ActionFunction, LinksFunction, LoaderFunction} from "@remix-run/node";
import styles from "~/styles/backoffice/beers.css";
import {getFormData} from "~/services/utils";
import {mutation, query} from "~/services/graphql.server";
import {gql} from "@urql/core";
import {json, redirect} from "@remix-run/node";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
}

export const loader: LoaderFunction = async () => {
  const {beers} = await query(gql`
    query all_beers {
      beers(order_by: {created_at: asc}) { id, name }
    }
  `)
  
  return json({beers})
}

export const action: ActionFunction = async ({ request }) => {
  const { beer } = await mutation(
    gql`
      mutation new_beer {
        beer: insert_beers_one(object: {name: "Nouvelle bière"}) {
          id
        }
      }
    `
  )
  if(!beer) throw json({"error": "La bière n'a pas été crée"}, 500)
  return redirect(`/backoffice/beers/${beer.id}`)
}

export default function BeersScreen() {
  const transition = useTransition()
  const {beers} = useLoaderData()
  return (
    <div className="beers-screen">
      <nav>
        {beers.map((beer: any) => (
          <NavLink key={beer.id} to={beer.id}>{beer.name}</NavLink>
        ))}
        <Form method="post">
          <button type="submit" name="new_beer" disabled={!!transition?.submission}>Créer une bière</button>
        </Form>
      </nav>
      <div className="beers-content">
        <Outlet />
      </div>
    </div>
  )
}

export function CatchBoundary() {
  const caught = useCatch();
  
  return (
    <div>
      Oups ! Un problème est survenu :-(
      <pre>
        {JSON.stringify(caught.data, null, 2)}
      </pre>
    </div>
  );
}
