import bs58check from 'bs58check';
import crypto from 'crypto';

export class TokenManager {
  generate(): { token: string; payloadHash: Buffer } {
    const payload = crypto.randomBytes(16);
    const token = bs58check.encode(payload);
    const payloadHash = crypto.createHash('sha256').update(payload).digest();
    return { token, payloadHash };
  };

  verify(token: string): Buffer | null {
    try {
      const payload = bs58check.decode(token);
      if (payload.length !== 16) return null;
      return crypto.createHash('sha256').update(payload).digest();
    } catch {
      return null;
    }
  };
};
