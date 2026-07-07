# send-pm-email

Supabase Edge Function that sends PM reminder emails through Resend.

## Setup

1. In Supabase Dashboard, open **Project Settings → Edge Functions → Secrets**.
2. Add secret: `RESEND_API_KEY` with your Resend API key.
3. Deploy this function:

```bash
supabase functions deploy send-pm-email
```

## Resend sender address

- Testing: use `IT Asset PM <onboarding@resend.dev>` (Resend sandbox sender).
- Production: verify your domain in Resend and update `EMAIL_FROM` in `assets/js/config.js`.

## Security

Never put the Resend API key in `config.js` or any frontend file. Keep it only in Supabase secrets.
