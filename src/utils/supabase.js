import { createClient } from '@supabase/supabase-js'

// Replace with your Supabase project URL and anon key
const supabase = createClient(
  'https://zijrgnhpgfohsewyqukg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppanJnbmhwZ2ZvaHNld3lxdWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxNTM5MTMsImV4cCI6MjA1NDcyOTkxM30.zPlOBDu49raYPeWpjtEdTru6qRLJTfuUmvGkAcjZda0'
)

export default supabase
