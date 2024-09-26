
import argon2 from "argon2";


export async function hashPassword(password: string) {
    const options = {
      hashLength: 32, // Adjust the hash length as needed
      parallelism: 2, // Set the parallelism factor
      memoryCost: 2 ** 16, // Configure the memory cost
      timeCost: 4 // Adjust the time cost
    };
  
    const hash = await argon2.hash(password, options);
    return hash;
  }

export async function comparePassword(password: string, hashedPassword: string) {
    const isMatch = await argon2.verify(hashedPassword, password);
    return isMatch;
  }
