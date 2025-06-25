import type { NextApiRequest, NextApiResponse } from 'next';
import Replicate from 'replicate';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err: any, fields: formidable.Fields, files: formidable.Files) => {
    if (err || !files.image) {
      return res.status(400).json({ error: 'Erro ao processar imagem' });
    }

    const file = Array.isArray(files.image) ? files.image[0] : files.image;

    const stream = fs.createReadStream(file.filepath);

    try {
      const output = await replicate.run(
        'pollinations/background-removal',
        {
          input: {
            image: stream,
          },
        }
      );

      const imageUrl = output as string;
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();

      res.setHeader('Content-Type', 'image/png');
      res.send(Buffer.from(imageBuffer));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao remover fundo' });
    }
  });
}
