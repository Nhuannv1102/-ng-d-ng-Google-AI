
import React from 'react';
import type { PosterData, ImageData } from '../types';
import { fileToBase64 } from '../utils/fileUtils';

// --- Helper Icons (defined at module level) ---
const WandIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M11.94 2.446a1 1 0 00-1.353-.393l-2.435 1.522a1 1 0 00-.51 1.139l.865 3.461a1 1 0 001.14.865l3.461-.865a1 1 0 00.865-1.14l-1.522-4.156a1 1 0 00-.476-.433zM3.522 7.78a1 1 0 00-1.14.865l.865 3.461a1 1 0 001.14.865l3.461-.865a1 1 0 00.865-1.14l-.865-3.461a1 1 0 00-1.14-.865L3.522 7.78zM12.5 11.5a1 1 0 011 1v.946a1 1 0 00.393 1.353l1.522 2.435a1 1 0 001.139.51l4.156-1.522a1 1 0 00.433-.476l.393-1.353a1 1 0 00-.51-1.139l-4.156-1.522a1 1 0 00-1.353.393L15.054 13.5H13.5a1 1 0 01-1-1zm-9.147 1.147a1 1 0 00-1.353.393L.478 17.196a1 1 0 00.51 1.139l4.156 1.522a1 1 0 001.139-.51l1.522-4.156a1 1 0 00-.393-1.353L3.353 12.647z" />
  </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
    </svg>
);


// --- Helper Components (defined at module level) ---

interface TextInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  maxLength: number;
  placeholder?: string;
  isTextArea?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ label, value, onChange, maxLength, placeholder, isTextArea }) => {
  const InputComponent = isTextArea ? 'textarea' : 'input';
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
      <div className="relative">
        <InputComponent
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          placeholder={placeholder}
          className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
          rows={isTextArea ? 4 : undefined}
        />
        <span className="absolute bottom-2 right-2 text-xs text-slate-400">
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
};

interface ImageUploaderProps {
    label: string;
    image: ImageData | null;
    onImageUpload: (image: ImageData | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, image, onImageUpload }) => {
    const inputId = `file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const { base64, mimeType } = await fileToBase64(file);
                onImageUpload({ base64, mimeType, name: file.name });
            } catch (error) {
                console.error("Error converting file to base64", error);
                onImageUpload(null);
            }
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
            {image ? (
                <div className="relative group p-2 bg-slate-700/50 border border-slate-600 rounded-md">
                    <img src={`data:${image.mimeType};base64,${image.base64}`} alt="Preview" className="w-full h-24 object-contain rounded-md" />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button onClick={() => onImageUpload(null)} className="p-2 text-white bg-red-600 rounded-full hover:bg-red-700">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <label htmlFor={inputId} className="cursor-pointer flex flex-col items-center justify-center w-full h-24 border-2 border-slate-600 border-dashed rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadIcon className="w-8 h-8 mb-2 text-slate-400" />
                            <p className="text-sm text-slate-400">Click to upload</p>
                        </div>
                        <input id={inputId} type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
                    </label>
                </>
            )}
        </div>
    );
};


// --- Main InputPanel Component ---
interface InputPanelProps {
  posterData: PosterData;
  setPosterData: React.Dispatch<React.SetStateAction<PosterData>>;
  onGenerateContent: () => void;
  onCreatePoster: () => void;
  isGeneratingContent: boolean;
  isCreatingPoster: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  posterData,
  setPosterData,
  onGenerateContent,
  onCreatePoster,
  isGeneratingContent,
  isCreatingPoster
}) => {
  const handleInputChange = (field: keyof PosterData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPosterData(prev => ({ ...prev, [field]: e.target.value }));
  };
  
  const handleImageUpload = (field: 'mainImage' | 'qrCode') => (image: ImageData | null) => {
    setPosterData(prev => ({ ...prev, [field]: image }));
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg space-y-6 h-full">
      <h2 className="text-xl font-bold text-white">2. Nhập Nội Dung</h2>
      
      <div className="space-y-4">
        <TextInput
          label="Chủ đề (để AI viết nội dung)"
          value={posterData.topic}
          onChange={handleInputChange('topic')}
          maxLength={180}
          placeholder="Ví dụ: Khai trương quán cafe, Giảm giá mùa hè..."
        />
        <button 
            onClick={onGenerateContent} 
            disabled={isGeneratingContent}
            className="w-full flex items-center justify-center bg-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300 disabled:bg-purple-800 disabled:cursor-not-allowed">
            {isGeneratingContent ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang viết...
                </>
            ) : (
                <>
                    <WandIcon className="w-5 h-5 mr-2"/>
                    Viết Nội Dung Bằng AI
                </>
            )}
        </button>
      </div>

      <hr className="border-slate-700"/>

      <div className="space-y-4">
        <TextInput
          label="Tiêu Đề Chính"
          value={posterData.title}
          onChange={handleInputChange('title')}
          maxLength={100}
        />
        <TextInput
          label="Nội Dung Chi Tiết"
          value={posterData.details}
          onChange={handleInputChange('details')}
          maxLength={500}
          isTextArea={true}
        />
        <TextInput
          label="Thông Tin Thương Hiệu / Liên Hệ"
          value={posterData.contact}
          onChange={handleInputChange('contact')}
          maxLength={100}
        />
      </div>

      <div className="space-y-4">
        <ImageUploader 
            label="Tải Ảnh Chính Lên (Tùy chọn)"
            image={posterData.mainImage}
            onImageUpload={handleImageUpload('mainImage')}
        />
        <ImageUploader 
            label="Tải Mã QR Lên (Tùy chọn)"
            image={posterData.qrCode}
            onImageUpload={handleImageUpload('qrCode')}
        />
      </div>

      <div className="pt-4">
        <button 
            onClick={onCreatePoster}
            disabled={isCreatingPoster}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg">
            {isCreatingPoster ? 'Đang tạo Poster...' : 'TẠO POSTER'}
        </button>
      </div>
    </div>
  );
};
