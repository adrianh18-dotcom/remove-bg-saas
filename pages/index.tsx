import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setResultUrl(null);
    }
  };

  const handleRemoveBackground = async () => {
    if (!image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (error) {
      console.error('Erro ao remover fundo:', error);
    }

    setLoading(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Remova o fundo da sua imagem grátis</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4"
      />

      <Button onClick={handleRemoveBackground} disabled={!image || loading}>
        {loading ? <Loader2 className="animate-spin" /> : 'Remover Fundo'}
      </Button>

      {resultUrl && (
        <Card className="mt-6 w-full max-w-md">
          <CardContent className="p-4">
            <img src={resultUrl} alt="Imagem sem fundo" className="rounded-xl" />
            <a href={resultUrl} download className="block mt-4 text-center font-medium underline">
              Baixar imagem
            </a>
          </CardContent>
        </Card>
      )}

      {/* Espaço para o AdSense */}
      <div className="mt-10 w-full max-w-md h-32 border rounded bg-white flex items-center justify-center">
        <span>Anúncio Google AdSense aqui</span>
      </div>
    </main>
  );
}
