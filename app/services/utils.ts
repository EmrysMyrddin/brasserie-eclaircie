import {json, redirect} from "@remix-run/node";

export function env(name: string, defaultValue?: string): string {
  const value = process.env[name] ?? defaultValue
  if(!value) throw new Error(`${name} env variable is required`)
  return value
}

export async function getFormData(request: Request): Promise<Record<string, string>> {
  const form = await request.formData()
  const entries = [...form.entries()]
  const stringEntries = entries.filter(([, value]) => typeof value === "string") as Array<[string, string]>
  return Object.fromEntries(stringEntries)
}

export async function handleAction(
  action: string,
  defaultResponse: Response,
  handlers: Record<string, () => Promise<Response|void>>, options?: {throw?: boolean}
) {
  const handler = handlers[action]
  if(!handler) throw json({message: "Action invalide", action}, {status: 400})
  try {
    const response = await handler()
    return response ?? defaultResponse
  } catch(error: any) {
    const {message, stack} = error
    if(options?.throw) throw json({message, stack}, {status: 500})
    return json({error: {message, stack}, action}, {status: 500})
  }
}
