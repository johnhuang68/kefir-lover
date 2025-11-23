import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card } from '../components/Card';
import { useTheme } from '../contexts/ThemeContext';
import { MilkKefirMascot } from '../components/Illustrations';

const Settings: React.FC = () => {
  const { 
    textSize, setTextSize, 
    notificationsEnabled, setNotificationsEnabled,
    language, setLanguage,
    t 
  } = useTheme();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="mb-8">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="text-slate-400 hover:text-slate-600 mb-4 text-sm flex items-center font-bold transition-colors"
        >
            <i className="fa-solid fa-arrow-left mr-2"></i> {t('settings.back')}
        </button>
        <h1 className="text-3xl font-bold text-slate-800">{t('settings.title')}</h1>
        <p className="text-slate-400 font-medium">{t('settings.subtitle')}</p>
      </div>

      <div className="space-y-6">
        
        {/* Language Section */}
        <Card title={t('settings.language.title')}>
           <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setLanguage('en')}
                className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${language === 'en' ? 'bg-lime-50 text-lime-600 ring-2 ring-lime-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              >
                <span className="text-xl mr-2">🇺🇸</span> {t('settings.language.english')}
              </button>
              <button
                onClick={() => setLanguage('th')}
                className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${language === 'th' ? 'bg-lime-50 text-lime-600 ring-2 ring-lime-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              >
                <span className="text-xl mr-2">🇹🇭</span> {t('settings.language.thai')}
              </button>
           </div>
        </Card>

        {/* Notifications Section */}
        <Card title={t('settings.notifications.title')}>
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-slate-700">{t('settings.notifications.label')}</h4>
                    <p className="text-slate-400 text-xs mt-1 font-medium">{t('settings.notifications.desc')}</p>
                </div>
                <button
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-lime-100 ${notificationsEnabled ? 'bg-lime-500' : 'bg-slate-200'}`}
                    aria-label="Toggle notifications"
                >
                    <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
            </div>
        </Card>

        {/* Appearance Section */}
        <Card title={t('settings.appearance.title')}>
          <div className="mb-4">
            <label className="block text-sm font-bold text-slate-500 mb-4">{t('settings.appearance.textSize')}</label>
            <div className="grid grid-cols-4 gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
              <button
                onClick={() => setTextSize('sm')}
                className={`py-3 rounded-xl font-bold text-xs transition-all ${textSize === 'sm' ? 'bg-white shadow-md text-lime-600 ring-2 ring-lime-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {t('settings.appearance.sm')}
              </button>
              <button
                onClick={() => setTextSize('md')}
                className={`py-3 rounded-xl font-bold text-sm transition-all ${textSize === 'md' ? 'bg-white shadow-md text-lime-600 ring-2 ring-lime-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {t('settings.appearance.md')}
              </button>
              <button
                onClick={() => setTextSize('lg')}
                className={`py-3 rounded-xl font-bold text-base transition-all ${textSize === 'lg' ? 'bg-white shadow-md text-lime-600 ring-2 ring-lime-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {t('settings.appearance.lg')}
              </button>
              <button
                onClick={() => setTextSize('xl')}
                className={`py-3 rounded-xl font-bold text-lg transition-all ${textSize === 'xl' ? 'bg-white shadow-md text-lime-600 ring-2 ring-lime-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {t('settings.appearance.xl')}
              </button>
            </div>
          </div>
          
          <div className="bg-lime-50 rounded-2xl p-4 flex items-center border border-lime-100 mt-6">
             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4 shadow-sm shrink-0">
                <MilkKefirMascot className="w-8 h-8" />
             </div>
             <div>
                <h4 className="font-bold text-lime-700 text-sm">{t('settings.appearance.previewTitle')}</h4>
                <p className="text-lime-600 text-xs mt-1">
                  {t('settings.appearance.previewDesc')}
                  <span className="block mt-1 font-bold opacity-75">{t('settings.appearance.targetTime')}: 24h</span>
                </p>
             </div>
          </div>
        </Card>

        <div className="text-center pt-8 pb-4">
          <p className="text-xs text-slate-300 font-bold uppercase tracking-widest">{t('settings.footer')}</p>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;