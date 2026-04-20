export async function POST(request) {
  const { token } = await request.json();

  if (!token) {
    return Response.json({ success: false, error: 'Missing CAPTCHA token.' }, { status: 400 });
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // If no secret key is configured, skip verification (dev mode)
    return Response.json({ success: true });
  }

  const formData = new FormData();
  formData.append('secret', secret);
  formData.append('response', token);

  const result = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    { method: 'POST', body: formData }
  );

  const data = await result.json();

  if (!data.success) {
    return Response.json(
      { success: false, error: 'CAPTCHA verification failed. Please try again.' },
      { status: 400 }
    );
  }

  return Response.json({ success: true });
}
