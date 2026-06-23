import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'konsum_default_secret')
const COOKIE_NAME = 'konsum_session'

export async function hashPassword(plain) {
  return bcrypt.hash(plain, 10)
}

export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash)
}

export async function createSession(payload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
  return token
}

export async function verifySession(token) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch {
    return null
  }
}

export async function getSession(request) {
  // Read token from cookie
  const cookie = request?.cookies?.get?.(COOKIE_NAME) || (await cookies()).get(COOKIE_NAME)
  if (!cookie) return null
  return verifySession(cookie.value)
}

export const SESSION_COOKIE = COOKIE_NAME
