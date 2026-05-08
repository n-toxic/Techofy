import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET || "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6";
  
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET is required and must be at least 32 characters");
  }
  return secret;
}


export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 12); //
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function signToken(payload: { userId: number; role: string }): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "30d" });
}

export function verifyToken(token: string): { userId: number; role: string } | null {
  try {
    return jwt.verify(token, getJwtSecret()) as { userId: number; role: string };
  } catch {
    return null;
  }
}

export function generateOtp(): string {
  // Use crypto for better randomness
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return String(100000 + (array[0] % 900000));
}
