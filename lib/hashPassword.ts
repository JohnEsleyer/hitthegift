
import argon2, { hash } from "argon2";


export async function hashPassword(password: string) {
  return await hash(password);
}
export async function comparePassword(password: string, hashedPassword: string) {
    const isMatch = await argon2.verify(hashedPassword, password);
    return isMatch;
  }
