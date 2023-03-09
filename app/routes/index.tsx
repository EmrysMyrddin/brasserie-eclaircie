import type { LinksFunction, LoaderFunction, MetaFunction } from "@remix-run/node";

import stylesUrl from "~/styles/index.css";
import { Link, Outlet, useCatch, useLoaderData } from "@remix-run/react";
import { Beer, beerLinks } from "~/components/beer/beer";
import { query } from "~/services/graphql.server";
import { gql } from "@urql/core";
import { json } from "@remix-run/node";
import { marked } from 'marked'

marked.setOptions({
  gfm: true,
  breaks: true,
  xhtml: true,
})

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
  const { beers, engagement: [engagement] } = await query(gql`
    query all_beers {
      beers(order_by: {created_at: asc}) {
        id, name, short_description, image_url, color
      }
      engagement {
        content
      }
    }
  `)
  return json({ beers, engagement })
}

export default function Index() {
  const { beers, engagement } = useLoaderData()
  const engagementHTML = marked.parseInline(engagement.content)
  console.log(engagement, engagementHTML)
  return (
    <div>
      <header className="bg-white sticky -top-0">
        <nav className="w-[1024px] m-auto flex flex-row justify-between uppercase py-6 items-center relative text-4xl">
          <img src="/images/logo_eclaircie-brasserie.png" className="h-20 absolute -left-24" />
          <Link to="#beers">Les bières</Link>
          <Link to="#engagement">Les engagements</Link>
          <Link to="#contact">Contact</Link>
          <Link to="#blog">Blog</Link>
        </nav>
      </header >

      <main className="">
        <h1 className="w-full p-12 flex flex-col">
          <img className="aspect-[10/3]" src="/images/baniere_verte.svg" alt="L'Éclaircie, Brasserie alternative du Morbihan" />
        </h1>

        <section id="beers" className="scroll-m-24">
          {beers.map((beer: any, i: number) => (
            <Beer beer={beer} key={beer.id} previousBeer={i > 0 ? beers[i - 1] : null} className={i === beers.length - 1 ? 'pb-24' : ''} />
          ))}
        </section>

        <section id="engagement" className="bg-[#ad7725ff] text-white p-24 scroll-m-24">
          <p className="w-[1024px] m-auto text-base [column-count:2] h-min" dangerouslySetInnerHTML={{ __html: engagementHTML }}></p>
        </section>

        <section id="contact" className="py-24 w-[1024px] mx-auto grid grid-cols-[330px_1fr_1fr] gap-36 text-2xl scroll-m-24">
          <img id="carte" alt="Carte" src="/images/carte.png" />
          <p className="text-center">
            1 rue de le Bière<br />
            2900 Baden<br />
            France<br />
            <br />
            <br />
            01.02.03.04.05
            contact@eclaircie.fr
          </p>

          <p>
            Lun. : 10H - 19H<br />
            Mar. : 10H - 19H<br />
            Mer. : 10H - 19H<br />
            Jeu. : 10H - 19H<br />
            Ven. : 10H - 19H<br />
            Sam. : FERMÉ<br />
            Dim. : FERMÉ<br />
          </p>
        </section>

        <footer className="bg-[#ad7725ff] p-12">
          <p className="flex w-[1024px] m-auto items-center justify-center gap-6">
            <a href="https://www.twitter.com" ><img alt="twitter" id="twitter" className="h-10" src="/images/twitter.png" /></a>
            <a href="https://www.instagram.com" ><img alt="instagram" id="instagram" className="h-10" src="/images/instagram.png" /></a>
          </p>
        </footer>

      </main>
    </div >
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <div>
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
      <pre>{error.stack ?? error.message ?? JSON.stringify(error, null, 2)}</pre>
    </div>
  );
}
