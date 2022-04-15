export function env(name: string, defaultValue?: string): string {
  const value = process.env[name] ?? defaultValue
  if(!value) throw new Error(`${name} env variable is required`)
  return value
}
