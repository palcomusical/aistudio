import React, { useState, FormEvent, ChangeEvent } from 'react';
import { LandingPageContent, Feature, Product } from '../../types';
import ImageUploadModal from './ImageUploadModal';

interface EditorProps {
  initialContent: LandingPageContent;
  onSave: (newContent: LandingPageContent) => void;
}

const FormRow: React.FC<{label: string, children: React.ReactNode, className?: string}> = ({label, children, className}) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        {children}
    </div>
);
  
const TextInput: React.FC<{value: string, name: string, onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void, placeholder?: string, isTextArea?: boolean}> = ({value, name, onChange, placeholder, isTextArea=false}) => {
    const commonProps = {
        value,
        name,
        onChange,
        placeholder,
        className:"w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
    };
    return isTextArea ? <textarea {...commonProps} rows={3} /> : <input type="text" {...commonProps} />;
};

const LandingPageEditor: React.FC<EditorProps> = ({ initialContent, onSave }) => {
  const [content, setContent] = useState<LandingPageContent>(initialContent);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<'logoUrl' | 'backgroundImageUrl' | 'productImage' | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>(
    [initialContent.backgroundImageUrl, ...initialContent.products.map(p => p.image)].filter(Boolean)
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checked = (e.target as HTMLInputElement).checked;
    
    // Ensure highlightedTitle is not undefined if it's being edited
    if (name === 'productSectionHighlightedTitle' && value === undefined) {
      setContent(prev => ({ ...prev, [name]: '' }));
      return;
    }

    setContent(prev => ({ ...prev, [name]: isCheckbox ? checked : value }));
  };

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setContent(prev => ({
          ...prev,
          colorPalette: {
              ...prev.colorPalette,
              [name]: value
          }
      }));
  }

  const handleFeatureChange = (id: string, newText: string) => {
      setContent(prev => ({
          ...prev,
          features: prev.features.map(f => f.id === id ? {...f, text: newText} : f)
      }));
  }
  
  const handleFeatureIconChange = (id: string, newIcon: string) => {
       setContent(prev => ({
          ...prev,
          features: prev.features.map(f => f.id === id ? {...f, icon: newIcon} : f)
      }));
  }

  const addFeature = () => {
      const newFeature: Feature = { id: `feat-${Date.now()}`, icon: 'check', text: 'Novo Destaque' };
      setContent(prev => ({ ...prev, features: [...prev.features, newFeature] }));
  }

  const removeFeature = (id: string) => {
      setContent(prev => ({ ...prev, features: prev.features.filter(f => f.id !== id) }));
  }

  const handleProductChange = (id: string, newName: string) => {
    setContent(prev => ({
        ...prev,
        products: prev.products.map(p => p.id === id ? {...p, name: newName} : p)
    }));
  }

  const addProduct = () => {
      const newProduct: Product = { id: `prod-${Date.now()}`, name: 'Novo Produto', image: 'https://picsum.photos/seed/new/400/300' };
      setContent(prev => ({ ...prev, products: [...prev.products, newProduct] }));
  }

  const removeProduct = (id: string) => {
      setContent(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(content);
  };
  
  const handleOpenModal = (field: 'logoUrl' | 'backgroundImageUrl' | 'productImage', productId?: string) => {
    setEditingField(field);
    if(productId) {
        setEditingProductId(productId);
    }
    setIsModalOpen(true);
  };

  const handleImageSelect = (imageBase64: string) => {
    if (editingField === 'logoUrl' || editingField === 'backgroundImageUrl') {
        setContent(prev => ({ ...prev, [editingField]: imageBase64 }));
    } else if (editingField === 'productImage' && editingProductId) {
        setContent(prev => ({
            ...prev,
            products: prev.products.map(p => p.id === editingProductId ? {...p, image: imageBase64} : p)
        }));
    }

    if (!uploadedImages.includes(imageBase64)) {
      setUploadedImages(prev => [...prev, imageBase64]);
    }
    setIsModalOpen(false);
    setEditingField(null);
    setEditingProductId(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-gray-800 bg-opacity-70 backdrop-blur-sm p-6 sm:p-8 rounded-lg shadow-2xl border border-gray-700 space-y-8">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Editor da Landing Page</h2>
             <button type="submit" className="bg-amber-500 text-gray-900 font-bold py-2 px-6 rounded-md hover:bg-amber-400 transition">Salvar Alterações</button>
        </div>
        
        <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
          <h3 className="font-semibold text-amber-400">Configurações Gerais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
             <FormRow label="Logo (opcional)">
                <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-gray-900 rounded-md flex items-center justify-center border border-gray-600 overflow-hidden">
                       {content.logoUrl ? <img src={content.logoUrl} alt="Preview Logo" className="object-contain h-full w-full" /> : <span className="text-gray-500 text-xs text-center">Sem Imagem</span>}
                    </div>
                    <button type="button" onClick={() => handleOpenModal('logoUrl')} className="bg-gray-700 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 transition">
                       {content.logoUrl ? 'Alterar Logo' : 'Enviar Logo'}
                    </button>
                </div>
             </FormRow>
             <FormRow label="Imagem de Fundo">
                <div className="flex items-center gap-4">
                     <div className="w-24 h-24 bg-gray-900 rounded-md flex items-center justify-center border border-gray-600 overflow-hidden">
                       {content.backgroundImageUrl ? <img src={content.backgroundImageUrl} alt="Preview Fundo" className="object-cover h-full w-full" /> : <span className="text-gray-500 text-xs text-center">Sem Imagem</span>}
                    </div>
                    <button type="button" onClick={() => handleOpenModal('backgroundImageUrl')} className="bg-gray-700 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 transition">
                       {content.backgroundImageUrl ? 'Alterar Fundo' : 'Enviar Fundo'}
                    </button>
                </div>
             </FormRow>
          </div>
        </div>

        <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
            <h3 className="font-semibold text-amber-400">Conteúdo do Cabeçalho</h3>
            <FormRow label="Título Principal">
                <TextInput name="mainTitle" value={content.mainTitle} onChange={handleChange} />
            </FormRow>
            <FormRow label="Título em Destaque">
                <TextInput name="highlightedTitle" value={content.highlightedTitle} onChange={handleChange} />
            </FormRow>
             <FormRow label="Descrição">
                <TextInput name="description" value={content.description} onChange={handleChange} isTextArea />
            </FormRow>
        </div>
        
        <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-amber-400">Ícones de Destaque</h3>
                <button type="button" onClick={addFeature} className="text-sm bg-gray-700 hover:bg-gray-600 text-white font-semibold py-1 px-3 rounded-md transition-colors">Adicionar</button>
            </div>
            {content.features.map(feature => (
                <div key={feature.id} className="flex items-center gap-2">
                    <select value={feature.icon} onChange={e => handleFeatureIconChange(feature.id, e.target.value)} className="bg-gray-900 border border-gray-600 rounded-md py-2 px-2 text-white h-11">
                        <option value="check">Check</option>
                        <option value="tag">Tag</option>
                        <option value="tool">Ferramenta</option>
                    </select>
                    <TextInput name={`feature-text-${feature.id}`} value={feature.text} onChange={e => handleFeatureChange(feature.id, e.target.value)} />
                    <button type="button" onClick={() => removeFeature(feature.id)} className="text-gray-500 hover:text-red-500 p-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg></button>
                </div>
            ))}
        </div>

        <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-amber-400">Seção de Produtos</h3>
                 <label htmlFor="showProductSection" className="flex items-center cursor-pointer">
                    <span className="mr-3 text-sm text-gray-300">Mostrar Seção</span>
                    <div className="relative">
                        <input type="checkbox" name="showProductSection" id="showProductSection" className="sr-only" checked={content.showProductSection} onChange={handleChange} />
                        <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                        <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                    </div>
                </label>
            </div>
            {content.showProductSection && (<>
                <FormRow label="Título da Seção em Destaque">
                    <TextInput name="productSectionHighlightedTitle" value={content.productSectionHighlightedTitle || ''} onChange={handleChange} />
                </FormRow>
                 <FormRow label="Título da Seção (Restante)">
                    <TextInput name="productSectionTitle" value={content.productSectionTitle} onChange={handleChange} />
                </FormRow>
                <FormRow label="Descrição da Seção">
                    <TextInput name="productSectionDescription" value={content.productSectionDescription} onChange={handleChange} isTextArea />
                </FormRow>
                <div className="pt-4">
                     <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-300">Produtos</h4>
                        <button type="button" onClick={addProduct} className="text-sm bg-gray-700 hover:bg-gray-600 text-white font-semibold py-1 px-3 rounded-md transition-colors">Adicionar Produto</button>
                    </div>
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                        {content.products.map(product => (
                            <div key={product.id} className="flex items-center gap-4 bg-gray-900 p-2 rounded-md">
                                <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-md" />
                                <div className="flex-grow">
                                    <TextInput name={`product-name-${product.id}`} value={product.name} onChange={e => handleProductChange(product.id, e.target.value)} />
                                </div>
                                <button type="button" onClick={() => handleOpenModal('productImage', product.id)} className="text-xs bg-gray-700 hover:bg-gray-600 text-white font-semibold py-1 px-2 rounded-md transition-colors">Imagem</button>
                                <button type="button" onClick={() => removeProduct(product.id)} className="text-gray-500 hover:text-red-500 p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg></button>
                            </div>
                        ))}
                    </div>
                </div>
            </>)}
        </div>

        <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
            <h3 className="font-semibold text-amber-400">Paleta de Cores</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(content.colorPalette).map(([key, value]) => (
                    <FormRow key={key} label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}>
                        <div className="relative">
                            <input type="color" name={key} value={value} onChange={handleColorChange} className="p-1 h-10 w-full block bg-gray-900 border border-gray-600 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none" />
                            <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 text-sm font-mono">{value}</span>
                        </div>
                    </FormRow>
                ))}
            </div>
        </div>
      </form>
      <ImageUploadModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImageSelect={handleImageSelect}
        gallery={uploadedImages}
      />
       <style>{`
          input[type="checkbox"]:checked ~ .dot {
            transform: translateX(100%);
            background-color: #f59e0b;
          }
           input[type="checkbox"]:checked ~ .block {
            background-color: #ca8a04;
          }
      `}</style>
    </div>
  );
};

export default LandingPageEditor;