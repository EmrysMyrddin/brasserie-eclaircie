import path from "path";
import {addDays} from 'date-fns'
import {Form, useCatch, useLoaderData} from "@remix-run/react";
import type {ActionFunction, LinksFunction, LoaderFunction} from "@remix-run/node";
import {json, redirect} from "@remix-run/node";
import styles from "~/styles/backoffice/users.css";
import {mutation, query} from "~/services/graphql.server";
import {gql} from "@urql/core";
import {getFormData, handleAction} from "~/services/utils";
import {INIVITATION_CALLBACK_URL, sendHTML} from "~/services/mailjet.server";
import {Button} from "~/components/button";
import {FormError} from "~/components/form-error";
import {requireUserId} from "~/services/session.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
}

interface LoaderData {
  users: { id: string, email: string }[]
  invitations: { id: string, email: string, expires: string }[]
}

export const loader: LoaderFunction = async ({request}) => {
  await requireUserId(request)
  return json(await query(gql`
    query users_data {
      users: user { id, email }
      invitations { id, email, expires }
    }
  `))
}

export const action: ActionFunction = async ({request}) => {
  await requireUserId(request)
  const { action, id, email } = await getFormData(request)
  
  return handleAction(action, redirect(request.url), {
    invite: () => inviteUser(email),
    'delete-user': () => deleteUser(id),
    'delete-invitation': () => deleteInvitation(id)
  })
}

async function inviteUser(email: string) {
  const {invitation} = await mutation(gql`
    mutation invite($email: String!, $expires: timestamptz) {
      invitation: insert_invitations_one(object: { email: $email, expires: $expires}) { id, token }
    }
  `, {email, expires: addDays(new Date(), 7)})
  const invitationLink = path.join(INIVITATION_CALLBACK_URL, invitation.token)
  await sendHTML({
    to: email,
    subject: "Vous avez été invité",
    body: `
        <p>
          Bonjour,<br>
          Vous avez été invité à gérer le contenu du site de la brasserie de l'éclaircie.<br>
          <br>
          Veuillez suivre ce lien pour accepter l'invitation et créer votre compte:<br>
          <br>
          <a href="${invitationLink}">${invitationLink}</a><br>
          <br>
          Attention, ce lien expirera dans 7 jours.<br>
          <br>
          Bonne journée !
        </p>
      `
    })
}

async function deleteUser(id: string) {
  await mutation(gql`
    mutation delete_user($id: uuid!) {
      delete_user_by_pk(id: $id) { id }
    }
  `, {id})
}

async function deleteInvitation(id: string) {
  await mutation(gql`
    mutation delete_user($id: uuid!) {
      delete_invitations_by_pk(id: $id) { id }
    }
  `, {id})
}

export default function UsersScreen() {
  return (
    <div className="users-screen">
      <InvitationForm />
      <InvitationList/>
      <UsersList />
    </div>
  )
}

function InvitationForm() {
  return (
    <Form method="post">
      <h3>Inviter un utilisateur</h3>
      <input name="email" type="email" placeholder="Email à inviter"/>
      <Button value="invite">Inviter</Button>
      <FormError action="invite"/>
    </Form>
  )
}

function UsersList() {
  const {users} = useLoaderData<LoaderData>()
  return (
    <>
      <h3>Gestion des utilisateur</h3>
      <FormError action="delete-user"/>
      <ul>
        {users.map(({id, email}) => (
          <li key={id}>
            <Form method="post">
              {email}
              <Button value="delete-user">Supprimer</Button>
              <input type="hidden" name="id" value={id}/>
            </Form>
          </li>
        ))}
      </ul>
    </>
  )
}

function InvitationList() {
  const {invitations} = useLoaderData<LoaderData>()
  return (
    <>
      <h3>Invitations en attente</h3>
      <FormError action="delete-invitation"/>
      {invitations.length == 0
        ? <p>Aucune invitation en attente</p>
        : (
          <ul>
            {invitations.map(({id, email, expires}) => (
              <li key={id}>
                <Form method="post">
                  {email} (expire le {new Date(expires).toLocaleDateString('fr-FR', {dateStyle: 'short'})})
                  <input type="hidden" name="id" value={id}/>
                  <Button value="delete-invitation">Supprimer</Button>
                </Form>
              </li>
            ))}
          </ul>
        )
      }
    </>
  )
}


export function CatchBoundary() {
  const caught = useCatch();
  console.error(caught)
  
  return (
    <div>
      Oups ! Un problème est survenu :-(
      <pre>
        {caught.data.message ?? JSON.stringify(caught.data, null, 2)}
      </pre>
    </div>
  );
}

export function ErrorBoundary({ error }: {error: Error}) {
  console.error(error)
  return (
    <div>
      <p>Oups ! Une erreur est survenue :-(</p>
      <pre>{error.message}</pre>
      <pre>{error.stack}</pre>
    </div>
  );
}
