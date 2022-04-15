import type { MetaFunction, LinksFunction } from "remix";

import stylesUrl from "../styles/index.css";

export let meta: MetaFunction = () => {
  return {
    title: "Brasserie de l'éclaircie",
    description: "Brasserie de l'éclaircie"
  };
};

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function Index() {
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
          <a href="/blog">Visiter</a>
        </article>
        <section id="bières">
          <Beer name="Bière de l'Hiver" id="1"/>
          <Beer name="Bière de l'Été" id="2"/>
          <Beer name="Bière de l'Automne" id="3"/>
          <Beer name="Bière du Printemps" id="4"/>
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


function Beer({ name, id }: { name: string, id: string }) {
  return (
    <article className="beer">
      <h4 style={{gridArea: "title"}}>{name}</h4>
      <p style={{gridArea: "description"}}>
        Lunas experimentum, tanquam audax spatii.<br/>
        Try mashing loaf rinseed with champaign, varnished with vodka.<br/>
        Est germanus vox, cesaris.<br/>
        Sensorems tolerare in vasa!<br/>
      </p>
      <a style={{gridArea: "more"}} href={`/bières/${id}`}>
        En savoir plus
      </a>
      <img style={{gridArea: "photo"}} alt={`Photographie de la bière ${name}`} src="/images/biere.webp"/>
    </article>
  )
}
