import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getCurrentUser, createFerment } from '../services/fermentationService';
import { KefirType } from '../types';
import { 
  DEFAULT_MILK_HOURS, 
  DEFAULT_WATER_HOURS,
  MILK_MIN_HOURS,
  MILK_MAX_HOURS,
  WATER_MIN_HOURS,
  WATER_MAX_HOURS 
} from '../constants';
import { MilkKefirMascot, WaterKefirMascot } from '../components/Illustrations';
import { useTheme } from '../contexts/ThemeContext';

const NewBatch: React.FC = () => {
  const [type, setType] = useState<KefirType>(KefirType.MILK_KEFIR);
  const [targetHours, setTargetHours] = useState<number>(DEFAULT_MILK_HOURS);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTheme();
  
  // Specific Fields
  const [milkType, setMilkType] = useState('');
  const [milkVolume, setMilkVolume] = useState<number | ''>('');
  const [sugarType, setSugarType] = useState('');
  const [sugarAmount, setSugarAmount] = useState<number | ''>('');
  const [waterVolume, setWaterVolume] = useState<number | ''>('');

  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  // Dynamic predicted time
  const [predictedTime, setPredictedTime] = useState(new Date());

  useEffect(() => {
    getCurrentUser().then(user => {
      if (!user) navigate('/login');
      else setUserId(user.id);
    });
  }, [navigate]);

  useEffect(() => {
    if (type === KefirType.MILK_KEFIR) setTargetHours(DEFAULT_MILK_HOURS);
    else if (type === KefirType.WATER_KEFIR) setTargetHours(DEFAULT_WATER_HOURS);
  }, [type]);

  useEffect(() => {
    const now = new Date();
    setPredictedTime(new Date(now.getTime() + targetHours * 60 * 60 * 1000));
  }, [targetHours]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);

    const details = {
      milk_type: type === KefirType.MILK_KEFIR ? milkType : undefined,
      milk_volume: type === KefirType.MILK_KEFIR && milkVolume !== '' ? Number(milkVolume) : undefined,
      sugar_type: type === KefirType.WATER_KEFIR ? sugarType : undefined,
      sugar_amount: type === KefirType.WATER_KEFIR && sugarAmount !== '' ? Number(sugarAmount) : undefined,
      water_volume: type === KefirType.WATER_KEFIR && waterVolume !== '' ? Number(waterVolume) : undefined,
    };

    await createFerment(userId, type, targetHours, notes, details);
    setLoading(false);
    navigate('/dashboard');
  };

  const isMilk = type === KefirType.MILK_KEFIR;
  const minTime = isMilk ? MILK_MIN_HOURS : WATER_MIN_HOURS;
  const maxTime = isMilk ? MILK_MAX_HOURS : WATER_MAX_HOURS;
  const step = isMilk ? 1 : 4; 

  return (
    <Layout>
      <div className="mb-6">
        <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-slate-600 mb-2 text-sm flex items-center font-bold">
            <i className="fa-solid fa-arrow-left mr-2"></i> {t('newBatch.back')}
        </button>
        <h1 className="text-2xl font-bold text-slate-800">{t('newBatch.title')}</h1>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-50 overflow-hidden p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">{t('newBatch.chooseFriend')}</label>
            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => setType(KefirType.MILK_KEFIR)}
                className={`cursor-pointer rounded-3xl p-6 flex flex-col items-center justify-center transition-all duration-300 transform ${type === KefirType.MILK_KEFIR ? 'bg-slate-100 ring-4 ring-slate-200 scale-105' : 'bg-white border-2 border-slate-50 hover:border-slate-100 hover:bg-slate-50/50'}`}
              >
                <div className="w-24 h-24 mb-3">
                    <MilkKefirMascot />
                </div>
                <span className={`font-bold text-lg ${type === KefirType.MILK_KEFIR ? 'text-slate-800' : 'text-slate-400'}`}>{t('newBatch.milkKefir')}</span>
              </div>

              <div 
                onClick={() => setType(KefirType.WATER_KEFIR)}
                className={`cursor-pointer rounded-3xl p-6 flex flex-col items-center justify-center transition-all duration-300 transform ${type === KefirType.WATER_KEFIR ? 'bg-sky-50 ring-4 ring-sky-100 scale-105' : 'bg-white border-2 border-slate-50 hover:border-sky-50 hover:bg-sky-50/50'}`}
              >
                <div className="w-24 h-24 mb-3">
                    <WaterKefirMascot />
                </div>
                <span className={`font-bold text-lg ${type === KefirType.WATER_KEFIR ? 'text-sky-700' : 'text-slate-400'}`}>{t('newBatch.waterKefir')}</span>
              </div>
            </div>
          </div>

          {/* Specific Inputs based on Type */}
          <div className="bg-[#fcfcfc] p-6 rounded-3xl border border-slate-100">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
              <i className="fa-solid fa-flask mr-2"></i> {t('newBatch.recipeDetails')}
            </h3>
            
            {type === KefirType.MILK_KEFIR && (
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">{t('newBatch.milkType')}</label>
                  <input 
                    type="text" 
                    value={milkType}
                    onChange={(e) => setMilkType(e.target.value)}
                    placeholder={t('newBatch.milkTypePlaceholder')}
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl p-3 text-sm text-slate-700 font-semibold focus:border-slate-300 focus:ring-0 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">{t('newBatch.milkVolume')}</label>
                  <input 
                    type="number" 
                    value={milkVolume}
                    onChange={(e) => setMilkVolume(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="500"
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl p-3 text-sm text-slate-700 font-semibold focus:border-slate-300 focus:ring-0 outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {type === KefirType.WATER_KEFIR && (
              <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-3">
                 <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">{t('newBatch.waterVolume')}</label>
                  <input 
                    type="number" 
                    value={waterVolume}
                    onChange={(e) => setWaterVolume(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="1000"
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl p-3 text-sm text-slate-700 font-semibold focus:border-sky-200 focus:ring-0 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">{t('newBatch.sugarType')}</label>
                  <input 
                    type="text" 
                    value={sugarType}
                    onChange={(e) => setSugarType(e.target.value)}
                    placeholder={t('newBatch.sugarTypePlaceholder')}
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl p-3 text-sm text-slate-700 font-semibold focus:border-sky-200 focus:ring-0 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">{t('newBatch.sugarAmount')}</label>
                  <input 
                    type="number" 
                    value={sugarAmount}
                    onChange={(e) => setSugarAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="50"
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl p-3 text-sm text-slate-700 font-semibold focus:border-sky-200 focus:ring-0 outline-none transition-colors"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Time Setting */}
          <div>
            <div className="flex justify-between items-end mb-4">
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest">{t('newBatch.fermentationTime')}</label>
                <div className="text-3xl font-bold text-lime-500">{targetHours}<span className="text-sm font-bold text-slate-300 ml-1">{t('newBatch.hrs')}</span></div>
            </div>
            
            <div className="px-2">
                <input 
                type="range" 
                min={minTime} 
                max={maxTime} 
                step={step} 
                value={targetHours} 
                onChange={(e) => setTargetHours(parseInt(e.target.value))}
                className="w-full h-4 bg-slate-100 rounded-full appearance-none cursor-pointer accent-lime-500 hover:accent-lime-400"
                />
            </div>
            
            <div className="flex justify-between text-xs font-bold text-slate-300 mt-3 px-1">
                <span>{minTime}h</span>
                <span>{maxTime}h</span>
            </div>

            {/* Predicted Finish Time Block */}
            <div className="mt-6 bg-lime-50 rounded-3xl p-5 flex items-center justify-between border border-lime-100 relative overflow-hidden">
                <div className="relative z-10">
                    <span className="text-xs font-bold text-lime-600 uppercase tracking-wider mb-1 block">{t('newBatch.readyOn')}</span>
                    <div className="text-xl font-bold text-slate-800">
                        {predictedTime.toLocaleString([], { 
                            weekday: 'short', hour: '2-digit', minute: '2-digit'
                        })}
                    </div>
                </div>
                <div className="bg-white p-3 rounded-full shadow-sm text-lime-500 relative z-10">
                    <i className="fa-regular fa-calendar-check text-xl"></i>
                </div>
                {/* Decorative circle */}
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-lime-100 rounded-full opacity-50 z-0"></div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">{t('newBatch.notes')}</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('newBatch.notesPlaceholder')}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-4 text-sm font-medium focus:bg-white focus:border-lime-300 focus:ring-4 focus:ring-lime-50 outline-none min-h-[100px] transition-all placeholder-slate-400"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-lime-500 hover:bg-lime-400 text-white font-bold text-lg py-4 rounded-full shadow-xl shadow-lime-500/20 transition-all transform hover:-translate-y-1 active:translate-y-0 active:scale-95 flex items-center justify-center"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <span>{t('newBatch.submitBtn')} <i className="fa-solid fa-play ml-2 text-sm"></i></span>}
          </button>

        </form>
      </div>
    </Layout>
  );
};

export default NewBatch;