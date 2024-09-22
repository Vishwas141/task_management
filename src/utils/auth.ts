import { jwtVerify } from "jose";

export async function verifyAuth(token: string) {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return verified.payload;
  } catch (err) {
    throw new Error("Your token has expired.");
  }
}




