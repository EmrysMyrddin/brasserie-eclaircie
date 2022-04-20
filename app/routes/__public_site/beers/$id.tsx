import styles from "~/styles/beer.css"
import type {LinksFunction, LoaderFunction} from "@remix-run/node";
import {useLoaderData, useNavigate, useParams} from "@remix-run/react";
import {query} from "~/services/graphql.server";
import {gql} from "@urql/core";
import {json} from "@remix-run/node";
import {useEffect, useLayoutEffect} from "react";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const loader: LoaderFunction = async ({params}) => {
  const {beer} = await query(gql`
    query get_beer($id: uuid!) {
      beer: beers_by_pk(id: $id) { id, image_url, long_description, short_description, name }
    }
  `, {id: params.id})
  
  if (!beer) throw json({message: 'Bière introuvable'}, {status: 404})
  return json({beer})
}

export default function BeerScreen() {
  const navigate = useNavigate()
  const { id } = useParams()
  useEffect(() => {
    document.getElementById(`beer-${id}`)?.scrollIntoView({block: "center"})
  }, [id])
  return (
    <div className="beer-screen" onClick={() => navigate('/')}>
      <BeerAllInfo/>
    </div>
  )
}

function BeerAllInfo() {
  const { beer } = useLoaderData()
  
  return (
    <div className="beer-modal">
      <img src={beer.image_url} alt={`Illustration de la bière ${beer.name}`} />
      <article>
        <h1>{beer.name}</h1>
        <p>{beer.long_description}</p>
      </article>
    </div>
  )
}
