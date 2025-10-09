import React from 'react';
import LeadForm from './LeadForm';
import ProductCatalog from './ProductCatalog';
import { LandingPageContent } from '../types';
import CountdownTimer from './CountdownTimer';

interface LandingPageProps {
  content: LandingPageContent;
  onNavigate: (view: 'home' | 'landing' | 'admin') => void;
}

// Helper component for dynamic icons
const DynamicIcon: React.FC<{ icon: string; className?: string, style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
    const props = { className, style };
    switch(icon) {
        case 'check':
            return <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
        case 'tag':
            return <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5a.997.997 0 01.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>;
        case 'tool':
        default:
             return <svg xmlns="http://www.w3.org/2000/svg" {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
    }
}

const LandingPage: React.FC<LandingPageProps> = ({ content, onNavigate }) => {
  const { 
    mainTitle, highlightedTitle, description, features, backgroundImageUrl, 
    colorPalette, logoUrl, showProductSection, productSectionTitle, 
    productSectionHighlightedTitle, productSectionDescription, products 
  } = content;

  const countdownBackgroundStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url('${backgroundImageUrl}')`
  };
  
  const accentColorStyle = { color: colorPalette.accent };
  const textPrimaryStyle = { color: colorPalette.textPrimary };
  const textSecondaryStyle = { color: colorPalette.textSecondary };

  const handleNavigateClick = (event: React.MouseEvent<HTMLAnchorElement>, view: 'home' | 'landing' | 'admin') => {
    event.preventDefault();
    onNavigate(view);
  };

  return (
    <>
      {/* First Fold: Countdown */}
      <div 
        className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-cover bg-center bg-fixed"
        style={countdownBackgroundStyle}
      >
        <CountdownTimer />
        <div className="absolute bottom-10 animate-bounce cursor-pointer" onClick={() => document.getElementById('lead-form-section')?.scrollIntoView({ behavior: 'smooth' })}>
          <svg className="w-10 h-10 text-white opacity-50 hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>

      {/* Second Fold: Info and Form */}
      <div id="lead-form-section" className="py-16 sm:py-24" style={{ backgroundColor: colorPalette.primary }}>
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <main className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                   {logoUrl ? <img src={logoUrl} alt="BomCorte Logo" className="h-10 object-contain" /> : <DynamicIcon icon='tool' className="w-10 h-10" style={accentColorStyle}/> }
                  <h2 className="text-xl font-bold tracking-wider uppercase" style={accentColorStyle}>BomCorte</h2>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight" style={textPrimaryStyle}>
                  {mainTitle}
                  <span className="block" style={accentColorStyle}>{highlightedTitle}</span>
                </h1>
                <p className="mt-6 text-lg sm:text-xl max-w-lg mx-auto lg:mx-0" style={textSecondaryStyle}>
                  {description}
                </p>
                <div className="mt-8 flex justify-center lg:justify-start gap-4" style={{color: colorPalette.accent}}>
                   {features.map(feature => (
                     <div key={feature.id} className="flex items-center gap-2">
                        <DynamicIcon icon={feature.icon} className="h-5 w-5" />
                        <span style={{ color: colorPalette.textSecondary }}>{feature.text}</span>
                     </div>
                   ))}
                </div>
              </div>

              <div>
                <LeadForm />
              </div>
            </main>
        </div>
      </div>
      
      {showProductSection && (
         <ProductCatalog 
            title={productSectionTitle}
            highlightedTitle={productSectionHighlightedTitle}
            description={productSectionDescription}
            products={products}
            backgroundColor={colorPalette.primary}
            accentColor={colorPalette.accent}
        />
      )}
      
      <footer className="text-center py-6" style={{ backgroundColor: colorPalette.primary }}>
        <p className="text-gray-300 text-sm">
          &copy; {new Date().getFullYear()} BomCorte. Todos os direitos reservados.
        </p>
        <div className="mt-2">
            <a 
                href="/" 
                onClick={(e) => handleNavigateClick(e, 'home')}
                className="text-xs text-gray-400 hover:text-amber-400 transition-colors"
            >
                Página Inicial
            </a>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;