import {Form, useActionData, useLoaderData, useSearchParams, useTransition} from "@remix-run/react";
import type {ActionFunction, LinksFunction} from "@remix-run/node";
import styles from '~/styles/login.css'
import {createUserSession, login} from "~/services/session.server";
import {json} from "@remix-run/node";
import {getFormData} from "~/services/utils";

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
  const {email, password, redirectTo} = await getFormData(request)
  
  if(!email || !password) {
    return badRequest({formError: "Champs manquants"})
  }
  
  const fields = { email, password }
  const user = await login(fields)
  if(!user) return badRequest({fields, formError: "Mauvais email ou mot de passe"})
  return createUserSession(user.id, redirectTo || '/backoffice')
}

export default function LoginScreen() {
  const transition = useTransition()
  const [searchParams] = useSearchParams();
  const data = useActionData<ActionData>()
  return (
    <Form method="post">
      <h2>Login</h2>
      <input type="hidden" name="redirectTo" value={searchParams.get("redirectTo") ?? undefined}/>
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
