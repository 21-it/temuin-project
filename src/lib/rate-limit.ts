// Simple in-memory rate limiter for public forms (anti-spam)

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

/**
 * Memeriksa apakah identifier (misal: IP address atau session ID) melebihi batas request
 * @param identifier String unik (IP client)
 * @param limit Batas request dalam windowMs (default: 10 request per 60 detik)
 * @param windowMs Jendela waktu dalam milidetik (default: 60000 = 1 menit)
 */
export function checkRateLimit(
  identifier: string,
  limit = 10,
  windowMs = 60 * 1000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  // Bersihkan record lama jika map terlalu besar
  if (rateLimitMap.size > 5000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.resetTime < now) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!record || record.resetTime < now) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count };
}

/**
 * Validasi Honeypot anti-bot.
 * Field honeypot disembunyikan via CSS di form. Jika diisi oleh bot, tolak permintaan.
 */
export function validateHoneypot(honeypotValue?: string | null): boolean {
  if (!honeypotValue) return true; // Bersih, bukan bot
  return honeypotValue.trim().length === 0;
}
