/**
 * Environment variable validation utility
 * Validates that all required environment variables are set
 */

// Required environment variables for the application
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

// Optional environment variables (with defaults)
const optionalEnvVars = [
  'NEXT_PUBLIC_PUBLIC_APP_URL',
  'NEXT_PUBLIC_DASHBOARD_APP_URL',
  'NEXT_PUBLIC_API_URL',
];

/**
 * Validates environment variables at startup
 * @throws Error if required environment variables are missing
 */
export function validateEnv(): { valid: boolean; messages: string[] } {
  const messages: string[] = [];
  let valid = true;

  // Check required environment variables
  const missingRequired = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingRequired.length > 0) {
    valid = false;
    messages.push(
      `Missing required environment variables: ${missingRequired.join(', ')}`
    );
  }

  // Check optional environment variables and log warnings
  const missingOptional = optionalEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingOptional.length > 0) {
    messages.push(
      `Warning: Missing optional environment variables: ${missingOptional.join(
        ', '
      )}. Defaults will be used.`
    );
  }

  return { valid, messages };
} 