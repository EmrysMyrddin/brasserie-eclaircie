import type {ButtonHTMLAttributes} from "react";
import {useTransition} from "@remix-run/react";

type ButtonProps = ButtonHTMLAttributes<never>

export function Button(props: ButtonProps) {
  const transition = useTransition()
  return <button disabled={!!transition.submission} type="submit" name="action" {...props}/>
}
