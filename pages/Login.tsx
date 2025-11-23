import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IS_DEMO_MODE } from '../constants';
import { sendLoginOtp, verifyLoginOtp } from '../services/fermentationService';
import { supabase } from '../services/supabaseClient';
import { MilkKefirMascot } from '../components/Illustrations';
import { useTheme } from '../contexts/ThemeContext';

const Login: React.FC = () => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTheme();

  // Listen for Magic Link redirects
  useEffect(() => {
    if (IS_DEMO_MODE || !supabase) return;

    // 1. Check if user is already logged in or session restored from URL
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard');
      }
    });

    // 2. Listen for auth state changes (e.g. magic link completed)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setError(null);
    
    try {
        const { error: sendError } = await sendLoginOtp(email);
        if (sendError) {
            setError(sendError);
        } else {
            setStep('otp');
            setOtp(''); // Clear previous OTP if any
        }
    } catch (err: any) {
        setError(err.message || t('login.errorSend'));
    } finally {
        setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    
    setLoading(true);
    setError(null);
    
    try {
        const { error: verifyError } = await verifyLoginOtp(email, otp);
        if (verifyError) {
            setError(verifyError);
        } else {
            navigate('/dashboard');
        }
    } catch (err: any) {
        setError(err.message || t('login.errorVerify'));
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faeee7] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-8">
            <div className="w-40 h-40 mx-auto bg-lime-100 rounded-full flex items-center justify-center mb-4 relative overflow-hidden ring-8 ring-lime-50">
                <MilkKefirMascot className="w-32 h-32 relative top-2" />
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
                <form onSubmit={handleSendCode} className="space-y-6 animate-fade-in">
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
                <form onSubmit={handleVerifyCode} className="space-y-6">
                    <div className="text-center mb-2">
                        <span className="inline-block bg-lime-50 text-lime-600 text-xs font-bold px-3 py-1 rounded-full mb-2">
                            {t('login.checkInbox')}
                        </span>
                        <p className="text-slate-500 font-medium text-sm">
                            {t('login.sentCodeTo')} <br/> <span className="text-slate-800 font-bold">{email}</span>
                        </p>
                    </div>

                    <div>
                        <input
                            type="text"
                            required
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-full text-slate-800 placeholder-slate-300 focus:bg-white focus:border-lime-400 focus:ring-4 focus:ring-lime-100 outline-none transition-all font-bold text-2xl text-center tracking-[0.5em]"
                            placeholder="······"
                            maxLength={6}
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-2xl font-medium">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-lime-500 hover:bg-lime-400 text-white font-bold text-lg py-4 rounded-full shadow-lg shadow-lime-500/30 transition-all transform hover:-translate-y-1 active:translate-y-0 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span><i className="fa-solid fa-spinner fa-spin mr-2"></i> {t('login.verifying')}</span>
                        ) : (
                            t('login.verifyButton')
                        )}
                    </button>

                    <div className="text-center mt-4">
                         <button 
                            type="button"
                            onClick={() => setStep('email')}
                            className="text-sm text-slate-400 hover:text-slate-600 font-bold underline decoration-2 underline-offset-4 decoration-slate-200 hover:decoration-slate-400 transition-all"
                         >
                            {t('login.wrongEmail')}
                         </button>
                    </div>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default Login;