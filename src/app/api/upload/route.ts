import { NextRequest, NextResponse } from 'next/server';
import Busboy from 'busboy';
import { Readable } from 'stream';
import { put } from '@vercel/blob';
import { getFileType } from '@/lib/fileType';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  return await new Promise<NextResponse>((resolve, reject) => {
    const bb = Busboy({ headers: Object.fromEntries(req.headers) });
    let filename = '';
    let mimeType = '';
    const chunks: Buffer[] = [];

    bb.on('file', (_name, stream, info) => {
      filename = info.filename;
      mimeType = info.mimeType;
      stream.on('data', (data) => chunks.push(data));
    });

    bb.on('finish', async () => {
      try {
        const buffer = Buffer.concat(chunks);
        const { url } = await put(filename, buffer, { access: 'public' });
        const fileType = getFileType(mimeType, filename);

        fetch('https://example.n8n.cloud/webhook/uploads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, filename, fileType })
        }).catch((err) => console.error('Webhook error', err));

        resolve(NextResponse.json({ success: true, url, fileType }));
      } catch (err) {
        reject(err);
      }
    });

    bb.on('error', (err) => reject(err));

    if (req.body) {
      Readable.fromWeb(req.body as any).pipe(bb);
    } else {
      reject(new Error('No body'));
    }
  });
}
