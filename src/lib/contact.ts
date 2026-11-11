import { Resend } from 'resend';

export type ContactInput = { name: string; email: string; message: string; website?: string };
export type ContactResult = { ok: true; value: ContactInput } | { ok: false; errors: Record<string, string> };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NEWLINE = /[\r\n]/;

export function validateContact(raw: unknown): ContactResult {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { ok: false, errors: { form: 'Invalid submission.' } };
  const r = raw as Record<string, unknown>;
  const str = (k: string) => (typeof r[k] === 'string' ? (r[k] as string) : null);
  const errors: Record<string, string> = {};

  const nameRaw = str('name'), emailRaw = str('email'), msgRaw = str('message');
  const name = nameRaw?.trim() ?? '';
  const email = emailRaw?.trim() ?? '';
  const message = msgRaw?.trim() ?? '';
  const website = str('website')?.trim() ?? '';

  // Newline checks run on the raw value so trimming can't hide header injection.
  if (nameRaw === null || !name || name.length > 100 || NEWLINE.test(nameRaw)) errors.name = 'Please give a name (up to 100 characters).';
  if (emailRaw === null || email.length > 254 || NEWLINE.test(emailRaw) || !EMAIL.test(email)) errors.email = 'Please give a valid email address.';
  if (msgRaw === null || message.length < 10 || message.length > 5000) errors.message = 'Messages need 10 to 5,000 characters.';

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, value: { name, email, message, website } };
}

export function isBot(input: ContactInput): boolean {
  return Boolean(input.website && input.website.length > 0);
}

/** Best-effort, per-instance limiter: returns false once `limit` hits have happened within `windowMs`. */
export function createRateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return (key: string, now: number = Date.now()): boolean => {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= limit) { hits.set(key, recent); return false; }
    recent.push(now);
    hits.set(key, recent);
    if (hits.size > 10_000) hits.delete(hits.keys().next().value!); // bound memory
    return true;
  };
}

type Env = { RESEND_API_KEY?: string; CONTACT_TO?: string; CONTACT_FROM?: string; CONTACT_DRY_RUN?: string };

export async function sendContact(input: ContactInput, env: Env): Promise<void> {
  if (env.CONTACT_DRY_RUN === '1' || !env.RESEND_API_KEY) {
    console.info('[contact] dry run: message from', input.name.slice(0, 40));
    return;
  }
  if (!env.CONTACT_TO || !env.CONTACT_FROM) throw new Error('contact env not configured');
  const { error } = await new Resend(env.RESEND_API_KEY).emails.send({
    from: env.CONTACT_FROM,
    to: env.CONTACT_TO,
    replyTo: input.email,
    subject: `fme.dev: message from ${input.name}`,
    text: `${input.message}\n\n— ${input.name} <${input.email}>`,
  });
  if (error) throw new Error(`resend: ${error.name}`);
}
