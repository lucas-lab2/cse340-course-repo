import crypto from "crypto";

const KEY_LENGTH = 64;
const HASH_SEPARATOR = "$";
const ALGORITHM = "scrypt";

export const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, KEY_LENGTH).toString("hex");

  return [ALGORITHM, salt, hash].join(HASH_SEPARATOR);
};

export const verifyPassword = (password, storedPasswordHash) => {
  if (!password || !storedPasswordHash) {
    return false;
  }

  const [algorithm, salt, storedHash] = storedPasswordHash.split(HASH_SEPARATOR);

  if (algorithm !== ALGORITHM || !salt || !storedHash) {
    return false;
  }

  const submittedHash = crypto.scryptSync(password, salt, KEY_LENGTH);
  const savedHash = Buffer.from(storedHash, "hex");

  return (
    savedHash.length === submittedHash.length &&
    crypto.timingSafeEqual(savedHash, submittedHash)
  );
};
