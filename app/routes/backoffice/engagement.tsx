import { ActionFunction, json, LoaderFunction } from "@remix-run/node"
import { Form, useCatch, useLoaderData, useTransition } from "@remix-run/react"
import { gql } from "@urql/core"
import { mutation, query } from "~/services/graphql.server"
import { requireUserId } from "~/services/session.server"
import { getFormData } from "~/services/utils"

export const loader: LoaderFunction = async ({ request, params: { id } }) => {
  await requireUserId(request)
  const { engagement: [engagement] } = await query(gql`
    query get_engagement {
      engagement {
        id, content
      }
    }
  `)
  if (!engagement) throw json({}, { status: 404 })
  return json({ engagement })
}

export const action: ActionFunction = async ({ request }) => {
  await requireUserId(request)
  const { action, id, ...engagement } = await getFormData(request)

  switch (action) {
    case 'save': {
      console.log(engagement)
      const updated = await mutation(
        gql`
          mutation update_engagement($id: uuid!, $engagement: engagement_set_input!) {
            engagement: update_engagement_by_pk(pk_columns: {id: $id}, _set: $engagement) { id }
          }
        `,
        { id, engagement }
      )
      return json({ engagement: updated.engagement })
    }
  }
}

export default function EngagementScreen() {
  const transition = useTransition()
  const { engagement } = useLoaderData()
  return (
    <Form method="post" className="p-6 flex flex-col gap-4 h-full">
      <h2>Engagement</h2>
      <input type="hidden" name="id" value={engagement.id} />
      <textarea name="content" className="w-full border flex-1" defaultValue={engagement.content}></textarea>
      <div className="flex gap-6 w-full">
        <button name="action" type="submit" value="save" className="w-full" disabled={!!transition?.submission}>Enregistrer</button>
        <button type="reset" className="w-full" disabled={!!transition?.submission}>Reset</button>
      </div>
    </Form>
  )
}

export function CatchBoundary() {
  const caught = useCatch();
  console.log('error caught', caught)

  return (
    <div className="p-6">
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