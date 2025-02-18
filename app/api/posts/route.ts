import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get the post data from the request
    const post = await request.json();

    // Validate required fields for publishing
    if (post.status === 'published') {
      const requiredFields = ['title', 'content', 'excerpt', 'featuredImage', 'seoTitle', 'seoDescription'];
      const missingFields = requiredFields.filter(field => !post[field]);
      
      if (missingFields.length > 0) {
        return NextResponse.json(
          { error: `Missing required fields: ${missingFields.join(', ')}` },
          { status: 400 }
        );
      }
    }

    // Generate slug if not provided
    if (!post.slug) {
      post.slug = post.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Add timestamps and author
    const now = new Date().toISOString();
    const data = {
      ...post,
      author_id: user.id,
      updated_at: now,
      published_at: post.status === 'published' ? now : null
    };

    let result;
    if (post.id) {
      // Update existing post
      const { data: updatedPost, error: updateError } = await supabase
        .from('posts')
        .update(data)
        .eq('id', post.id)
        .select('*')
        .single();

      if (updateError) throw updateError;
      result = updatedPost;
    } else {
      // Create new post
      const { data: newPost, error: insertError } = await supabase
        .from('posts')
        .insert([{ ...data, created_at: now }])
        .select('*')
        .single();

      if (insertError) throw insertError;
      result = newPost;
    }

    return NextResponse.json({ post: result });
  } catch (error) {
    console.error('Error saving post:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save post' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (id) {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('author_id', user.id)
        .eq('id', id)
        .single();

      if (error) throw error;
      return NextResponse.json({ posts: data });
    } else {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json({ posts: data });
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch posts' },
      { status: 500 }
    );
  }
} 