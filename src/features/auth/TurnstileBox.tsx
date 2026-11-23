import { Turnstile } from '@marsidev/react-turnstile';

export function TurnstileBox({ onToken }: { onToken: (t: string) => void }) {
  return <Turnstile siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY} onSuccess={onToken} />;
}
