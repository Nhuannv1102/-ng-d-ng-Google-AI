
import React from 'react';
import type { PosterData } from '../types';

interface PosterPreviewProps {
    posterData: PosterData;
    isLoading: boolean;
    generatedImageUrl: string | null;
    error: string | null;
}

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const ErrorIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const PosterPreview: React.FC<PosterPreviewProps> = ({ posterData, isLoading, generatedImageUrl, error }) => {
    
    const handleDownload = () => {
        if (!generatedImageUrl) return;
        const link = document.createElement('a');
        link.href = generatedImageUrl;
        link.download = 'ai-poster.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderLivePreview = () => (
        <div className="aspect-[9/16] w-full max-w-md mx-auto bg-gray-800 text-white overflow-hidden relative font-sans select-none">
            {posterData.mainImage ? (
                 <img src={`data:${posterData.mainImage.mimeType};base64,${posterData.mainImage.base64}`} alt="Main" className="absolute inset-0 w-full h-full object-cover opacity-80" />
            ) : (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-700 to-gray-900"></div>
            )}
           
            <div className="absolute inset-0 bg-black/40"></div>
            
            <div className="relative z-10 p-8 flex flex-col h-full">
                <div className="flex-grow flex flex-col items-center justify-center text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight break-words" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.7)'}}>
                        {posterData.title}
                    </h1>
                </div>

                <div className="text-center mb-8">
                    <p className="text-lg whitespace-pre-line leading-relaxed" style={{textShadow: '1px 1px 4px rgba(0,0,0,0.8)'}}>
                        {posterData.details}
                    </p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg mt-auto">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-left">
                            <p className="whitespace-pre-line">{posterData.contact}</p>
                        </div>
                        {posterData.qrCode && (
                             <img src={`data:${posterData.qrCode.mimeType};base64,${posterData.qrCode.base64}`} alt="QR Code" className="w-20 h-20 rounded-md bg-white p-1" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
    
    return (
        <div className="bg-slate-800 p-4 rounded-xl shadow-lg h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Poster Preview</h2>
                {generatedImageUrl && (
                    <button onClick={handleDownload} className="flex items-center bg-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300">
                        <DownloadIcon className="w-5 h-5 mr-2"/>
                        Tải Xuống
                    </button>
                )}
            </div>
            <div className="flex-grow bg-slate-900/50 rounded-lg flex items-center justify-center p-4 relative min-h-[600px]">
                {isLoading && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20 rounded-lg">
                        <svg className="animate-spin h-10 w-10 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-4 text-lg text-white">AI is creating your poster... Hang tight!</p>
                    </div>
                )}
                {error && !isLoading && (
                     <div className="absolute inset-0 bg-red-900/50 flex flex-col items-center justify-center z-20 rounded-lg p-4 text-center">
                        <ErrorIcon className="w-12 h-12 text-red-300 mb-4"/>
                        <h3 className="text-xl font-bold text-white mb-2">An Error Occurred</h3>
                        <p className="text-red-200">{error}</p>
                    </div>
                )}
                {generatedImageUrl ? (
                    <img src={generatedImageUrl} alt="Generated Poster" className="max-w-full max-h-full object-contain rounded-md" />
                ) : (
                    renderLivePreview()
                )}
            </div>
        </div>
    );
};