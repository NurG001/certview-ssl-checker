"use client";

import { useState, useEffect } from 'react';
import { ShieldCheck, Search, Loader2, Moon, Sun, ShieldAlert } from 'lucide-react';
import ResultCard from '@/components/ResultCard';

export default function Home() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const checkSSL = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    const sanitizedDomain = domain.trim().toLowerCase().replace(/^(https?:\/\/)/, "").split('/')[0].split('?')[0];
    if (!sanitizedDomain.includes('.')) {
      setError("Please include a domain extension (e.g., .com).");
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/check-ssl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: sanitizedDomain }),
      });
      const data = await res.json();
      if (res.ok) setResult(data);
      else setError(data.error || 'Diagnostic failed.');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden bg-[#fdfdfd] dark:bg-slate-950 p-4 sm:p-6 md:p-10 transition-colors duration-500">
      {/* Theme Toggle */}
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-4 right-4 md:top-8 md:right-8 z-50 p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-lg ring-1 ring-slate-200 dark:ring-slate-800 transition-transform active:scale-90"
      >
        {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-500" />}
      </button>

      <div className="z-10 w-full max-w-[800px] flex flex-col items-center">
        <header className="mb-8 md:mb-12 text-center flex flex-col items-center px-4">
          <div className="mb-4 md:mb-6 flex h-16 w-16 md:h-24 md:w-24 items-center justify-center rounded-[1.5rem] md:rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-slate-100 dark:ring-slate-800">
            <ShieldCheck className="text-emerald-500 w-10 h-10 md:w-14 md:h-14" strokeWidth={1.5} />
          </div>
          <h1 className="bg-gradient-to-b from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-5xl sm:text-6xl md:text-8xl font-black tracking-tight text-transparent leading-none">
            CertView
          </h1>
          <p className="mt-4 text-sm md:text-xl font-medium text-slate-500 dark:text-slate-400 text-balance max-w-[320px] md:max-w-none">
            Professional domain security diagnostics with real-time handshake data.
          </p>
        </header>

        {/* Search Bar Container */}
        <form onSubmit={checkSSL} className="group relative w-full px-2">
          <div className="absolute -inset-1 rounded-[1.5rem] md:rounded-[2.5rem] bg-gradient-to-r from-emerald-400 to-blue-500 opacity-10 blur-xl group-focus-within:opacity-30 transition duration-500" />
          <div className="relative flex flex-col sm:flex-row items-center gap-2 rounded-[1.2rem] md:rounded-[2rem] bg-white dark:bg-slate-900 p-2 shadow-2xl ring-1 ring-slate-200/50 dark:ring-slate-800">
            <div className="flex w-full items-center pl-3 md:pl-4 gap-2">
              <Search className="text-slate-400 shrink-0" size={20} />
              <input
                type="text"
                placeholder="Enter domain (e.g. google.com)"
                className="w-full bg-transparent py-3 md:py-4 text-base md:text-lg font-semibold text-slate-700 dark:text-white outline-none placeholder:text-slate-300"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
            </div>
            <button
              disabled={loading}
              className="w-full sm:w-auto rounded-[1rem] md:rounded-[1.5rem] bg-slate-900 dark:bg-emerald-600 px-10 py-3 md:py-4 font-black text-white hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Analyze'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 p-3 text-xs font-bold text-rose-600">
            <ShieldAlert size={16} /> {error}
          </div>
        )}

        {result && <ResultCard data={result} />}
      </div>

      <footer className="mt-auto py-10 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
      • CertView (SSL Diagnostics Tool) Made by Ismail Mahmud Nur • 
      </footer>
    </main>
  );
}