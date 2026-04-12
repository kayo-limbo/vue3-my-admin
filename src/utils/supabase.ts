import { createClient } from '@supabase/supabase-js'

// 请替换为您自己的 Supabase 项目 URL
const supabaseUrl = 'https://fcyhaqczfsfgmmlyoknd.supabase.co'

// 请替换为您自己的 Supabase 项目 publishable key
const supabaseKey = 'sb_publishable_NDOpHPcfgvxvm-3ETxHwqg_QFanuLWn'

export const supabase = createClient(supabaseUrl, supabaseKey)