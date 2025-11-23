import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card } from '../components/Card';
import { getFerments, getCurrentUser } from '../services/fermentationService';
import { Ferment, FermentStatus, KefirType } from '../types';
import { SleepingMascot, MilkKefirMascot, WaterKefirMascot } from '../components/Illustrations';
import { useTheme } from '../contexts/ThemeContext';

const Dashboard: React.FC = () => {
  const [ferments, setFerments] = useState<Ferment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTheme();

  useEffect(() => {
    const loadData = async () => {
      const user = await getCurrentUser();
      if (!user) {
        navigate('/login');
        return;
      }
      const data = await getFerments(user.id);
      setFerments(data);
      setLoading(false);
    };
    loadData();
  }, [navigate]);

  // Separation of active vs finished/archived
  const activeFerments = ferments.filter(f => f.status === FermentStatus.FERMENTING);
  const finishedFerments = ferments.filter(f => f.status === FermentStatus.FINISHED || f.status === FermentStatus.ARCHIVED);

  const getProgress = (start: string, targetHours: number) => {
    const startDate = new Date(start);
    const now = new Date();
    const elapsedHours = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    const percent = Math.min(100, Math.max(0, (elapsedHours / targetHours) * 100));
    return { percent, elapsedHours };
  };

  const getFormatTimeLeft = (start: string, targetHours: number) => {
    const startDate = new Date(start);
    const targetDate = new Date(startDate.getTime() + targetHours * 60 * 60 * 1000);
    const now = new Date();
    const diffMs = targetDate.getTime() - now.getTime();
    
    if (diffMs < 0) return { text: t('dashboard.harvestTime'), isOverdue: true };
    
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return { text: `${diffHrs}h ${diffMins}m ${t('dashboard.left')}`, isOverdue: false };
  };

  const getTypeVisuals = (type: KefirType) => {
    // We want translated labels for the list
    const isMilk = type === KefirType.MILK_KEFIR;
    return {
        label: isMilk ? t('newBatch.milkKefir') : t('newBatch.waterKefir')
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#faeee7]">
        <i className="fa-solid fa-face-smile fa-spin text-4xl text-lime-400"></i>
        <span className="ml-2 text-lime-600 font-bold">{t('dashboard.loading')}</span>
      </div>
    );
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{t('dashboard.title')}</h1>
          <p className="text-slate-400 font-medium">{t('dashboard.subtitle')}</p>
        </div>
        <button 
          onClick={() => navigate('/new-batch')}
          className="bg-lime-500 text-white px-5 py-3 rounded-full text-sm font-bold hover:bg-lime-400 transition-all shadow-lg shadow-lime-500/20 transform hover:-translate-y-1 active:scale-95 hidden sm:inline-flex items-center"
        >
          <i className="fa-solid fa-plus mr-2"></i> {t('dashboard.newBatchBtn')}
        </button>
      </div>

      {/* Active Section */}
      <div className="mb-10">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center ml-2">
            <span className="w-2 h-2 rounded-full bg-lime-400 mr-2"></span> {t('dashboard.activeFerments')}
        </h2>
        
        {activeFerments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
            <div className="w-32 h-32 mb-4">
               <SleepingMascot />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">{t('dashboard.emptyTitle')}</h3>
            <p className="text-slate-400 mb-6 max-w-xs">{t('dashboard.emptyDesc')}</p>
            <button onClick={() => navigate('/new-batch')} className="text-lime-600 font-bold bg-lime-50 px-6 py-2 rounded-full hover:bg-lime-100 transition-colors">{t('dashboard.startBrewing')}</button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {activeFerments.map(ferment => {
              const { percent, elapsedHours } = getProgress(ferment.start_time, ferment.target_hours);
              const { text, isOverdue } = getFormatTimeLeft(ferment.start_time, ferment.target_hours);
              const visuals = getTypeVisuals(ferment.type);
              const startTime = new Date(ferment.start_time);
              const predictedFinish = new Date(startTime.getTime() + ferment.target_hours * 60 * 60 * 1000);
              
              const typeColorBg = ferment.type === KefirType.MILK_KEFIR ? 'bg-slate-50' : 'bg-sky-50';
              const typeColorText = ferment.type === KefirType.MILK_KEFIR ? 'text-slate-600' : 'text-sky-600';
              const isMilk = ferment.type === KefirType.MILK_KEFIR;
              const MascotIcon = isMilk ? MilkKefirMascot : WaterKefirMascot;

              return (
                <Card key={ferment.id} onClick={() => navigate(`/batch/${ferment.id}`)} className="border-0">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${typeColorBg} ${typeColorText}`}>
                        <MascotIcon className="w-5 h-5" />
                        <span>{visuals.label}</span>
                    </div>
                    {isOverdue ? (
                         <span className="text-xs font-bold text-white bg-red-400 px-3 py-1.5 rounded-full animate-bounce shadow-md shadow-red-200">
                           <i className="fa-solid fa-bell mr-1"></i> {t('dashboard.ready')}
                         </span>
                    ) : (
                        <div className="flex items-center space-x-1.5 bg-lime-50 px-3 py-1 rounded-full border border-lime-100">
                            <div className="w-2 h-2 rounded-full bg-lime-500 animate-pulse-fast shadow-[0_0_8px_rgba(132,204,22,0.6)]"></div>
                            <span className="text-xs font-bold text-lime-600 animate-pulse-fast">
                               {t('dashboard.inProgress')}
                            </span>
                        </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="font-bold text-slate-600">{elapsedHours.toFixed(1)}h {t('dashboard.done')}</span>
                        <span className={`font-bold ${isOverdue ? 'text-lime-600' : 'text-slate-400'}`}>{text}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden shadow-inner mb-4">
                        <div 
                            className={`h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${isOverdue ? 'bg-lime-400' : 'bg-lime-400'}`} 
                            style={{ width: `${percent}%` }}
                        >
                             <div className="w-full h-full absolute top-0 left-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.4)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.4)_50%,rgba(255,255,255,0.4)_75%,transparent_75%,transparent)] bg-[length:40px_40px] opacity-30 animate-shimmer"></div>
                        </div>
                    </div>
                    
                    {/* Time Details */}
                    <div className="flex justify-between items-center bg-white/50 p-3 rounded-2xl border border-slate-100">
                        <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">{t('dashboard.start')}</span>
                            <span className="text-xs font-bold text-slate-700">
                                {startTime.toLocaleString(undefined, { 
                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false 
                                })}
                            </span>
                        </div>
                        <div className="text-slate-300">
                           <i className="fa-solid fa-arrow-right text-xs"></i>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">{t('dashboard.finish')}</span>
                            <span className="text-xs font-bold text-slate-700">
                                {predictedFinish.toLocaleString(undefined, { 
                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false 
                                })}
                            </span>
                        </div>
                    </div>

                  </div>
                  
                  {ferment.notes && (
                      <p className="text-xs text-slate-400 truncate bg-slate-50/50 p-2 rounded-lg italic mt-3">"{ferment.notes}"</p>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* History Section */}
      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center ml-2">
            <span className="w-2 h-2 rounded-full bg-slate-300 mr-2"></span> {t('dashboard.pastBrews')}
        </h2>
        <div className="space-y-4">
            {finishedFerments.length === 0 ? (
                 <p className="text-slate-300 text-sm italic text-center py-4">{t('dashboard.noPastBrews')}</p>
            ) : (
                finishedFerments.map(ferment => {
                    const visuals = getTypeVisuals(ferment.type);
                    const isArchived = ferment.status === FermentStatus.ARCHIVED;
                    
                    const duration = ferment.end_time 
                        ? ((new Date(ferment.end_time).getTime() - new Date(ferment.start_time).getTime()) / (1000 * 60 * 60)).toFixed(1)
                        : '-';
                    
                    // Style adjustments for archived items
                    const iconBg = isArchived 
                      ? 'bg-slate-100 text-slate-400' 
                      : (ferment.type === KefirType.MILK_KEFIR ? 'bg-orange-50 text-orange-400' : 'bg-blue-50 text-blue-400');
                    
                    const MascotIcon = ferment.type === KefirType.MILK_KEFIR ? MilkKefirMascot : WaterKefirMascot;
                    
                    return (
                        <div key={ferment.id} onClick={() => navigate(`/batch/${ferment.id}`)} className={`bg-white rounded-2xl p-4 flex items-center shadow-sm border border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${isArchived ? 'opacity-75 grayscale-[0.5]' : ''}`}>
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 mr-4 ${iconBg} p-2`}>
                                <MascotIcon className="w-full h-full" />
                            </div>
                            <div className="flex-grow">
                                <h4 className={`font-bold text-sm ${isArchived ? 'text-slate-500 line-through' : 'text-slate-700'}`}>
                                  {visuals.label}
                                  {isArchived && <span className="no-underline ml-2 text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full uppercase">{t('dashboard.stopped')}</span>}
                                </h4>
                                <p className="text-xs text-slate-400 font-medium">{new Date(ferment.start_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                            </div>
                            <div className="text-right px-4">
                                <div className="text-sm font-bold text-slate-600">{duration}h</div>
                                <div className="text-[10px] text-slate-300 font-bold uppercase">{t('dashboard.total')}</div>
                            </div>
                            <div className="text-slate-300 pl-2">
                                <i className="fa-solid fa-chevron-right"></i>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;