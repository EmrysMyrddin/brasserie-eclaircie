import styles from "./beer.css";
import { Link } from "@remix-run/react";
import { BeerBorder } from "./border";

export const beerLinks = [{ rel: "stylesheet", href: styles }]

interface BeerProps {
  beer: any
  previousBeer?: any
  className?: string
}

export function Beer({ beer, previousBeer, className = '' }: BeerProps) {
  return (
    <div className={`beer relative -z-20 ${className}`} style={{ backgroundColor: beer.color }}>
      <div className="h-20 w-full relative -z-10">
        <BeerBorder upperColor={previousBeer?.color ?? "#FFF"} bottomColor={beer.color} className="w-full h-full" />
      </div>
      <article className={`gap-5 w-[1024px] mx-auto z-10`} id={`beer-${beer.id}`}>
        <h4 className="text-2xl" style={{ gridArea: "title" }}>{beer.name}</h4>
        <p className="text-base" style={{ gridArea: "description" }}>
          {beer.short_description}
        </p>
        <img className="w-full" style={{ gridArea: "photo" }} alt={`Photographie de la bière ${beer.name}`} src={beer.image_url} />
        <p className="text-sm text-center">Formats disponibles: 33cL et 75cL</p>
      </article>
    </div>
  )
}

const colors = [
  "orange",
  "green",
  "sky",
  "rose"
]