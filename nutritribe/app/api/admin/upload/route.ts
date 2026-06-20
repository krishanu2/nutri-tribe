import { NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: 'Image uploads are not configured yet. Ask your developer to connect a Blob store in Vercel.' },
        { status: 500 }
      );
    }

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'],
        // Generous ceiling for real product/blog/recipe photos — well above the
        // ~4.5MB limit a server-side route handler would otherwise be capped at.
        maximumSizeInBytes: 20 * 1024 * 1024,
        addRandomSuffix: false,
      }),
    });

    return NextResponse.json(jsonResponse);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Upload failed. Please try again.' },
      { status: 400 }
    );
  }
}
