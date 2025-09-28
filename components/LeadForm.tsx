import React, { useState, useEffect, FormEvent, ChangeEvent, useRef } from 'react';
import { LeadFormData, UtmParams } from '../types';
import { COUNTRIES } from '../constants';

interface State {
  id: number;
  sigla: string;
  nome: string;
}
interface City {
  id: number;
  nome: string;
}

const initialFormData: LeadFormData = {
  name: '',
  whatsapp: '',
  email: '',
  cep: '',
  state: '',
  city: '',
  dialCode: '55', // Default Brazil
  lgpdConsent: false,
};

const initialUtmParams: UtmParams = {
  utm_source: '',
  utm_medium: '',
  utm_campaign: '',
  utm_term: '',
  utm_content: '',
};

const LeadForm: React.FC = () => {
  const [formData, setFormData] = useState<LeadFormData>(initialFormData);
  const [utmParams, setUtmParams] = useState<UtmParams>(initialUtmParams);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // State for location fields
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [cepError, setCepError] = useState('');

  // State for country dropdown
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch states from IBGE API
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => setStates(data as State[]))
      .catch(error => console.error("Failed to fetch states:", error));
      
    // Get UTM params from URL
    const searchParams = new URLSearchParams(window.location.search);
    setUtmParams({
      utm_source: searchParams.get('utm_source') || '',
      utm_medium: searchParams.get('utm_medium') || '',
      utm_campaign: searchParams.get('utm_campaign') || '',
      utm_term: searchParams.get('utm_term') || '',
      utm_content: searchParams.get('utm_content') || '',
    });

    // Close dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch cities when state changes
  useEffect(() => {
    if (formData.state) {
      setCities([]); // Clear previous cities
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.state}/municipios`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(data => setCities(data as City[]))
        .catch(error => console.error("Failed to fetch cities:", error));
    } else {
      setCities([]);
    }
  }, [formData.state]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    if (name === 'state') {
        setFormData(prev => ({ ...prev, state: value, city: '' }));
    } else {
        setFormData(prev => ({ ...prev, [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value }));
    }
  };

  const handleCountrySelect = (dialCode: string) => {
    setFormData(prev => ({ ...prev, dialCode, whatsapp: '' }));
    setIsCountryDropdownOpen(false);
  };

  const handleWhatsappChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    if (formData.dialCode === '55') { // Apply Brazil mask
        value = value.replace(/\D/g, '').slice(0, 11);
        if (value.length > 10) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        } else if (value.length > 6) {
            value = value.replace(/^(\d{2})(\d{4,5})/, "($1) $2");
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})/, "($1) ");
        } else {
            value = value.replace(/^(\d*)/, '($1');
        }
    } else {
        value = value.replace(/\D/g, '').slice(0, 15);
    }
    setFormData(prev => ({ ...prev, whatsapp: value }));
  };


  const handleCepChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const maskedCep = e.target.value
      .replace(/\D/g, '')
      .replace(/^(\d{5})(\d)/, '$1-$2')
      .slice(0, 9);
      
    setFormData(prev => ({ ...prev, cep: maskedCep }));
    
    const cepDigits = maskedCep.replace(/\D/g, '');
    setCepError('');

    if (cepDigits.length === 8) {
      setIsFetchingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`);
        const data = await response.json();
        if (data.erro) {
          setCepError('CEP não encontrado.');
          setFormData(prev => ({ ...prev, state: '', city: '' }));
        } else {
          setFormData(prev => ({ ...prev, state: data.uf, city: data.localidade }));
        }
      } catch (error) {
        setCepError('Erro ao buscar CEP.');
      } finally {
        setIsFetchingCep(false);
      }
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.lgpdConsent) {
        alert("Você precisa aceitar os termos de uso de dados para continuar.");
        return;
    }
    setIsSubmitting(true);
    setSubmissionStatus('idle');

    const cleanedData = {
        name: formData.name,
        email: formData.email,
        whatsapp: formData.dialCode + formData.whatsapp.replace(/\D/g, ''),
        cep: formData.cep.replace(/\D/g, ''),
        state: formData.state,
        city: formData.city,
        lgpdConsent: formData.lgpdConsent,
    };

    const fullPayload = { ...cleanedData, ...utmParams, timestamp: new Date().toISOString() };
    console.log('Submitting to n8n webhook:', fullPayload);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionStatus('success');
      setFormData(initialFormData);
      setTimeout(() => setSubmissionStatus('idle'), 5000);
    }, 1500);
  };

  const inputClasses = "w-full bg-red-950 border border-red-700 rounded-md py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition";
  const selectedCountry = COUNTRIES.find(c => c.dialCode === formData.dialCode) || COUNTRIES[0];

  return (
    <div className="bg-red-900 bg-opacity-70 backdrop-blur-sm p-6 sm:p-8 rounded-lg shadow-2xl border border-red-800">
      {submissionStatus === 'success' ? (
        <div className="text-center py-10">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-400 mx-auto mb-4" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          <h3 className="text-2xl font-bold text-white">Obrigado!</h3>
          <p className="text-gray-300 mt-2">Recebemos seu contato! Um representante da sua região falará com você em breve.</p>
        </div>
      ) : (
        <>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">Fale com um Especialista</h3>
          <p className="text-gray-400 mb-6 text-sm sm:text-base">Aproveite as ofertas da Black Friday.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.entries(utmParams).map(([key, value]) => (
                <input type="hidden" name={key} value={value} key={key} />
            ))}
            
            <div>
              <input type="text" name="name" id="name" placeholder="Nome Completo" value={formData.name} onChange={handleChange} required className={inputClasses}/>
            </div>

            <div className="flex items-stretch gap-0">
                <div ref={countryDropdownRef} className="relative">
                    <button type="button" onClick={() => setIsCountryDropdownOpen(prev => !prev)} className="h-full flex items-center justify-center bg-red-950 border border-r-0 border-red-700 rounded-l-md px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition">
                        <span>{selectedCountry.flag}</span>
                        <span className="ml-2 text-sm">+{selectedCountry.dialCode}</span>
                    </button>
                    {isCountryDropdownOpen && (
                        <ul className="absolute bottom-full mb-2 w-56 max-h-60 overflow-y-auto bg-gray-900 border border-gray-700 rounded-md shadow-lg z-20">
                           {COUNTRIES.map(country => (
                               <li key={country.code} onClick={() => handleCountrySelect(country.dialCode)} className="flex items-center gap-3 px-4 py-2 text-white hover:bg-red-800 cursor-pointer">
                                   <span>{country.flag}</span>
                                   <span className="flex-1">{country.name}</span>
                                   <span className="text-gray-400">+{country.dialCode}</span>
                               </li>
                           ))}
                        </ul>
                    )}
                </div>
              <input type="tel" name="whatsapp" id="whatsapp" placeholder={formData.dialCode === '55' ? '(XX) XXXXX-XXXX' : 'Seu número'} value={formData.whatsapp} onChange={handleWhatsappChange} required className={`${inputClasses} rounded-l-none`} />
            </div>

            <div>
              <input type="email" name="email" id="email" placeholder="Seu melhor e-mail" value={formData.email} onChange={handleChange} required className={inputClasses}/>
            </div>
            
            <div className="space-y-4 pt-2">
                <div className='relative'>
                    <input type="tel" name="cep" id="cep" placeholder="CEP (00000-000)" value={formData.cep} onChange={handleCepChange} maxLength={9} className={inputClasses} />
                     {isFetchingCep && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <svg className="animate-spin h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    )}
                </div>
                 {cepError && <p className="text-red-400 text-xs mt-1">{cepError}</p>}
                 
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                        <select name="state" id="state" value={formData.state} onChange={handleChange} required className={`${inputClasses} appearance-none`}>
                            <option value="" disabled>Selecione o Estado</option>
                            {states.map(state => (
                            <option key={state.id} value={state.sigla}>{state.nome}</option>
                            ))}
                        </select>
                    </div>
                     <div>
                        <select name="city" id="city" value={formData.city} onChange={handleChange} required disabled={!formData.state || cities.length === 0} className={`${inputClasses} appearance-none disabled:bg-red-800/50 disabled:cursor-not-allowed`}>
                            <option value="" disabled>Selecione a Cidade</option>
                             {cities.map(city => (
                            <option key={city.id} value={city.nome}>{city.nome}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            
            <div className="pt-2">
                <label htmlFor="lgpdConsent" className="flex items-start gap-3">
                    <input 
                        type="checkbox" 
                        name="lgpdConsent" 
                        id="lgpdConsent"
                        checked={formData.lgpdConsent}
                        onChange={handleChange}
                        required
                        className="mt-1 h-4 w-4 rounded text-amber-500 bg-gray-700 border-gray-600 focus:ring-amber-500"
                    />
                    <span className="text-xs text-gray-400">
                        Ao enviar, concordo que os dados fornecidos serão utilizados exclusivamente pela BomCorte para entrar em contato e oferecer informações sobre produtos e promoções.
                    </span>
                </label>
            </div>

            <button type="submit" disabled={isSubmitting || !formData.lgpdConsent} className="w-full bg-amber-500 text-gray-900 font-bold py-3 px-4 rounded-md hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-amber-500 transition-transform transform hover:scale-105 disabled:bg-amber-700/50 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : 'Quero falar com um representante'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default LeadForm;