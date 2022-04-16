import {Form, useActionData, useTransition} from "@remix-run/react";
import type {ActionFunction, LinksFunction} from "@remix-run/node";
import styles from '~/styles/login.css'
import {createUserSession, login} from "~/services/session.server";
import {json} from "@remix-run/node";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
}

type ActionData = {
  formError?: string;
  fields?: {
    email: string;
    password: string;
  };
};

function badRequest(data: ActionData) {
  return json(data, 400)
}

export const action: ActionFunction = async ({request}) => {
  const form = await request.formData()
  const email = form.get("email")
  const password = form.get("password")
  const redirectTo = form.get("redirectTo") || "/backoffice"
  
  if(!email || !password) {
    return badRequest({formError: "Champs manquants"})
  }
  if(typeof email !== "string" || typeof password !== "string" || typeof redirectTo !== "string") {
    return badRequest({formError: "Formulaire incorrecte"})
  }
  
  const fields = { email, password }
  const user = await login(fields)
  if(!user) return badRequest({fields, formError: "Mauvais email ou mot de passe"})
  return createUserSession(user.id, redirectTo)
}

export default function LoginScreen() {
  const transition = useTransition()
  const data = useActionData<ActionData>()
  return (
    <Form method="post">
      <h2>Login</h2>
      <fieldset>
        <label htmlFor="email-input">Email :</label>
        <input name="email" type="email" id="email-input" defaultValue={data?.fields?.email}/>
        <label htmlFor="password-input">Password :</label>
        <input name="password" type="password" id="password-input" defaultValue={data?.fields?.password}/>
      </fieldset>
      {data?.formError && <p className="form-error">{data.formError}</p>}
      <button type="submit" disabled={!!transition.submission}>Se connecter</button>
    </Form>
  )
}
