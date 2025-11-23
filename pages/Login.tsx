import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IS_DEMO_MODE } from '../constants';
import { sendLoginOtp } from '../services/fermentationService';
import { supabase } from '../services/supabaseClient';
import { KefirGirlLogo } from '../components/Illustrations';
import { useTheme } from '../contexts/ThemeContext';

const Login: React.FC = () => {
  const [step, setStep] = useState<'email' | 'sent'>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifyingHash, setIsVerifyingHash] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTheme();

  // Detect Magic Link hash immediately on mount
  useEffect(() => {
    if (location.hash && location.hash.includes('access_token')) {
      setIsVerifyingHash(true);
    }
  }, [location]);

  // Listen for Magic Link redirects and auth state changes
  useEffect(() => {
    if (IS_DEMO_MODE || !supabase) return;

    // 1. Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard');
      }
    });

    // 2. Listen for auth state changes (e.g. magic link completed)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/dashboard');
      }
      // If sign-in failed (e.g. link expired)
      if (event === 'SIGNED_OUT') {
        setIsVerifyingHash(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setError(null);
    
    try {
        const { error: sendError } = await sendLoginOtp(email);
        if (sendError) {
            setError(sendError);
        } else {
            setStep('sent');
        }
    } catch (err: any) {
        setError(err.message || t('login.errorSend'));
    } finally {
        setLoading(false);
    }
  };

  const handleDemoSimulation = () => {
    // Mock login logic manually
    const fakeUser = { id: 'demo-user-123', email };
    localStorage.setItem('kefir_lover_mock_user', JSON.stringify(fakeUser));
    navigate('/dashboard');
  };

  if (isVerifyingHash) {
    return (
        <div className="min-h-screen bg-[#faeee7] flex items-center justify-center p-4">
            <div className="text-center">
                 <i className="fa-solid fa-circle-notch fa-spin text-4xl text-lime-500 mb-4"></i>
                 <h2 className="text-xl font-bold text-slate-700">{t('login.verifying')}</h2>
                 <p className="text-slate-400 text-sm mt-2">Authenticating your magic link...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faeee7] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-8">
            <div className="w-48 h-48 mx-auto mb-4 relative hover:scale-105 transition-transform duration-500 cursor-pointer">
                <KefirGirlLogo className="w-full h-full drop-shadow-2xl" />
            </div>
            <h1 className="text-4xl font-bold text-slate-800 tracking-tight mb-2">{t('login.title')}</h1>
            <p className="text-slate-400 font-medium">{t('login.subtitle')}</p>
        </div>
        
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-8 sm:p-10 border border-white relative overflow-hidden">
            
            {IS_DEMO_MODE && (
                <div className="mb-6 bg-amber-50 border border-amber-100 rounded-2xl p-4 text-amber-800 text-sm flex items-start">
                    <i className="fa-solid fa-cookie-bite mt-0.5 mr-2 text-amber-500"></i>
                    <div>
                        <strong>{t('login.demoMode')}</strong> 
                        {step === 'email' ? ` ${t('login.emailStep')}` : ` ${t('login.otpStep')}`}
                    </div>
                </div>
            )}

            {step === 'email' ? (
                <form onSubmit={handleSendLink} className="space-y-6 animate-fade-in">
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2 ml-2">{t('login.emailLabel')}</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-full text-slate-700 placeholder-slate-300 focus:bg-white focus:border-lime-400 focus:ring-4 focus:ring-lime-100 outline-none transition-all font-semibold text-lg"
                            placeholder={t('login.emailPlaceholder')}
                        />
                    </div>
                    
                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-2xl font-medium">
                            <i className="fa-solid fa-circle-exclamation mr-1"></i> {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-lime-500 hover:bg-lime-400 text-white font-bold text-lg py-4 rounded-full shadow-lg shadow-lime-500/30 transition-all transform hover:-translate-y-1 active:translate-y-0 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span><i className="fa-solid fa-spinner fa-spin mr-2"></i> {t('login.sending')}</span>
                        ) : (
                            t('login.sendButton')
                        )}
                    </button>
                    
                    <p className="text-center text-xs text-slate-400 font-medium mt-4">
                        {t('login.magicCodeNote')}
                    </p>
                </form>
            ) : (
                <div className="space-y-6 text-center animate-fade-in">
                    <div className="mb-4">
                        <div className="w-16 h-16 bg-lime-100 text-lime-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                             <i className="fa-solid fa-envelope text-2xl"></i>
                        </div>
                        <span className="inline-block bg-lime-50 text-lime-600 text-xs font-bold px-3 py-1 rounded-full mb-3">
                            {t('login.checkInbox')}
                        </span>
                        <p className="text-slate-500 font-medium text-sm">
                            {t('login.sentCodeTo')} <br/> <span className="text-slate-800 font-bold text-lg">{email}</span>
                        </p>
                        <p className="text-slate-400 text-xs mt-4 px-4 leading-relaxed">
                            {t('login.openEmail')}
                        </p>
                    </div>

                    {IS_DEMO_MODE && (
                        <button
                            onClick={handleDemoSimulation}
                            className="w-full bg-amber-400 hover:bg-amber-300 text-white font-bold text-lg py-3 rounded-full shadow-lg shadow-amber-400/30 transition-all"
                        >
                            <i className="fa-solid fa-wand-magic-sparkles mr-2"></i> {t('login.demoLink')}
                        </button>
                    )}

                    <div className="pt-2">
                         <button 
                            type="button"
                            onClick={() => setStep('email')}
                            className="text-sm text-slate-400 hover:text-slate-600 font-bold underline decoration-2 underline-offset-4 decoration-slate-200 hover:decoration-slate-400 transition-all"
                         >
                            {t('login.wrongEmail')}
                         </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Login;
