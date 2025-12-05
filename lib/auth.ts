import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.JWT_SECRET;
const isProduction = process.env.NODE_ENV === 'production';

if (!secretKey && isProduction) {
  throw new Error('JWT_SECRET must be defined in production environment');
}

const secret = new TextEncoder().encode(secretKey || 'development-secret-key-unsafe');

export async function createToken(payload: { adminId: number; email: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload as { adminId: number; email: string };
  } catch (err) {
    return null;
  }
}

export async function getAdminFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token) return null;

  return await verifyToken(token);
}
