import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    const commentsRef = collection(db, 'comments');
    const snapshot = await getDocs(commentsRef);
    const comments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postSlug, author, email, content, parentId } = body;

    if (!postSlug || !author || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const commentsRef = collection(db, 'comments');
    const docRef = await addDoc(commentsRef, {
      postSlug,
      author,
      email: email || '',
      content,
      parentId: parentId || null,
      approved: false,
      isAdmin: false,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json(
      {
        id: docRef.id,
        postSlug,
        author,
        content,
        approved: false,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
