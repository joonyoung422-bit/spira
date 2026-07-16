import type { SupabaseClient } from '@supabase/supabase-js';
import type { AppData } from './types';

// 사용자별 app_data(jsonb 한 행) 읽기 — 없으면 null
export async function pullAppData(supabase: SupabaseClient, userId: string): Promise<AppData | null> {
  const { data, error } = await supabase
    .from('app_data')
    .select('data')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) {
    console.error('[sync] pullAppData 실패:', error.message);
    return null;
  }
  return (data?.data as AppData) ?? null;
}

// 사용자별 app_data 저장(upsert)
export async function upsertAppData(supabase: SupabaseClient, userId: string, appData: AppData): Promise<boolean> {
  const { error } = await supabase
    .from('app_data')
    .upsert({ user_id: userId, data: appData }, { onConflict: 'user_id' });
  if (error) {
    console.error('[sync] upsertAppData 실패:', error.message);
    return false;
  }
  return true;
}
