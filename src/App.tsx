import React, { useState, useEffect } from 'react';
import { FinancialRecord } from './types';
import { supabase, INITIAL_EXCEL_SEED } from './lib/supabase';
import { Header } from './components/Header';
import { NetWorthHero } from './components/NetWorthHero';
import { MetricsCards } from './components/MetricsCards';
import { MonthSelector } from './components/MonthSelector';
import { MonthlyForm } from './components/MonthlyForm';
import { WealthChart } from './components/WealthChart';
import { HistoryTable } from './components/HistoryTable';
import { MobileNav, NavTab } from './components/MobileNav';
import { PhoneModal } from './components/PhoneModal';
import { Sparkles, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const [records, setRecords] = useState<FinancialRecord[]>(INITIAL_EXCEL_SEED);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2026-07');
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch initial records from Supabase and subscribe to live changes
  useEffect(() => {
    let channel: any = null;

    const initData = async () => {
      try {
        const { data, error } = await supabase
          .from('financial_records')
          .select('*')
          .order('period', { ascending: true });

        if (error) {
          console.warn('Supabase fetch notice (table may need schema execution):', error.message);
          setIsCloudSynced(false);
          // Fallback to local storage if available
          const localSaved = localStorage.getItem('family_finance_records');
          if (localSaved) {
            try {
              setRecords(JSON.parse(localSaved));
            } catch (e) {
              setRecords(INITIAL_EXCEL_SEED);
            }
          }
        } else if (data && data.length > 0) {
          setRecords(data);
          setIsCloudSynced(true);
          localStorage.setItem('family_finance_records', JSON.stringify(data));
        } else {
          // Table exists but is empty -> we can auto-seed from INITIAL_EXCEL_SEED!
          console.log('Supabase table is empty, auto-seeding with historical Excel data...');
          const { error: seedErr } = await supabase.from('financial_records').upsert(INITIAL_EXCEL_SEED);
          if (!seedErr) {
            setIsCloudSynced(true);
            setRecords(INITIAL_EXCEL_SEED);
          }
        }
      } catch (err: any) {
        console.error('Network/Supabase error:', err);
        setIsCloudSynced(false);
      }

      // Realtime subscription for multi-device sync
      try {
        channel = supabase
          .channel('public:financial_records')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'financial_records' },
            (payload: any) => {
              if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                const updated = payload.new as FinancialRecord;
                setRecords(prev => {
                  const exists = prev.some(r => r.period === updated.period);
                  const next = exists
                    ? prev.map(r => (r.period === updated.period ? updated : r))
                    : [...prev, updated].sort((a, b) => a.period.localeCompare(b.period));
                  localStorage.setItem('family_finance_records', JSON.stringify(next));
                  return next;
                });
                showToast(`עודכן נתון עבור ${payload.new.label || payload.new.period} ממכשיר אחר!`, 'info');
              }
            }
          )
          .subscribe();
      } catch (subErr) {
        console.warn('Realtime subscription error:', subErr);
      }
    };

    initData();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  // Save record (Optimistic local update + Supabase sync)
  const handleSaveRecord = async (updatedRecord: FinancialRecord) => {
    setIsSaving(true);
    try {
      // 1. Optimistic local update
      setRecords(prev => {
        const next = prev.map(r => (r.period === updatedRecord.period ? updatedRecord : r));
        localStorage.setItem('family_finance_records', JSON.stringify(next));
        return next;
      });

      // 2. Cloud Supabase upsert
      const { error } = await supabase
        .from('financial_records')
        .upsert(updatedRecord, { onConflict: 'period' });

      if (error) {
        console.warn('Cloud sync error:', error.message);
        showToast('נשמר מקומית במכשיר (סנכרון לענן יתבצע עם חיבור מסד הנתונים)', 'info');
      } else {
        setIsCloudSynced(true);
        showToast('נשמר וסונכרן בהצלחה לענן! 🚀', 'success');
      }
    } catch (err: any) {
      console.error('Save failed:', err);
      showToast('נשמר מקומית בדפדפן', 'info');
    } finally {
      setIsSaving(false);
    }
  };

  // Find current and previous records for Hero and Forms
  const currentRecord =
    records.find(r => r.period === selectedPeriod) ||
    records[records.length - 1] ||
    INITIAL_EXCEL_SEED[0];

  // Sorted periods to find previous month
  const sortedRecords = [...records].sort((a, b) => a.period.localeCompare(b.period));
  const currentIndex = sortedRecords.findIndex(r => r.period === currentRecord.period);
  const previousRecord = currentIndex > 0 ? sortedRecords[currentIndex - 1] : undefined;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-24 md:pb-12 font-sans selection:bg-blue-600 selection:text-white" dir="rtl">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-xl text-xs font-semibold backdrop-blur-xl border ${
            toast.type === 'success'
              ? 'bg-emerald-50/95 text-emerald-800 border-emerald-200 shadow-emerald-500/10'
              : toast.type === 'error'
              ? 'bg-rose-50/95 text-rose-800 border-rose-200 shadow-rose-500/10'
              : 'bg-blue-50/95 text-blue-800 border-blue-200 shadow-blue-500/10'
          }`}>
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            {toast.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-600" />}
            {toast.type === 'info' && <Sparkles className="w-4 h-4 text-blue-600" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <Header
        isCloudSynced={isCloudSynced}
        onOpenPhoneModal={() => setIsPhoneModalOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Top Net Worth Hero Card */}
        <NetWorthHero
          currentRecord={currentRecord}
          previousRecord={previousRecord}
        />

        {/* 2026 Month Carousel Pills */}
        <MonthSelector
          records={records}
          selectedPeriod={selectedPeriod}
          onSelectPeriod={p => {
            setSelectedPeriod(p);
            // On mobile, if in overview, stay in overview or switch to edit if needed
          }}
        />

        {/* Desktop View: Grid Layout */}
        <div className="hidden md:grid md:grid-cols-12 gap-6">
          {/* Left / Secondary Column (5 cols): Monthly Input Form */}
          <div className="md:col-span-5 space-y-6">
            <MonthlyForm
              record={currentRecord}
              onSave={handleSaveRecord}
              isSaving={isSaving}
            />
          </div>

          {/* Right / Primary Column (7 cols): Metrics Cards + Growth Chart */}
          <div className="md:col-span-7 space-y-6">
            <MetricsCards record={currentRecord} />
            <WealthChart records={records} />
          </div>
        </div>

        {/* Desktop View: Full History Table */}
        <div className="hidden md:block">
          <HistoryTable
            records={records}
            selectedPeriod={selectedPeriod}
            onSelectPeriod={p => {
              setSelectedPeriod(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>

        {/* Mobile View: Controlled by Bottom MobileNav */}
        <div className="md:hidden space-y-6">
          {activeTab === 'overview' && (
            <>
              <MetricsCards record={currentRecord} />
              <div className="pt-2">
                <WealthChart records={records} />
              </div>
            </>
          )}

          {activeTab === 'form' && (
            <MonthlyForm
              record={currentRecord}
              onSave={handleSaveRecord}
              isSaving={isSaving}
            />
          )}

          {activeTab === 'analytics' && (
            <WealthChart records={records} />
          )}

          {activeTab === 'history' && (
            <HistoryTable
              records={records}
              selectedPeriod={selectedPeriod}
              onSelectPeriod={p => {
                setSelectedPeriod(p);
                setActiveTab('form');
              }}
            />
          )}
        </div>

      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        onChangeTab={tab => setActiveTab(tab)}
      />

      {/* Phone QR Code & Home Screen Modal */}
      <PhoneModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
      />

    </div>
  );
};
