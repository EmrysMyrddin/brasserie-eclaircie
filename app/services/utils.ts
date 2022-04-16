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
