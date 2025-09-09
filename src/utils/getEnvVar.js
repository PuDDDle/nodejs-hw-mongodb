export function getEnvVar(name, defaultValue) {
  const value = process.env[name];

  if (value !== undefined && value !== null) {
    return value.trim();
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  throw new Error(`Missing: process.env['${name}']`);
}
