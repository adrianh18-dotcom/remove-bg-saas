import type { NextApiRequest, NextApiResponse } from 'next';
import Replicate from 'replicate';
import formidable from 'formidable';
import fs from 'fs';

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN! });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err || !files.image) return res.status(400).json({ error: 'Erro ao processar imagem' });

    const imagePath = (Array.isArray(files.image) ? files.image[0] : files.image).filepath;

    try {
      const output = await replicate.run(
        'cjwbw/rembg:latest',
        {
          input: {
            image: fs.readFileSync(imagePath, { encoding: 'base64' })
          }
        }
      );

      const imageBuffer = Buffer.from(output as string, 'base64');
      res.setHeader('Content-Type', 'image/png');
      res.send(imageBuffer);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Falha na remoção de fundo' });
    }
  });
}
