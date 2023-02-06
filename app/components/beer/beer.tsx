import styles from "./beer.css";
import { Link } from "@remix-run/react";

export const beerLinks = [{ rel: "stylesheet", href: styles }]

export function Beer({ beer }: { beer: any }) {
  return (
    <article className="beer gap-5" id={`beer-${beer.id}`}>
      <h4 className="text-2xl" style={{ gridArea: "title" }}>{beer.name}</h4>
      <p className="text-base" style={{ gridArea: "description" }}>
        {beer.short_description}
      </p>
      <img className="w-full" style={{ gridArea: "photo" }} alt={`Photographie de la bière ${beer.name}`} src={beer.image_url} />
      <p className="text-sm text-center">Formats disponibles: 33cL et 75cL</p>
    </article>
  )
}
