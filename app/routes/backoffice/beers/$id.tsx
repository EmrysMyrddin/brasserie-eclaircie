import { Form, useCatch, useLoaderData, useTransition } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { getFormData } from "~/services/utils";
import { mutation, query } from "~/services/graphql.server";
import { gql } from "@urql/core";
import { useState } from "react";
import { requireUserId } from "~/services/session.server";

export const loader: LoaderFunction = async ({ request, params: { id } }) => {
  await requireUserId(request)
  const { beer } = await query(gql`
    query get_beer($id: uuid!) {
      beer: beers_by_pk(id: $id) {
        id, name, short_description, long_description, image_url, color
      }
    }
  `, { id })

  if (!beer) throw json({ beer: { id } }, { status: 404 })
  return json({ beer })
}

export const action: ActionFunction = async ({ request }) => {
  await requireUserId(request)
  const { action, id, ...beer } = await getFormData(request)

  switch (action) {
    case 'save': {
      const updated = await mutation(
        gql`
          mutation update_beer($id: uuid!, $beer: beers_set_input!) {
            beer: update_beers_by_pk(pk_columns: {id: $id}, _set: $beer) { id }
          }
        `,
        { id, beer }
      )
      return json({ beer: updated.beer })
    }
    case 'delete': {
      await mutation(
        gql`
          mutation delete_beer($id: uuid!) {
            beer: delete_beers_by_pk(id: $id) { id }
          }
        `, { id }
      )

      return redirect('/backoffice/beers')
    }
  }

}

export default function BeerScreen() {
  const transition = useTransition()
  const { beer } = useLoaderData()
  return (
    <>
      <Form method="post" className="beer-form" key={beer.id}>
        <input type="hidden" name="id" value={beer.id} />
        <div>
          <label>
            Nom :
            <input name="name" required defaultValue={beer.name} />
          </label>

          <label>
            Couleur :
            <input type="color" name="color" required defaultValue={beer.color} />
          </label>

          <label>
            Description courte :
            <textarea name="short_description" rows={4} defaultValue={beer.short_description} />
          </label>

          <label>
            Description longue :
            <textarea name="long_description" rows={10} defaultValue={beer.long_description} />
          </label>
        </div>

        <ImageSelector defaultValue={beer.image_url} />

        <div className="actions">
          <button type="submit" disabled={!!transition?.submission} name="action" value="save">Sauvegarder</button>
          <button type="reset" disabled={!!transition?.submission}>Reset</button>
          <button type="submit" disabled={!!transition?.submission} name="action" value="delete">Supprimer</button>
        </div>
      </Form>
    </>
  )
}

function ImageSelector({ defaultValue }: { defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue)
  return (
    <div className="image-selector">
      <label>
        Image :
        <input name="image_url" defaultValue={defaultValue} onChange={e => setValue(e.target.value)} />
      </label>
      <img src={value} alt="illustration de la bière" />
    </div>
  )
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) return <div>Oups ! Cette bière n'existe pas !</div>

  return (
    <div>
      Oups ! Un problème est survenu :-(
      <pre>
        {caught.data}
      </pre>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div>
      <p>Oups ! Une erreur est survenue :-(</p>
      <pre>{error.stack}</pre>
    </div>
  );
}
