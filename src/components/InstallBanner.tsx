import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share, MoreVertical, Globe, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

interface InstallBannerProps {
  onInstalled?: () => void;
}

export const InstallBanner: React.FC<InstallBannerProps> = ({ onInstalled }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isAndroid, setIsAndroid] = useState<boolean>(false);
  const [isWebView, setIsWebView] = useState<boolean>(false);

  useEffect(() => {
    // 1. Check if already installed & running standalone
    const standaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    setIsStandalone(standaloneMode);

    // 2. Detect platform & environment
    const ua = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(ua);
    const android = /android/.test(ua);
    const webview = /fban|fbav|instagram|whatsapp|line|messenger/.test(ua);

    setIsIOS(ios);
    setIsAndroid(android);
    setIsWebView(webview);

    // 3. Listen for Chromium PWA install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // 4. Listen for appinstalled
    const handleAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
      if (onInstalled) onInstalled();
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [onInstalled]);

  // If already running inside standalone PWA or user dismissed, don't show
  if (isStandalone || isDismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Direct native prompt on Android Chrome / Brave / Edge
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          // Wait for the OS 'appinstalled' event before confirming installation
          setIsDismissed(true);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.warn('Native install prompt error:', err);
        setShowInstructionsModal(true);
      }
    } else {
      // iOS Safari, WebView or browser requiring manual install steps
      setShowInstructionsModal(true);
    }
  };

  return (
    <>
      {/* Top Banner on Mobile / Desktop */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white px-4 py-2.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <Download className="w-4 h-4 text-white animate-bounce" />
            </div>
            <div className="text-right truncate">
              <p className="text-xs font-bold leading-tight truncate">
                התקנת האפליקציה למסך הבית בטלפון
              </p>
              <p className="text-[11px] text-blue-100 truncate">
                גישה מהירה בלחיצה אחת וסנכרון ענן מלא
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs shadow-sm active:scale-95 transition flex items-center gap-1.5"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>התקן עכשיו</span>
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-blue-100 hover:text-white transition"
              aria-label="סגור"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Instructional Modal when native prompt isn't directly triggered */}
      {showInstructionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in" dir="rtl">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
            
            <button
              onClick={() => setShowInstructionsModal(false)}
              className="absolute top-4 left-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 border border-blue-100 shadow-sm">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">הוספת האפליקציה למסך הבית</h3>
              <p className="text-xs text-slate-500 mt-1">
                2 שלבים פשוטים להתקנה בכל מכשיר:
              </p>
            </div>

            {/* In-App Browser (WhatsApp / Telegram) Warning */}
            {isWebView && (
              <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="font-bold text-amber-800">פתחת את הקישור מתוך וואטסאפ!</strong>
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    וואטסאפ חוסם התקנת אפליקציות. לחץ על <strong>3 הנקודות למעלה</strong> ובחר <strong>"פתח בדפדפן" (Chrome / Safari)</strong>, ומשם ההתקנה תעבוד מיד!
                  </p>
                </div>
              </div>
            )}

            {/* Platform Specific Steps */}
            <div className="space-y-3 text-xs text-slate-700">
              
              {/* iPhone / Safari */}
              <div className={`p-4 rounded-2xl border transition ${isIOS ? 'bg-blue-50/70 border-blue-200 ring-2 ring-blue-500/20' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1.5">
                  <Share className="w-4 h-4 text-blue-600" />
                  <span>באייפון (Safari):</span>
                  {isIOS && <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full font-normal">המכשיר שלך</span>}
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] pr-1">
                  <li>לחץ על אייקון <strong>השיתוף</strong> (מרובע עם חץ למעלה בתחתית המסך).</li>
                  <li>גלול למטה ובחר באפשרות <strong>"הוסף למסך הבית"</strong> (Add to Home Screen).</li>
                  <li>לחץ על <strong>"הוסף"</strong> בפינה העליונה.</li>
                </ol>
              </div>

              {/* Android / Chrome / Brave */}
              <div className={`p-4 rounded-2xl border transition ${isAndroid ? 'bg-blue-50/70 border-blue-200 ring-2 ring-blue-500/20' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1.5">
                  <MoreVertical className="w-4 h-4 text-blue-600" />
                  <span>באנדרואיד (Chrome / Brave / OnePlus / Samsung):</span>
                  {isAndroid && <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full font-normal">המכשיר שלך</span>}
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] pr-1">
                  <li>לחץ על <strong>3 הנקודות</strong> בפינה העליונה של הדפדפן.</li>
                  <li>בחר באפשרות <strong>"התקן אפליקציה"</strong> או <strong>"הוסף למסך הבית"</strong>.</li>
                  <li>אשר את ההתקנה בחלון שיופיע.</li>
                </ol>
                <div className="mt-2.5 pt-2 border-t border-slate-200/80 text-[10.5px] text-slate-600 space-y-1">
                  <div>
                    <strong className="text-rose-700">מופיעה שגיאה "ההתקנה לא הצליחה"?</strong> יש להסיר קודם את האפליקציה הישנה מהמכשיר (לחיצה ארוכה על האייקון ⬅ <strong>הסר התקנה</strong>, או הגדרות ⬅ יישומים), ואז להתקין שוב.
                  </div>
                  <div>
                    <strong className="text-amber-800">נעילת מסך:</strong> ודא שבהגדרות מסך הבית האפשרות <strong>"נעילת פריסת מסך הבית"</strong> כבויה.
                  </div>
                </div>
              </div>

            </div>

            <button
              onClick={() => setShowInstructionsModal(false)}
              className="w-full mt-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md shadow-blue-500/20"
            >
              הבנתי, תודה!
            </button>
          </div>
        </div>
      )}
    </>
  );
};