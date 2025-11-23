import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card } from '../components/Card';
import { getFermentById, finishFerment, archiveFerment, extendFerment } from '../services/fermentationService';
import { Ferment, FermentStatus, KefirType } from '../types';
import { MilkKefirMascot, WaterKefirMascot } from '../components/Illustrations';
import { useTheme } from '../contexts/ThemeContext';

const BatchDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ferment, setFerment] = useState<Ferment | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTheme();

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const data = await getFermentById(id);
      if (data) setFerment(data);
      setLoading(false);
    };
    load();
  }, [id]);

  const handleHarvest = async () => {
    if (!ferment) return;
    const confirm = window.confirm(t('batchDetails.confirmHarvest'));
    if (confirm) {
      await finishFerment(ferment.id);
      setFerment({
        ...ferment,
        status: FermentStatus.FINISHED,
        end_time: new Date().toISOString(),
      });
    }
  };

  const handleStop = async () => {
    if (!ferment) return;
    const confirm = window.confirm(t('batchDetails.confirmStop'));
    if (confirm) {
      await archiveFerment(ferment.id);
      setFerment({
        ...ferment,
        status: FermentStatus.ARCHIVED,
        end_time: new Date().toISOString(),
      });
    }
  };

  const handleContinue = async () => {
    if (!ferment) return;
    const hours = window.prompt(t('batchDetails.promptContinue'), "4");
    if (hours && !isNaN(Number(hours))) {
      const addedHours = Number(hours);
      await extendFerment(ferment.id, addedHours);
      setFerment({
        ...ferment,
        target_hours: ferment.target_hours + addedHours,
      });
    }
  };

  if (loading) return <Layout><div className="text-center pt-20 text-slate-400">{t('batchDetails.loading')}</div></Layout>;
  if (!ferment) return <Layout><div className="text-center pt-20 text-slate-400">{t('batchDetails.notFound')}</div></Layout>;

  const isActive = ferment.status === FermentStatus.FERMENTING;
  const isFinished = ferment.status === FermentStatus.FINISHED;
  const isArchived = ferment.status === FermentStatus.ARCHIVED;
  
  const startDate = new Date(ferment.start_time);
  const endDate = (!isActive && ferment.end_time) ? new Date(ferment.end_time) : new Date();
  const predictedFinishDate = new Date(startDate.getTime() + ferment.target_hours * 60 * 60 * 1000);
  
  const elapsedHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
  const diffFromTarget = elapsedHours - ferment.target_hours;
  
  // Status label logic
  let statusLabel = t('batchDetails.statusActive');
  let statusColor = 'bg-lime-100 text-lime-600';
  
  if (isFinished) {
    statusLabel = t('batchDetails.statusComplete');
    statusColor = 'bg-slate-100 text-slate-500';
  } else if (isArchived) {
    statusLabel = t('batchDetails.statusStopped');
    statusColor = 'bg-red-50 text-red-400';
  }

  const isMilk = ferment.type === KefirType.MILK_KEFIR;

  return (
    <Layout>
      <div className="mb-8">
        <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-slate-600 mb-4 text-sm flex items-center font-bold">
            <i className="fa-solid fa-arrow-left mr-2"></i> {t('batchDetails.backDashboard')}
        </button>
        <div className="flex items-center space-x-4">
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 p-2">
                {isMilk ? <MilkKefirMascot /> : <WaterKefirMascot />}
            </div>
            <div>
                <h1 className="text-2xl font-bold text-slate-800">{isMilk ? t('batchDetails.milkKefir') : t('batchDetails.waterKefir')}</h1>
                <p className="text-slate-400 text-sm font-medium">{isActive ? t('batchDetails.brewing') : t('batchDetails.archived')}</p>
            </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Status Card */}
        <Card className="bg-white border-none shadow-lg shadow-slate-200/50">
           <div className="flex flex-col items-center justify-center py-4">
                <div className={`text-xs font-bold uppercase tracking-widest mb-3 px-3 py-1 rounded-full ${statusColor}`}>
                    {statusLabel}
                </div>
                <div className="text-6xl font-bold text-slate-800 mb-2 font-sans tracking-tight">
                    {elapsedHours.toFixed(1)}<span className="text-2xl text-slate-300 ml-1">h</span>
                </div>
                <div className="text-slate-400 text-sm font-medium bg-slate-50 px-4 py-1 rounded-full">
                    {t('batchDetails.goal')}: {ferment.target_hours} {t('batchDetails.hours')}
                </div>
           </div>
           
           {isActive && (
               <div className="mt-6 pt-4 border-t border-slate-50 space-y-3">
                   {/* Main Action */}
                   <button 
                    onClick={handleHarvest}
                    className="w-full bg-lime-500 hover:bg-lime-400 text-white font-bold py-4 rounded-2xl shadow-xl shadow-lime-500/20 transition-all active:scale-95 flex items-center justify-center"
                   >
                       <i className="fa-solid fa-check mr-2"></i> {t('batchDetails.harvestBtn')}
                   </button>

                   {/* Secondary Actions */}
                   <div className="grid grid-cols-2 gap-3">
                     <button 
                      onClick={handleContinue}
                      className="bg-amber-100 hover:bg-amber-200 text-amber-700 font-bold py-3 rounded-2xl transition-all active:scale-95 flex items-center justify-center"
                     >
                         <i className="fa-solid fa-clock-rotate-left mr-2"></i> {t('batchDetails.continueBtn')}
                     </button>
                     <button 
                      onClick={handleStop}
                      className="bg-red-50 hover:bg-red-100 text-red-500 font-bold py-3 rounded-2xl transition-all active:scale-95 flex items-center justify-center"
                     >
                         <i className="fa-solid fa-ban mr-2"></i> {t('batchDetails.stopBtn')}
                     </button>
                   </div>
               </div>
           )}
        </Card>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title={t('batchDetails.recipeTitle')}>
                <div className="space-y-4">
                    {ferment.type === KefirType.MILK_KEFIR ? (
                         <>
                            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                                <span className="text-slate-400 text-sm font-bold">{t('batchDetails.milkType')}</span>
                                <span className="font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-lg">{ferment.milk_type || t('batchDetails.generic')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-sm font-bold">{t('batchDetails.volume')}</span>
                                <span className="font-bold text-slate-700">{ferment.milk_volume ? `${ferment.milk_volume} mL` : '-'}</span>
                            </div>
                         </>
                    ) : (
                        <>
                            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                                <span className="text-slate-400 text-sm font-bold">{t('batchDetails.sugarType')}</span>
                                <span className="font-bold text-slate-700 bg-sky-50 px-3 py-1 rounded-lg text-sky-700">{ferment.sugar_type || t('batchDetails.generic')}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                                <span className="text-slate-400 text-sm font-bold">{t('batchDetails.sugarAmount')}</span>
                                <span className="font-bold text-slate-700">{ferment.sugar_amount ? `${ferment.sugar_amount} g` : '-'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-sm font-bold">{t('batchDetails.waterVolume')}</span>
                                <span className="font-bold text-slate-700">{ferment.water_volume ? `${ferment.water_volume} mL` : '-'}</span>
                            </div>
                        </>
                    )}
                </div>
            </Card>

            <Card title={t('batchDetails.timeTitle')}>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm font-bold">{t('batchDetails.started')}</span>
                        <span className="font-bold text-slate-700">{startDate.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    
                    {isActive && (
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-sm font-bold">{t('batchDetails.readyBy')}</span>
                            <span className="font-bold text-lime-600">{predictedFinishDate.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    )}

                    {!isActive && (
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-sm font-bold">{isArchived ? t('batchDetails.statusStopped') : t('batchDetails.finished')}</span>
                            <span className="font-bold text-slate-700">{endDate.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    )}
                     <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                        <span className="text-slate-400 text-sm font-bold">{t('batchDetails.offset')}</span>
                        <span className={`font-bold text-sm px-2 py-0.5 rounded-md ${diffFromTarget > 2 || diffFromTarget < -2 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                            {diffFromTarget > 0 ? '+' : ''}{diffFromTarget.toFixed(1)}h
                        </span>
                    </div>
                </div>
            </Card>

            <Card title={t('batchDetails.notesTitle')} className="md:col-span-2">
                <div className="min-h-[60px] text-slate-600 text-sm leading-relaxed font-medium">
                    {ferment.notes ? ferment.notes : <span className="text-slate-300 italic">{t('batchDetails.noNotes')}</span>}
                </div>
            </Card>
        </div>
      </div>
    </Layout>
  );
};

export default BatchDetails;