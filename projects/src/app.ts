import { createClient } from "@supabase/supabase-js"
export function createServerClient() {
//   const cookieStore = cookies()
//   console.log('SUPABASE_URL:', process.env.SUPABASE_URL)
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
//   console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY)
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    // cookies: {
    //   get(name: string) {
    //     return cookieStore.get(name)?.value
    //   },
    // },
  })
}

async function connectUsers() {
    let supabase = createServerClient()
    console.log('supabase===========>', supabase);
    let { data: users, error } = await supabase
        .from('users')
        .select('*')
    console.log('data====>', users);
    let { data: blogs, error: errror1 } = await supabase
    .from('blogs')
    .select('content')
    console.log('data blogs====>', blogs);
}
export default connectUsers;