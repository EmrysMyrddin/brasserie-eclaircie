import styles from "./beer.css";

export const beerLinks = [{ rel: "stylesheet", href: styles }]

export function Beer({beer}: {beer: any}) {
  return (
    <article className="beer">
      <h4 style={{gridArea: "title"}}>{beer.name}</h4>
      <p style={{gridArea: "description"}}>
        {beer.short_description}
      </p>
      <a style={{gridArea: "more"}} href={`/bières/${beer.id}`}>
        En savoir plus
      </a>
      <img style={{gridArea: "photo"}} alt={`Photographie de la bière ${beer.name}`} src={beer.image_url}/>
    </article>
  )
}
