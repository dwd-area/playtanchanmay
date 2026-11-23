import { supabase } from '@/lib/supabase';

export async function fetchMessages(roomId: string, limit = 50) {
  const { data, error } = await supabase
    .from('messages')
    .select('id, body, created_at, user_id, profiles(display_name)')
    .eq('room_id', roomId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data as any[]).reverse();
}

export async function sendMessage(roomId: string, userId: string, body: string) {
  const { error } = await supabase.from('messages').insert({ room_id: roomId, user_id: userId, body: body.trim() });
  if (error) throw error;
}

export function subscribeMessages(roomId: string, cb: (row: any) => void) {
  const ch = supabase
    .channel(`chat:${roomId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` },
      (p) => cb(p.new)
    )
    .subscribe();
  return () => {
    supabase.removeChannel(ch);
  };
}
