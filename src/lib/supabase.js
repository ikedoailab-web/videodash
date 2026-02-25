import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// 実際のSupabase URLかどうかを判定（プレースホルダーや空文字はスキップ）
const isValidUrl = supabaseUrl.startsWith('https://') && supabaseUrl.includes('.supabase.co');
const isValidKey = supabaseAnonKey.length > 20 && !supabaseAnonKey.includes('YOUR_');

export const supabase = (isValidUrl && isValidKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

if (!supabase) {
    console.info('[VideoDash] Supabase未接続: ローカルストレージモードで動作します。クラウド同期するには .env.local にSupabaseのURLとキーを設定してください。');
}

