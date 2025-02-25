import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { userIds } = await request.json()
    
    if (!Array.isArray(userIds)) {
      return NextResponse.json({ error: 'userIds must be an array' }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })
    
    const usersPromises = userIds.map(async (id) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('id', id)
        .single()
        
      if (error || !data) return null
      return { id: data.id, email: data.email }
    })

    const users = (await Promise.all(usersPromises)).filter((user): user is { id: string, email: string } => user !== null)

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error in users API:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 