import React, { useState, DragEvent, ChangeEvent } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (base64: string) => void;
  gallery: string[];
}

const ImageUploadModal: React.FC<ModalProps> = ({ isOpen, onClose, onImageSelect, gallery }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFile = async (file: File) => {
    setError('');
    if (file && file.type.startsWith('image/')) {
      try {
        const base64 = await fileToBase64(file);
        onImageSelect(base64);
      } catch (err) {
        setError('Falha ao ler o arquivo.');
      }
    } else {
      setError('Por favor, selecione um arquivo de imagem válido (PNG, JPG, etc.).');
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Necessary to allow drop
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          handleFile(e.target.files[0]);
      }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Selecionar Imagem</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </header>
        
        <main className="p-6 flex-grow overflow-y-auto space-y-6">
            <div>
                 <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleFileInputChange} />
                 <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging ? 'border-amber-400 bg-gray-700' : 'border-gray-600 hover:border-amber-500'}`}
                 >
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        <p className="text-gray-300">Arraste e solte uma imagem aqui</p>
                        <p className="text-sm text-gray-500">ou</p>
                        <p className="font-semibold text-amber-400">Clique para selecionar</p>
                    </label>
                 </div>
                 {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>
            {gallery.length > 0 && (
                 <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Ou selecione da galeria</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {gallery.map((imgSrc, index) => (
                            <div key={index} onClick={() => onImageSelect(imgSrc)} className="aspect-square bg-gray-900 rounded-md overflow-hidden cursor-pointer border-2 border-transparent hover:border-amber-400 transition-all transform hover:scale-105">
                                <img src={imgSrc} alt={`Gallery image ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                 </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default ImageUploadModal;