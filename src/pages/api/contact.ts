import type { APIRoute } from 'astro';
import { validateContact, isBot, createRateLimiter, sendContact } from '../../lib/contact';

export const prerender = false;

const MAX_BODY = 20_000; // bytes; a 5,000-char message plus fields fits easily
const allow = createRateLimiter(5, 10 * 60_000);

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

export const POST: APIRoute = async ({ request, clientAddress, redirect }) => {
  const type = request.headers.get('content-type') ?? '';
  const isForm = type.includes('application/x-www-form-urlencoded') || type.includes('multipart/form-data');
  const isJson = type.includes('application/json');
  const fail = (status: number, errors: Record<string, string>) => (isForm ? redirect('/contact?error=1', 303) : json({ ok: false, errors }, status));

  if (!isForm && !isJson) return json({ ok: false, errors: { form: 'Unsupported content type.' } }, 415);

  // On Vercel the platform sets x-forwarded-for; locally fall back to the socket address.
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || clientAddress || 'unknown';
  if (!allow(ip)) return fail(429, { form: 'Too many messages. Please try again in a few minutes.' });

  let raw: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY) {
      raw = { message: 'x'.repeat(5001) }; // force the size error through normal validation
    } else {
      raw = isJson ? JSON.parse(text) : Object.fromEntries(new URLSearchParams(text));
    }
  } catch {
    return fail(400, { form: 'Could not read the submission.' });
  }

  const result = validateContact(raw);
  if (!result.ok) return fail(400, result.errors);
  if (isBot(result.value)) return isForm ? redirect('/contact?sent=1', 303) : json({ ok: true });

  try {
    await sendContact(result.value, process.env);
  } catch (e) {
    console.error('[contact] send failed:', e instanceof Error ? e.message : 'unknown');
    return fail(500, { form: 'Something went wrong on my side. Please try LinkedIn instead.' });
  }
  return isForm ? redirect('/contact?sent=1', 303) : json({ ok: true });
};
