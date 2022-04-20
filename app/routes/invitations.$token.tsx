import {Form, useActionData, useParams, useSearchParams, useTransition} from "@remix-run/react";
import type {ActionFunction, LinksFunction} from "@remix-run/node";
import bcrypt from "bcryptjs";
import styles from '~/styles/login.css'
import {json, redirect} from "@remix-run/node";
import {getFormData} from "~/services/utils";
import {mutation, query} from "~/services/graphql.server";
import {gql} from "@urql/core";
import {isBefore} from "date-fns";
import {Button} from "~/components/button";
import {logout} from "~/services/session.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
}

type ActionData = {
  formError?: string;
};

function badRequest(data: ActionData) {
  return json(data, 400)
}

export const action: ActionFunction = async ({request, params}) => {
  const {password, passwordConfirm} = await getFormData(request)
  
  if(!password || !passwordConfirm) {
    return badRequest({formError: "Champs manquants"})
  }
  
  if(password !== passwordConfirm) {
    return badRequest({formError: "Les mots de passes son différents"})
  }
  
  const {invitations: [invitation]} = await query(gql`
    query get_invitation($token: String!) {
      invitations(where: {token: {_eq: $token}}) {
        id, email, expires
      }
    }
  `, {token: params.token})
  
  if(!invitation){
    return json({formError: "Cette invitation n'existe pas"}, {status: 404})
  }
  
  if(isBefore(new Date(invitation.expires), new Date())){
    return badRequest({formError: "Cette invitation a expirée"})
  }
  
  await mutation(gql`
    mutation create_user($email: String!, $password: String!, $invitationId: uuid!) {
      insert_user_one(object: {email: $email, pass_hash: $password}) { id }
      delete_invitations_by_pk(id: $invitationId) { id }
    }
  `, {email: invitation.email, invitationId: invitation.id, password: await bcrypt.hash(password, 10)})
  return logout(request)
}

export default function LoginScreen() {
  const transition = useTransition()
  const params = useParams()
  const data = useActionData<ActionData>()
  return (
    <Form method="post">
      <h2>Inscription</h2>
      <input type="hidden" name="token" value={params.token ?? undefined}/>
      <fieldset>
        <label htmlFor="password-input">Mot de passe :</label>
        <input name="password" type="password" id="password-input"/>
        <label htmlFor="password-confirm-input">Confirmation du mot de passe :</label>
        <input name="passwordConfirm" type="password" id="password-confirm-input"/>
      </fieldset>
      {data?.formError && <p className="form-error">{data.formError}</p>}
      <Button type="submit" disabled={!!transition.submission}>Créer le compte</Button>
    </Form>
  )
}
