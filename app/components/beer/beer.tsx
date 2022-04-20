import styles from "./beer.css";
import {Link} from "@remix-run/react";

export const beerLinks = [{ rel: "stylesheet", href: styles }]

export function Beer({beer}: {beer: any}) {
  return (
    <article className="beer" id={`beer-${beer.id}`}>
      <h4 style={{gridArea: "title"}}>{beer.name}</h4>
      <p style={{gridArea: "description"}}>
        {beer.short_description}
      </p>
      <Link style={{gridArea: "more"}} to={`/beers/${beer.id}`}>
        En savoir plus
      </Link>
      <img style={{gridArea: "photo"}} alt={`Photographie de la bière ${beer.name}`} src={beer.image_url}/>
    </article>
  )
}
