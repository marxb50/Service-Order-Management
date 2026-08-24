const MIN_SECRET_LENGTH = 32;

export function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `JWT_SECRET must be configured with at least ${MIN_SECRET_LENGTH} characters`
    );
  }

  return new TextEncoder().encode(secret);
}

