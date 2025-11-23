import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signOut } from '../services/fermentationService';
import { IS_DEMO_MODE } from '../constants';
import { useTheme } from '../contexts/ThemeContext';
import { KefirGirlLogo } from './Illustrations';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTheme();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-[#faeee7]">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer group" onClick={() => navigate('/dashboard')}>
              <div className="w-11 h-11 mr-3 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                <KefirGirlLogo className="w-full h-full" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-700 group-hover:text-lime-600 transition-colors">{t('nav.home')}</span>
            </div>
            
            <div className="flex items-center space-x-4">
               {IS_DEMO_MODE && (
                 <span className="hidden sm:inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-bold uppercase tracking-wide">
                   {t('nav.demo')}
                 </span>
               )}
               <button 
                onClick={() => navigate('/settings')}
                className="hidden sm:block text-slate-400 hover:text-slate-700 transition-colors px-2"
                title={t('nav.settings')}
              >
                <i className="fa-solid fa-gear text-lg"></i>
              </button>
              <button 
                onClick={handleSignOut}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold transition-colors bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-full"
              >
                {t('nav.signOut')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 sm:pb-8">
          {children}
        </div>
      </main>

      {/* Fixed Bottom Nav for Mobile */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-[#faeee7]/95 backdrop-blur-xl border-t border-slate-200/50 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)] flex justify-between items-end px-8 py-3 z-40" style={{ paddingBottom: 'env(safe-area-inset-bottom, 20px)' }}>
        
        <button 
          onClick={() => navigate('/dashboard')}
          className={`flex flex-col items-center justify-center w-16 transition-all duration-300 group ${isActive('/dashboard') ? '-translate-y-1' : ''}`}
        >
          <div className={`text-xl mb-1 transition-colors ${isActive('/dashboard') ? 'text-lime-600' : 'text-slate-300 group-hover:text-slate-500'}`}>
            <i className="fa-solid fa-house"></i>
          </div>
          <span className={`text-[10px] font-bold ${isActive('/dashboard') ? 'text-lime-600' : 'text-slate-300'}`}>{t('nav.dashboard')}</span>
        </button>
        
        <button 
          onClick={() => navigate('/new-batch')}
          className="flex flex-col items-center justify-end -mt-8 mb-1 group"
        >
          <div className="w-14 h-14 bg-lime-500 group-hover:bg-lime-400 text-white rounded-full flex items-center justify-center shadow-lg shadow-lime-500/30 transform transition-transform active:scale-95 border-4 border-[#faeee7]">
            <i className="fa-solid fa-plus text-xl"></i>
          </div>
          <span className="text-[10px] font-bold text-lime-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">{t('nav.newBatch')}</span>
        </button>

        <button 
           onClick={() => navigate('/settings')}
           className={`flex flex-col items-center justify-center w-16 transition-all duration-300 group ${isActive('/settings') ? '-translate-y-1' : ''}`}
        >
          <div className={`text-xl mb-1 transition-colors ${isActive('/settings') ? 'text-lime-600' : 'text-slate-300 group-hover:text-slate-500'}`}>
            <i className="fa-solid fa-gear"></i>
          </div>
           <span className={`text-[10px] font-bold ${isActive('/settings') ? 'text-lime-600' : 'text-slate-300'}`}>{t('nav.settings')}</span>
        </button>
      </div>
    </div>
  );
};

export default Layout;
