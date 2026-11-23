import { supabase } from '@/lib/supabase';

export async function uploadImage(roomId: string, userId: string, file: File, caption?: string) {
  if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) throw new Error('Invalid image');
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const path = `${roomId}/${userId}/${crypto.randomUUID()}.${ext}`;

  const up = await supabase.storage.from('room-images').upload(path, file, { contentType: file.type });
  if (up.error) throw up.error;

  const { error } = await supabase.from('images').insert({ room_id: roomId, user_id: userId, path, caption });
  if (error) {
    await supabase.storage.from('room-images').remove([path]);
    throw error;
  }
}

export async function signedUrls(paths: string[]) {
  const { data, error } = await supabase.storage.from('room-images').createSignedUrls(paths, 3600);
  if (error) throw error;
  return Object.fromEntries((data ?? []).map((d) => [d.path ?? '', d.signedUrl]));
}

export async function deleteImage(id: string, path: string) {
  await supabase.storage.from('room-images').remove([path]);
  const { error } = await supabase.from('images').delete().eq('id', id);
  if (error) throw error;
}
