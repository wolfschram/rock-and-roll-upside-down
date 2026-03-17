import * as jose from "jose";

export interface TokenPayload {
  sub: string; // user id
  role: string;
  username: string;
  githubUsername?: string;
}

const ALG = "HS256";

export async function createToken(
  payload: TokenPayload,
  secret: string,
  expiresIn = "15m"
): Promise<string> {
  const key = new TextEncoder().encode(secret);
  return new jose.SignJWT(payload as unknown as jose.JWTPayload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .setIssuer("rrud-portal")
    .sign(key);
}

export async function verifyToken(
  token: string,
  secret: string
): Promise<TokenPayload> {
  const key = new TextEncoder().encode(secret);
  const { payload } = await jose.jwtVerify(token, key, {
    issuer: "rrud-portal",
  });
  return payload as unknown as TokenPayload;
}
