import { NextRequest, NextResponse } from 'next/server';
import { fetchPostsFromGitHub } from '@/lib/github';

export async function GET(request: NextRequest) {
  try {
    const posts = await fetchPostsFromGitHub();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, author, excerpt, tags, categories, image } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const { createPostOnGitHub } = await import('@/lib/github');
    
    const result = await createPostOnGitHub(title, content, {
      author,
      excerpt,
      tags: tags ? tags.split(',').map((t: string) => t.trim()) : [],
      categories: categories ? categories.split(',').map((c: string) => c.trim()) : [],
      image,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
