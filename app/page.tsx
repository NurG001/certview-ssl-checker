"use client";

import { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Search, Loader2, Moon, Sun } from 'lucide-react';
import ResultCard from '@/components/ResultCard';

export default function Home() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme Persistence & Toggle
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

    // 1. INPUT SANITIZATION: Removes https:// and trailing slashes
    const sanitizedDomain = domain
      .trim()
      .toLowerCase()
      .replace(/^(https?:\/\/)/, "") 
      .split('/')[0]                 
      .split('?')[0];                

    // 2. TLD VALIDATION: Client-side check for the dot
    if (!sanitizedDomain.includes('.')) {
      setError("Please include a domain extension (e.g., .com, .org, or .net).");
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
      
      if (res.ok) {
        setResult(data);
      } else {
        // Human-friendly error mapping
        if (data.error?.includes('ENOTFOUND')) {
          setError(`Could not resolve "${sanitizedDomain}". Please check the spelling.`);
        } else if (data.error?.includes('ECONNREFUSED')) {
          setError("Connection refused. The server might not have port 443 open.");
        } else {
          setError(data.error || 'Diagnostic failed. Please try again.');
        }
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden transition-colors duration-500 bg-[#fdfdfd] dark:bg-slate-950 p-4 md:p-10">
      
      {/* Theme Switcher */}
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-6 right-6 z-50 p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-xl ring-1 ring-slate-200 dark:ring-slate-800 text-slate-500 dark:text-amber-400 transition-all hover:scale-110 active:scale-95"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-emerald-100/40 dark:bg-emerald-900/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-blue-100/40 dark:bg-blue-900/10 blur-[120px]" />

      <div className="z-10 w-full max-w-4xl flex flex-col items-center">
        <header className="mb-12 text-center flex flex-col items-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-slate-100 dark:ring-slate-800">
            <ShieldCheck className="text-emerald-500" size={40} strokeWidth={1.5} />
          </div>
          <h1 className="bg-gradient-to-b from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-5xl md:text-7xl font-black tracking-tight text-transparent">
            CertView
          </h1>
          <p className="mt-4 text-base md:text-lg font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
            Instantly verify domain security with advanced certificate diagnostics.
          </p>
        </header>

        {/* SEARCH BAR */}
        <form onSubmit={checkSSL} className="group relative w-full max-w-2xl">
          <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-emerald-400 to-blue-500 opacity-20 blur-xl transition duration-1000 group-focus-within:opacity-40" />
          <div className="relative flex flex-col md:flex-row items-center gap-2 rounded-[2rem] bg-white dark:bg-slate-900 p-2 shadow-2xl ring-1 ring-slate-200/50 dark:ring-slate-800">
            <div className="flex w-full items-center pl-4 gap-3">
              <Search className="text-slate-400" size={22} />
              <input
                type="text"
                placeholder="Enter domain (e.g. google.com)"
                className="w-full bg-transparent py-4 text-lg font-semibold text-slate-700 dark:text-white outline-none placeholder:text-slate-300"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
            </div>
            <button
              disabled={loading}
              className="w-full md:w-auto flex items-center justify-center gap-2 rounded-[1.5rem] bg-slate-900 dark:bg-emerald-600 px-10 py-4 font-bold text-white transition-all hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Analyze'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mx-auto mt-8 max-w-xl animate-in fade-in slide-in-from-top-2 rounded-2xl border border-rose-100 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/30 p-4 text-center text-sm font-bold text-rose-600 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2">
              <ShieldAlert size={18} />
              {error}
            </div>
          </div>
        )}

        {result && <ResultCard data={result} />}
      </div>

      <footer className="mt-20 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
      &bull; CertView (SSL Diagnostics Tool made by Ismail Mahmud Nur) &bull;
      </footer>
    </main>
  );
}