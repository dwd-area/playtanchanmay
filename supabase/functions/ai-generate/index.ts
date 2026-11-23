import { createClient } from 'jsr:@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*', // restrict to your domain in production
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PROMPTS: Record<string, (i: any) => string> = {
  trivia: (i) =>
    `Create ${Math.min(Number(i.count) || 5, 10)} multiple-choice trivia questions about "${String(i.topic ?? 'general').slice(0, 60)}". ` +
    `Return JSON: [{"question": string, "options": [4 strings], "answerIndex": 0-3, "explanation": string}]`,
  riddle: (i) =>
    `Write one original riddle about "${String(i.topic ?? 'anything').slice(0, 60)}". Return JSON: {"riddle": string, "answer": string}`,
  hint: (i) =>
    `Give a short, non-spoiler hint for the game "${String(i.game).slice(0, 40)}" given this state summary: ${String(i.state).slice(0, 500)}. Return JSON: {"hint": string}`,
  challenge: () => `Create a fun, safe, 1-sentence group challenge for friends. Return JSON: {"challenge": string}`,
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const json = (b: unknown, status = 200) =>
    new Response(JSON.stringify(b), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
    });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return json({ error: 'unauthorized' }, 401);

    const { kind, input } = await req.json();
    const build = PROMPTS[kind];
    if (!build) return json({ error: 'bad kind' }, 400);

    const { data: allowed } = await supabase.rpc('consume_ai_quota', { max_per_day: 30 });
    if (!allowed) return json({ error: 'daily AI limit reached' }, 429);

    const model = Deno.env.get('GEMINI_MODEL')!;
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': Deno.env.get('GEMINI_API_KEY')! },
      body: JSON.stringify({
        contents: [{ parts: [{ text: build(input ?? {}) }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.9 },
      }),
    });
    if (!res.ok) return json({ error: 'ai upstream error' }, 502);

    const out = await res.json();
    const text = out?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'null';
    return json(JSON.parse(text));
  } catch {
    return json({ error: 'server error' }, 500);
  }
});
