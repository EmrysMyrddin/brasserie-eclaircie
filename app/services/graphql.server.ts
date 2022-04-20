import type { TypedDocumentNode} from "@urql/core";
import {createClient} from "@urql/core";
import type {DocumentNode} from "graphql";
import {json} from "@remix-run/node";

const HASURA_API_URL = "https://eclaircie-hasura.caprover.cocaud.dev/v1/graphql"
const HASURA_ADMIN_SECRET = "Ea2KFEoEI20zMKnP09Q6vLoncjWMY6pvyUOnegUmdsDLGhuXYA"

const client = createClient({
  url: HASURA_API_URL,
  fetchOptions: {
    headers: { "x-hasura-admin-secret": HASURA_ADMIN_SECRET },
  },
  requestPolicy: 'network-only'
});

export async function query(graphqlQuery: string | DocumentNode | TypedDocumentNode<any, any>, variables?: any) {
  const { data, error } = await client.query(graphqlQuery, variables).toPromise()
  if(error) throw json(error, {status: 500})
  return data
}

export async function mutation(graphqlQuery: string | DocumentNode | TypedDocumentNode<any, any>, variables?: any) {
  const { data, error } = await client.mutation(graphqlQuery, variables).toPromise()
  if(error) throw error
  return data
}
