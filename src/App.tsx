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
import { IncomeGrantsView } from './components/IncomeGrantsView';
import { MobileNav, NavTab } from './components/MobileNav';
import { PhoneModal } from './components/PhoneModal';
import { AppleCardHero } from './components/AppleCardHero';
import { WealthInsightsCarousel } from './components/WealthInsightsCarousel';
import { AssetSparklinesCard } from './components/AssetSparklinesCard';
import { CashflowDonutCard } from './components/CashflowDonutCard';
import { LiquidityRunwayCard } from './components/LiquidityRunwayCard';
import { FireMilestoneCard } from './components/FireMilestoneCard';
import { FireCalculatorModal } from './components/FireCalculatorModal';
import { CostBasisModal } from './components/CostBasisModal';
import { exportFinancialRecordsToExcel } from './lib/exportExcel';
import { Holding, PortfolioCash, PortfolioTransaction } from './types/portfolio';
import {
  INITIAL_HOLDINGS_SEED,
  INITIAL_PORTFOLIO_CASH,
  fetchUsdToIlsRate,
} from './lib/stockPricesService';
import { HoldingsPortfolioView } from './components/HoldingsPortfolioView';
import { SellHoldingModal } from './components/SellHoldingModal';
import { AddEditHoldingModal } from './components/AddEditHoldingModal';
import { TopHoldingsCard } from './components/TopHoldingsCard';
import { TrustVerificationBanner } from './components/TrustVerificationBanner';
import { QuickAssetEditModal, AssetEditType } from './components/QuickAssetEditModal';
import { MonthPickerModal } from './components/MonthPickerModal';
import { Sparkles, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

const normalizeRecord = (r: any): FinancialRecord => {
  let rf = r.raw_formulas || {};
  if (typeof rf === 'string') {
    try {
      rf = JSON.parse(rf);
    } catch {
      rf = {};
    }
  }
  return {
    ...r,
    raw_formulas: rf,
    salary_daniel: r.salary_daniel ?? rf.salary_daniel,
    non_work_daniel: r.non_work_daniel ?? rf.non_work_daniel,
    salary_shoval: r.salary_shoval ?? rf.salary_shoval,
    non_work_shoval: r.non_work_shoval ?? rf.non_work_shoval,
    other_income: r.other_income ?? rf.other_income,
    checking_onezero: r.checking_onezero ?? rf.checking_onezero ?? (r.period === '2026-09' ? 59418 : (r.period === '2026-08' ? 42370 : undefined)),
    checking_pepper: r.checking_pepper ?? rf.checking_pepper ?? (r.period === '2026-09' ? 7662 : (r.period === '2026-08' ? 7667 : undefined)),
    checking_otsar: r.checking_otsar ?? rf.checking_otsar ?? (r.period === '2026-09' ? -10870 : (r.period === '2026-08' ? -8091 : undefined)),
    paybox: r.paybox ?? rf.paybox ?? (r.period === '2026-09' ? 781 : undefined),
    bit: r.bit ?? rf.bit ?? (r.period === '2026-09' ? 600 : undefined),
    excellence_cost_basis: r.excellence_cost_basis ?? rf.excellence_cost_basis,
  };
};

const sanitizeForSupabase = (rec: FinancialRecord) => {
  const validCols = [
    'period', 'year', 'month', 'label', 'income_net', 'expenses', 'savings',
    'savings_rate', 'checking', 'altshuler', 'excellence', 'money_market',
    'investments_total', 'total_wealth', 'wealth_change_pct', 'notes', 'raw_formulas', 'updated_at'
  ];
  const rawFormulas = { ...(rec.raw_formulas || {}) };
  if (rec.checking_onezero !== undefined) rawFormulas.checking_onezero = rec.checking_onezero;
  if (rec.checking_pepper !== undefined) rawFormulas.checking_pepper = rec.checking_pepper;
  if (rec.checking_otsar !== undefined) rawFormulas.checking_otsar = rec.checking_otsar;
  if (rec.paybox !== undefined) rawFormulas.paybox = rec.paybox;
  if (rec.bit !== undefined) rawFormulas.bit = rec.bit;
  if (rec.salary_daniel !== undefined) rawFormulas.salary_daniel = rec.salary_daniel;
  if (rec.salary_shoval !== undefined) rawFormulas.salary_shoval = rec.salary_shoval;
  if (rec.non_work_daniel !== undefined) rawFormulas.non_work_daniel = rec.non_work_daniel;
  if (rec.non_work_shoval !== undefined) rawFormulas.non_work_shoval = rec.non_work_shoval;
  if (rec.other_income !== undefined) rawFormulas.other_income = rec.other_income;
  if (rec.excellence_cost_basis !== undefined) rawFormulas.excellence_cost_basis = rec.excellence_cost_basis;

  const sanitized: any = {};
  for (const col of validCols) {
    if ((rec as any)[col] !== undefined) {
      sanitized[col] = (rec as any)[col];
    }
  }
  sanitized.raw_formulas = rawFormulas;
  return sanitized;
};

export const App: React.FC = () => {
  const [records, setRecords] = useState<FinancialRecord[]>(() => INITIAL_EXCEL_SEED.map(normalizeRecord));
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2026-09');
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState<boolean>(false);
  const [isFireModalOpen, setIsFireModalOpen] = useState<boolean>(false);
  const [isCostBasisModalOpen, setIsCostBasisModalOpen] = useState<boolean>(false);
  const [quickAssetModalType, setQuickAssetModalType] = useState<AssetEditType | null>(null);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState<boolean>(false);
  const [overviewSection, setOverviewSection] = useState<'summary' | 'cashflow' | 'goals' | 'all'>('summary');
  const [historySection, setHistorySection] = useState<'balance' | 'income'>('balance');

  // Portfolio Holdings & Cash State
  const [holdings, setHoldings] = useState<Holding[]>(() => {
    const saved = localStorage.getItem('family_finance_holdings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Automatically upgrade any old mock cache (less than 10 items or holding-cspx) to the real 27 holdings
        if (Array.isArray(parsed) && parsed.length >= 10 && !parsed.some((h: any) => h.id === 'holding-cspx')) {
          return parsed.map((h: any) => {
            const seed = INITIAL_HOLDINGS_SEED.find((s: any) => s.id === h.id || s.symbol === h.symbol);
            return {
              ...h,
              day_change_pct: typeof h.day_change_pct === 'number' && h.day_change_pct !== 0 ? h.day_change_pct : (seed?.day_change_pct ?? 0),
              week_change_pct: typeof h.week_change_pct === 'number' && h.week_change_pct !== 0 ? h.week_change_pct : (seed?.week_change_pct ?? 0),
            };
          });
        }
      } catch (e) {}
    }
    return INITIAL_HOLDINGS_SEED;
  });

  const [portfolioCash, setPortfolioCash] = useState<PortfolioCash>(() => {
    const saved = localStorage.getItem('family_finance_portfolio_cash');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.ils === 'number' && parsed.ils > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_PORTFOLIO_CASH;
  });

  const [transactions, setTransactions] = useState<PortfolioTransaction[]>(() => {
    const saved = localStorage.getItem('family_finance_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  const [selectedHoldingForSale, setSelectedHoldingForSale] = useState<Holding | null>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState<boolean>(false);
  const [holdingToEdit, setHoldingToEdit] = useState<Holding | null>(null);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState<boolean>(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSaveCostBasis = async (newBasis: number, applyToAll: boolean) => {
    setIsSaving(true);
    try {
      const updatedList = records.map(r => {
        if (r.period === selectedPeriod || (applyToAll && r.period >= selectedPeriod)) {
          return { ...r, excellence_cost_basis: newBasis, updated_at: new Date().toISOString() };
        }
        return r;
      });

      setRecords(updatedList);
      localStorage.setItem('family_finance_records', JSON.stringify(updatedList));

      if (applyToAll) {
        const recordsToUpdate = updatedList.filter(r => r.period >= selectedPeriod).map(sanitizeForSupabase);
        const { error } = await supabase.from('financial_records').upsert(recordsToUpdate, { onConflict: 'period' });
        if (error) console.warn('Supabase batch upsert notice:', error.message);
      } else {
        const single = updatedList.find(r => r.period === selectedPeriod);
        if (single) {
          const { error } = await supabase.from('financial_records').upsert(sanitizeForSupabase(single), { onConflict: 'period' });
          if (error) console.warn('Supabase single upsert notice:', error.message);
        }
      }

      showToast('קרן ההשקעה ושווי הנטו לאחר מס עודכנו בהצלחה! 💰', 'success');
    } catch (err: any) {
      console.error('Error saving cost basis:', err);
      showToast('הקרן נשמרה בהצלחה במכשיר', 'info');
    } finally {
      setIsSaving(false);
    }
  };

  // Stock Portfolio Handlers
  const handleSaveHolding = async (holding: Holding) => {
    setHoldings(prev => {
      const exists = prev.some(h => h.id === holding.id);
      const next = exists ? prev.map(h => (h.id === holding.id ? holding : h)) : [holding, ...prev];
      localStorage.setItem('family_finance_holdings', JSON.stringify(next));
      return next;
    });
    try {
      await supabase.from('portfolio_holdings').upsert(holding);
    } catch (e) {
      console.warn('Notice: portfolio_holdings cloud upsert skipped', e);
    }
    showToast(`נייר ${holding.symbol} נשמר בהצלחה בתיק! 📈`, 'success');
  };

  const handleDeleteHolding = async (id: string) => {
    setHoldings(prev => {
      const next = prev.filter(h => h.id !== id);
      localStorage.setItem('family_finance_holdings', JSON.stringify(next));
      return next;
    });
    try {
      await supabase.from('portfolio_holdings').delete().eq('id', id);
    } catch (e) {
      console.warn('Notice: portfolio_holdings cloud delete skipped', e);
    }
    showToast('הנייר הוסר מהתיק', 'info');
  };

  const handleUpdateCash = (newCash: PortfolioCash) => {
    setPortfolioCash(newCash);
    localStorage.setItem('family_finance_portfolio_cash', JSON.stringify(newCash));
    showToast('יתרות המזומן עודכנו בהצלחה! 💵', 'success');
  };

  const handleRefreshQuotes = async () => {
    const rate = await fetchUsdToIlsRate();
    setPortfolioCash(prev => {
      const next = { ...prev, usd_rate: rate };
      localStorage.setItem('family_finance_portfolio_cash', JSON.stringify(next));
      return next;
    });
    setHoldings(prev => {
      const next = prev.map(h => (h.currency === 'USD' ? { ...h, exchange_rate_to_ils: rate } : h));
      localStorage.setItem('family_finance_holdings', JSON.stringify(next));
      return next;
    });
    showToast(`שערי המטבע עודכנו בהצלחה: $1 = ₪${rate} 🔄`, 'success');
  };

  const handleConfirmSale = async (tx: PortfolioTransaction, updatedHolding: Holding | null) => {
    // 1. Update holdings list
    setHoldings(prev => {
      const next = updatedHolding
        ? prev.map(h => (h.id === updatedHolding.id ? updatedHolding : h))
        : prev.filter(h => h.id !== tx.holding_id);
      localStorage.setItem('family_finance_holdings', JSON.stringify(next));
      return next;
    });

    // 2. Add transaction to history
    setTransactions(prev => {
      const next = [tx, ...prev];
      localStorage.setItem('family_finance_transactions', JSON.stringify(next));
      return next;
    });

    // 3. If transferred to checking: update financial_records
    if (tx.transferred_to_checking) {
      const targetP = tx.target_period || selectedPeriod;
      const targetRec = records.find(r => r.period === targetP) || currentRecord;
      const newChecking = (targetRec.checking || 0) + tx.net_proceeds_ils;
      const newTotalWealth = newChecking + (targetRec.investments_total || 0);

      const updatedRec: FinancialRecord = {
        ...targetRec,
        checking: newChecking,
        total_wealth: newTotalWealth,
        updated_at: new Date().toISOString(),
      };

      await handleSaveRecord(updatedRec);
      showToast(`נמכרו ${tx.shares_sold} יח׳ של ${tx.symbol}! ₪${tx.net_proceeds_ils.toLocaleString()} הועברו ישירות לעו״ש בחודש ${targetRec.label}! 💰`, 'success');
    } else {
      showToast(`מכירת ${tx.symbol} נרשמה בהצלחה!`, 'success');
    }
  };

  const handleSyncExcellenceToMonth = async (totalVal: number) => {
    const rounded = Math.round(totalVal);
    const newInvestments = (currentRecord.altshuler || 0) + rounded + (currentRecord.money_market || 0);
    const newTotal = (currentRecord.checking || 0) + newInvestments;

    const updated: FinancialRecord = {
      ...currentRecord,
      excellence: rounded,
      investments_total: newInvestments,
      total_wealth: newTotal,
      updated_at: new Date().toISOString(),
    };

    await handleSaveRecord(updated);
    showToast(`שווי אקסלנס ב-${currentRecord.label} עודכן בהצלחה ל-₪${rounded.toLocaleString()}! 🚀`, 'success');
  };

  // Fetch initial records from Supabase and subscribe to live changes
  useEffect(() => {
    let channel: any = null;
    let portfolioChannel: any = null;

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
              setRecords(JSON.parse(localSaved).map(normalizeRecord));
            } catch (e) {
              setRecords(INITIAL_EXCEL_SEED.map(normalizeRecord));
            }
          }
        } else if (data && data.length > 0) {
          const normalized = data.map(normalizeRecord);
          setRecords(normalized);
          setIsCloudSynced(true);
          localStorage.setItem('family_finance_records', JSON.stringify(normalized));
        } else {
          // Table exists but is empty -> we can auto-seed from INITIAL_EXCEL_SEED!
          console.log('Supabase table is empty, auto-seeding with historical Excel data...');
          const { error: seedErr } = await supabase.from('financial_records').upsert(INITIAL_EXCEL_SEED.map(sanitizeForSupabase));
          if (!seedErr) {
            setIsCloudSynced(true);
            setRecords(INITIAL_EXCEL_SEED.map(normalizeRecord));
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
                const updated = normalizeRecord(payload.new);
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

      // Fetch portfolio holdings from Supabase if table exists
      try {
        const { data: pData, error: pErr } = await supabase
          .from('portfolio_holdings')
          .select('*');
        if (!pErr && pData && pData.length > 0) {
          setHoldings(pData);
          localStorage.setItem('family_finance_holdings', JSON.stringify(pData));
        } else if (!pErr && pData && pData.length === 0) {
          await supabase.from('portfolio_holdings').upsert(INITIAL_HOLDINGS_SEED);
        }
      } catch (pEx) {
        console.warn('Notice: portfolio_holdings table not in Supabase yet:', pEx);
      }

      // Realtime subscription for portfolio holdings across devices
      try {
        portfolioChannel = supabase
          .channel('public:portfolio_holdings')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'portfolio_holdings' },
            (payload: any) => {
              if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                const updated = payload.new as Holding;
                setHoldings(prev => {
                  const exists = prev.some(h => h.id === updated.id);
                  const next = exists
                    ? prev.map(h => (h.id === updated.id ? updated : h))
                    : [updated, ...prev];
                  localStorage.setItem('family_finance_holdings', JSON.stringify(next));
                  return next;
                });
              } else if (payload.eventType === 'DELETE') {
                const delId = payload.old?.id;
                if (delId) {
                  setHoldings(prev => {
                    const next = prev.filter(h => h.id !== delId);
                    localStorage.setItem('family_finance_holdings', JSON.stringify(next));
                    return next;
                  });
                }
              }
            }
          )
          .subscribe();
      } catch (pSubErr) {
        console.warn('Realtime portfolio subscription notice:', pSubErr);
      }
    };

    initData();

    return () => {
      if (channel) supabase.removeChannel(channel);
      if (portfolioChannel) supabase.removeChannel(portfolioChannel);
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
      const sanitized = sanitizeForSupabase(updatedRecord);
      const { error } = await supabase
        .from('financial_records')
        .upsert(sanitized, { onConflict: 'period' });

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
        activeTab={activeTab}
        onSelectTab={tab => setActiveTab(tab)}
        currentPeriodLabel={currentRecord.label}
        onOpenMonthPicker={() => setIsMonthPickerOpen(true)}
        onExportExcel={() => {
          exportFinancialRecordsToExcel(records);
          showToast('הקובץ יוצא בהצלחה! 📊', 'success');
        }}
      />

      {/* Main Container - Pure Mobile App Architecture */}
      <main className="mx-auto max-w-xl px-4 py-3 pb-32 transition-all">
        
        <div className="space-y-4">
          {activeTab === 'overview' && (
            <>
              {/* Luxury Segmented View Filter - Eliminates Vertical Scroll Overload */}
              <div className="sticky top-[49px] z-20 bg-[#FAF8F5]/95 backdrop-blur-md py-1.5 -mx-4 px-4 border-b border-black/[0.04]">
                <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-[#EAE6DF] shadow-2xs text-xs font-serif overflow-x-auto no-scrollbar">
                  {[
                    { id: 'summary', label: 'תמצית הון' },
                    { id: 'cashflow', label: 'תזרים ונזילות' },
                    { id: 'goals', label: 'יעדים וצמיחה' },
                    { id: 'all', label: 'הכל' },
                  ].map(sec => (
                    <button
                      key={sec.id}
                      onClick={() => setOverviewSection(sec.id as any)}
                      className={`flex-1 py-1.5 px-2.5 rounded-xl transition-all whitespace-nowrap text-center text-xs ${
                        overviewSection === sec.id
                          ? 'bg-[#1A1A1A] text-white font-bold shadow-xs'
                          : 'text-stone-600 hover:text-stone-900 font-medium'
                      }`}
                    >
                      {sec.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 1. Apple Card Hero (always in summary & all) */}
              {(overviewSection === 'summary' || overviewSection === 'all') && (
                <AppleCardHero
                  currentRecord={currentRecord}
                  previousRecord={previousRecord}
                  onQuickLog={() => setActiveTab('form')}
                  onOpenFire={() => setIsFireModalOpen(true)}
                  onOpenCostBasis={() => setIsCostBasisModalOpen(true)}
                  onEditAsset={setQuickAssetModalType}
                  onScrollToGoals={() => setOverviewSection('goals')}
                  onExportExcel={() => {
                    exportFinancialRecordsToExcel(records);
                    showToast('הקובץ יוצא בהצלחה! 📊', 'success');
                  }}
                />
              )}

              {/* 2. Month Selector Carousel */}
              <MonthSelector
                records={records}
                selectedPeriod={selectedPeriod}
                onSelectPeriod={p => setSelectedPeriod(p)}
              />

              {/* Summary View Cards */}
              {overviewSection === 'summary' && (
                <>
                  <AssetSparklinesCard
                    records={records}
                    currentRecord={currentRecord}
                    previousRecord={previousRecord}
                    onViewHistory={() => setActiveTab('history')}
                    onOpenCostBasis={() => setIsCostBasisModalOpen(true)}
                    onSelectAsset={setQuickAssetModalType}
                  />
                  <WealthChart records={records} />
                  <TrustVerificationBanner />
                </>
              )}

              {/* Cashflow & Liquidity View Cards */}
              {overviewSection === 'cashflow' && (
                <>
                  <CashflowDonutCard currentRecord={currentRecord} />
                  <LiquidityRunwayCard currentRecord={currentRecord} />
                  <AssetSparklinesCard
                    records={records}
                    currentRecord={currentRecord}
                    previousRecord={previousRecord}
                    onViewHistory={() => setActiveTab('history')}
                    onOpenCostBasis={() => setIsCostBasisModalOpen(true)}
                    onSelectAsset={setQuickAssetModalType}
                  />
                  <TopHoldingsCard
                    holdings={holdings}
                    onViewAllStocks={() => {
                      setActiveTab('stocks');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                </>
              )}

              {/* Goals & FIRE View Cards */}
              {overviewSection === 'goals' && (
                <>
                  <div id="mobile-fire-milestone">
                    <FireMilestoneCard
                      currentRecord={currentRecord}
                      onOpenCalculator={() => setIsFireModalOpen(true)}
                    />
                  </div>
                  <WealthInsightsCarousel
                    records={records}
                    currentRecord={currentRecord}
                    onOpenFire={() => setIsFireModalOpen(true)}
                  />
                  <WealthChart records={records} />
                </>
              )}

              {/* Full Continuous View (All Cards) */}
              {overviewSection === 'all' && (
                <>
                  <AssetSparklinesCard
                    records={records}
                    currentRecord={currentRecord}
                    previousRecord={previousRecord}
                    onViewHistory={() => setActiveTab('history')}
                    onOpenCostBasis={() => setIsCostBasisModalOpen(true)}
                    onSelectAsset={setQuickAssetModalType}
                  />
                  <WealthChart records={records} />
                  <TopHoldingsCard
                    holdings={holdings}
                    onViewAllStocks={() => {
                      setActiveTab('stocks');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                  <CashflowDonutCard currentRecord={currentRecord} />
                  <LiquidityRunwayCard currentRecord={currentRecord} />
                  <div id="mobile-fire-milestone">
                    <FireMilestoneCard
                      currentRecord={currentRecord}
                      onOpenCalculator={() => setIsFireModalOpen(true)}
                    />
                  </div>
                  <WealthInsightsCarousel
                    records={records}
                    currentRecord={currentRecord}
                    onOpenFire={() => setIsFireModalOpen(true)}
                  />
                  <TrustVerificationBanner />
                </>
              )}
            </>
          )}

          {activeTab === 'stocks' && (
            <HoldingsPortfolioView
              holdings={holdings}
              cash={portfolioCash}
              transactions={transactions}
              onOpenAddHolding={() => {
                setHoldingToEdit(null);
                setIsAddEditModalOpen(true);
              }}
              onOpenEditHolding={h => {
                setHoldingToEdit(h);
                setIsAddEditModalOpen(true);
              }}
              onOpenSellHolding={h => {
                setSelectedHoldingForSale(h);
                setIsSellModalOpen(true);
              }}
              onDeleteHolding={handleDeleteHolding}
              onUpdateCash={handleUpdateCash}
              onRefreshQuotes={handleRefreshQuotes}
              onSyncExcellenceToMonth={handleSyncExcellenceToMonth}
              currentMonthLabel={currentRecord.label}
            />
          )}

          {activeTab === 'form' && (
            <>
              <MonthSelector
                records={records}
                selectedPeriod={selectedPeriod}
                onSelectPeriod={p => setSelectedPeriod(p)}
              />
              <MonthlyForm
                record={currentRecord}
                onSave={handleSaveRecord}
                isSaving={isSaving}
              />
            </>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {/* Segmented Switch: מאזן הון חודשי vs פירוט שכר ומענקים */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-[#EAE6DF] shadow-2xs text-xs font-serif">
                <button
                  onClick={() => setHistorySection('balance')}
                  className={`flex-1 py-2 px-3 rounded-xl transition-all text-center ${
                    historySection === 'balance'
                      ? 'bg-[#1A1A1A] text-white font-bold shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 font-medium'
                  }`}
                >
                  מאזן חודשי וחיסכון
                </button>
                <button
                  onClick={() => setHistorySection('income')}
                  className={`flex-1 py-2 px-3 rounded-xl transition-all text-center ${
                    historySection === 'income'
                      ? 'bg-[#1A1A1A] text-white font-bold shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 font-medium'
                  }`}
                >
                  פירוט שכר ומענקים
                </button>
              </div>

              {historySection === 'balance' ? (
                <HistoryTable
                  records={records}
                  selectedPeriod={selectedPeriod}
                  onSelectPeriod={p => {
                    setSelectedPeriod(p);
                    setActiveTab('form');
                  }}
                />
              ) : (
                <IncomeGrantsView
                  records={records}
                  selectedPeriod={selectedPeriod}
                  onSelectPeriod={p => {
                    setSelectedPeriod(p);
                    setActiveTab('form');
                  }}
                  onNavigateToForm={() => setActiveTab('form')}
                />
              )}
            </div>
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

      {/* FIRE Interactive Calculator Modal */}
      <FireCalculatorModal
        isOpen={isFireModalOpen}
        onClose={() => setIsFireModalOpen(false)}
        currentWealth={currentRecord.total_wealth || 0}
        defaultMonthlySavings={currentRecord.savings || 12000}
      />

      {/* Cost Basis & Tax Net Modal */}
      <CostBasisModal
        isOpen={isCostBasisModalOpen}
        onClose={() => setIsCostBasisModalOpen(false)}
        marketValue={currentRecord.excellence || 0}
        currentCostBasis={currentRecord.excellence_cost_basis}
        monthLabel={currentRecord.label}
        onSaveCostBasis={handleSaveCostBasis}
      />

      {/* Sell Holding & Cash Transfer Modal */}
      <SellHoldingModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        holding={selectedHoldingForSale}
        periods={records.map(r => ({ period: r.period, label: r.label }))}
        currentPeriod={selectedPeriod}
        onConfirmSale={handleConfirmSale}
      />

      {/* Add / Edit Holding Modal */}
      <AddEditHoldingModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        holdingToEdit={holdingToEdit}
        onSaveHolding={handleSaveHolding}
      />

      {/* Quick Asset / Checking Edit Modal on card touch */}
      {quickAssetModalType && (
        <QuickAssetEditModal
          isOpen={Boolean(quickAssetModalType)}
          onClose={() => setQuickAssetModalType(null)}
          initialAssetType={quickAssetModalType}
          currentRecord={currentRecord}
          previousRecord={previousRecord}
          onSaveRecord={handleSaveRecord}
          onOpenCostBasis={() => {
            setQuickAssetModalType(null);
            setIsCostBasisModalOpen(true);
          }}
        />
      )}

      {/* Quick Month Switcher Modal */}
      <MonthPickerModal
        isOpen={isMonthPickerOpen}
        onClose={() => setIsMonthPickerOpen(false)}
        records={records}
        selectedPeriod={selectedPeriod}
        onSelectPeriod={p => setSelectedPeriod(p)}
      />

    </div>
  );
};
