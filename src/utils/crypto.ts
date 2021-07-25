import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = '1F811FC7E8B9E9FE7CF120830F02C039';

export function encrypt(text: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  };
}

export function decrypt(encryptedContent: string, iv: string) {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    SECRET_KEY,
    Buffer.from(iv, 'hex')
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(encryptedContent, 'hex')),
    decipher.final(),
  ]);

  return decrpyted.toString();
}

export function generateSHA256(text: string) {
  return crypto.createHash('sha256').update(text).digest('hex');
}
