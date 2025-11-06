
import React, { useState, useCallback, useEffect } from 'react';
import { InputPanel } from './components/InputPanel';
import { PosterPreview } from './components/PosterPreview';
import { generateContentFromTopic, generatePosterImage } from './services/geminiService';
import type { PosterData } from './types';

const LOCAL_STORAGE_KEY = 'aiPosterGeneratorData';

const getInitialPosterData = (): PosterData => {
  try {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // Basic validation
      if (typeof parsedData === 'object' && parsedData !== null && 'topic' in parsedData) {
        return parsedData as PosterData;
      }
    }
  } catch (error) {
    console.error("Failed to parse poster data from localStorage", error);
    // If parsing fails, clear the corrupted data
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }

  // Return default data if nothing is saved or if parsing fails
  return {
    topic: 'Khai trương quán cafe, Giảm giá mùa hè...',
    title: 'KIẾM TIỀN AI ĐỈNH CAO',
    details: '20H00\nHọc online qua Zoom\nID Cuộc họp: 556 665 5599\nMật mã: 66',
    contact: 'Phone: 0982101088\n@Thuyaiaglobal',
    mainImage: null,
    qrCode: null,
  };
};


function App() {
  const [posterData, setPosterData] = useState<PosterData>(getInitialPosterData);

  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [isCreatingPoster, setIsCreatingPoster] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Save to localStorage whenever posterData changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(posterData));
    } catch (error) {
      console.error("Failed to save poster data to localStorage", error);
    }
  }, [posterData]);


  const handleGenerateContent = useCallback(async () => {
    if (!posterData.topic) return;
    setIsGeneratingContent(true);
    setError(null);
    try {
      const content = await generateContentFromTopic(posterData.topic);
      setPosterData(prev => ({
        ...prev,
        title: content.title,
        details: content.details,
        contact: content.contact,
      }));
    } catch (e) {
      setError('Failed to generate content. Please try again.');
      console.error(e);
    } finally {
      setIsGeneratingContent(false);
    }
  }, [posterData.topic]);

  const handleCreatePoster = useCallback(async () => {
    setIsCreatingPoster(true);
    setError(null);
    setGeneratedImageUrl(null);
    try {
      const imageUrl = await generatePosterImage(posterData);
      setGeneratedImageUrl(imageUrl);
    } catch (e) {
      setError('Failed to create poster. Please try again.');
      console.error(e);
    } finally {
      setIsCreatingPoster(false);
    }
  }, [posterData]);

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 font-sans">
      <header className="py-6 px-4 md:px-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          Trình Tạo Poster AI
        </h1>
        <p className="text-slate-400 mt-2 max-w-2xl mx-auto">
          Tạo poster chuyên nghiệp, ấn tượng trong vài giây. Chỉ cần mô tả nội dung, chọn phong cách, và để AI lo phần còn lại.
        </p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 md:p-8">
        <div className="lg:col-span-1">
          <InputPanel
            posterData={posterData}
            setPosterData={setPosterData}
            onGenerateContent={handleGenerateContent}
            onCreatePoster={handleCreatePoster}
            isGeneratingContent={isGeneratingContent}
            isCreatingPoster={isCreatingPoster}
          />
        </div>
        <div className="lg:col-span-2">
          <PosterPreview
            posterData={posterData}
            isLoading={isCreatingPoster}
            generatedImageUrl={generatedImageUrl}
            error={error}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
