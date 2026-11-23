import { supabase } from '@/lib/supabase';

export async function createRoom(name: string) {
  const { data, error } = await supabase.rpc('create_room', { room_name: name });
  if (error) throw error;
  return data;
}

export async function joinRoom(code: string) {
  const { data, error } = await supabase.rpc('join_room', { room_code: code.trim() });
  if (error) throw error;
  return data;
}

export async function listMyRooms() {
  const { data, error } = await supabase.from('rooms').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function leaveRoom(roomId: string, userId: string) {
  const { error } = await supabase.from('room_members').delete().eq('room_id', roomId).eq('user_id', userId);
  if (error) throw error;
}
