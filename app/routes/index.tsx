import type {LinksFunction, LoaderFunction, MetaFunction} from "@remix-run/node";

import stylesUrl from "../styles/index.css";
import {Link, useCatch, useLoaderData} from "@remix-run/react";
import {Beer, beerLinks} from "~/components/beer/beer";
import {query} from "~/services/graphql.server";
import {gql} from "@urql/core";
import {json} from "@remix-run/node";

export let meta: MetaFunction = () => {
  return {
    title: "Brasserie de l'éclaircie",
    description: "Brasserie de l'éclaircie"
  };
};

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }, ...beerLinks];
};

export const loader: LoaderFunction = async () => {
  return json(await query(gql`
    query all_beers {
      beers(order_by: {created_at: asc}) {
        id, name, short_description, image_url
      }
    }
  `))
}

export default function Index() {
  const {beers} = useLoaderData()
  return (
    <div className="container">
      <nav>
        <img alt="logo" id="logo" src="/images/logo.png"/>
        <a href="#bières">Bières</a>
        <a>Engagements</a>
        <a>Contact</a>
      </nav>
      <main>
        <h1>
          La<br/>
          brasserie<br/>
          de l'éclaircie
        </h1>
        <div id="cover" />
        <article id="blog">
          <h3>Le blog</h3>
          <p>
            Lunas experimentum, tanquam audax spatii.<br/>
            Try mashing loaf rinseed with champaign, varnished with vodka.<br/>
            Est germanus vox, cesaris.<br/>
            Sensorems tolerare in vasa!<br/>
          </p>
          <Link to="/blog">Visiter</Link>
        </article>
        <section id="bières">
          {beers.map((beer: any) => (
            <Beer beer={beer} key={beer.id}/>
          ))}
        </section>
        <section id="engagements">
          <h3>Engagements</h3>
          <p>
            Lunas experimentum, tanquam audax spatii.<br/>
            Try mashing loaf rinseed with champaign, varnished with vodka.<br/>
            Est germanus vox, cesaris.<br/>
            Sensorems tolerare in vasa!<br/><br/><br/>
            Lunas experimentum, tanquam audax spatii.<br/>
            Try mashing loaf rinseed with champaign, varnished with vodka.<br/>
            Est germanus vox, cesaris.<br/>
            Sensorems tolerare in vasa!<br/><br/>
            Lunas experimentum, tanquam audax spatii.<br/>
            Try mashing loaf rinseed with champaign, varnished with vodka.<br/>
            Est germanus vox, cesaris.<br/>
            Sensorems tolerare in vasa!<br/>
          </p>
        </section> <section id="engagements">
        <h3>Nous trouver - Contactez-nous</h3>
        <p>
          1 rue de la Bière<br/>
          Baden<br/>
          France<br/>
          <br/>
          mail: super.mail@gmail.com<br/>
          <br/>
          Tel: 01.02.03.04.05
        </p>
        <img id="carte" alt="Carte" src="/images/carte.png"/>
      </section>
      </main>
    </div>
  );
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

export function ErrorBoundary({ error }: {error: Error}) {
  return (
    <div>
      <p>Oups ! Une erreur est survenue :-(</p>
      <pre>{error.stack}</pre>
    </div>
  );
}
