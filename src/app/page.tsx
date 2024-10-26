'use client';

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateImage = async () => {
    if (!prompt) return;
    
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
      }
    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center w-full max-w-2xl">
        <h1 className="text-2xl font-bold">Hugging Face Image Generator</h1>
        
        <div className="w-full space-y-4">
          <textarea
            className="w-full p-4 border rounded-lg resize-none h-32"
            placeholder="Describe the image you want to generate... (e.g., 'a beautiful sunset over mountains')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          
          <button
            onClick={generateImage}
            disabled={loading || !prompt}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating (this may take a minute)...' : 'Generate Image'}
          </button>

          {error && (
            <div className="text-red-500 text-sm mt-2 p-2 bg-red-50 rounded">
              Error: {error}
            </div>
          )}
        </div>

        {generatedImage && (
          <div className="w-full max-w-xl">
            <img
              src={generatedImage}
              alt="Generated image"
              className="w-full h-auto rounded-lg shadow-lg"
            />
            <button
              onClick={() => window.open(generatedImage)}
              className="mt-4 text-sm text-blue-600 hover:underline"
            >
              Open full size image
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
