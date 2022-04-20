import {useActionData} from "@remix-run/react";

interface FormErrorProps {
  action: string
}

export function FormError({action}: FormErrorProps) {
  const actionData = useActionData()
  if(!actionData || actionData.action !== action || !actionData.error) return null
  return <p className="form-error">{actionData.error.message}</p>
}
