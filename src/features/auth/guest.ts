import { supabase } from '@/lib/supabase';

export async function signInGuest(displayName: string, captchaToken?: string) {
  const name = displayName.trim().slice(0, 24);
  if (!name) throw new Error('Display name required');

  const { data: { session } } = await supabase.auth.getSession();
  let user = session?.user ?? null;

  if (!user) {
    const { data, error } = await supabase.auth.signInAnonymously({ options: { captchaToken } });
    if (error) throw error;
    user = data.user!;
  }

  const { error } = await supabase.from('profiles').upsert({ id: user.id, display_name: name });
  if (error) throw error;
  return user;
}
