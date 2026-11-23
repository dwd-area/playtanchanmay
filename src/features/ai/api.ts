import { supabase } from '@/lib/supabase';

export type AiKind = 'trivia' | 'riddle' | 'hint' | 'challenge';

export async function askAi<T = unknown>(kind: AiKind, input: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke('ai-generate', { body: { kind, input } });
  if (error) throw error;
  return data as T;
}
