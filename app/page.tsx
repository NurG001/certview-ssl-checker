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

    const sanitizedDomain = domain
      .trim()
      .replace(/^(https?:\/\/)/, "") 
      .split('/')[0]                 
      .split('?')[0];                

    // ADVANCED ERROR HANDLING: Client-side TLD check
    if (!sanitizedDomain.includes('.')) {
      setError("Please include a domain extension (the part after the dot, like .com or .org).");
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
        // ADVANCED ERROR HANDLING: Technical error translation
        if (data.error?.includes('ENOTFOUND')) {
          setError(`Could not find "${sanitizedDomain}". Double-check the spelling and ensure you included the extension after the dot.`);
        } else if (data.error?.includes('ECONNREFUSED')) {
          setError("Connection refused. This server may not have an active SSL certificate or port 443 open.");
        } else if (data.error?.includes('ETIMEDOUT')) {
          setError("The connection timed out. The server is taking too long to respond.");
        } else {
          setError(data.error || 'Diagnostic failed. Please check the domain.');
        }
      }
    } catch (err) {
      setError('Connection failed. Please check your internet and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden transition-colors duration-500 bg-[#fdfdfd] dark:bg-slate-950 p-4 md:p-10">
      
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-6 right-6 z-50 p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-xl ring-1 ring-slate-200 dark:ring-slate-800 text-slate-500 dark:text-amber-400 transition-all hover:scale-110 active:scale-95"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-emerald-100/40 dark:bg-emerald-900/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-blue-100/40 dark:bg-blue-900/10 blur-[120px]" />

      <div className="z-10 w-full max-w-3xl">
        <header className="mb-12 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-slate-100 dark:ring-slate-800">
            <ShieldCheck className="text-emerald-500" size={40} strokeWidth={1.5} />
          </div>
          <h1 className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-5xl md:text-7xl font-black tracking-tight text-transparent">
            CertView
          </h1>
          <p className="mt-4 text-base md:text-lg font-medium text-slate-500 dark:text-slate-400 mx-auto whitespace-nowrap">
            Instantly verify domain security with advanced certificate diagnostics.
          </p>
        </header>

        <form onSubmit={checkSSL} className="group relative mx-auto max-w-2xl">
          <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-emerald-400 to-blue-500 opacity-20 blur-xl transition duration-1000 group-focus-within:opacity-40" />
          <div className="relative flex flex-col md:flex-row items-center gap-2 rounded-[2rem] bg-white dark:bg-slate-900 p-2 shadow-2xl ring-1 ring-slate-200/50 dark:ring-slate-800">
            <div className="flex w-full items-center pl-4 gap-3">
              <Search className="text-slate-400 dark:text-slate-600" size={22} />
              <input
                type="text"
                placeholder="Enter domain (e.g. google.com)"
                className="w-full bg-transparent py-4 text-lg font-semibold text-slate-700 dark:text-white outline-none placeholder:text-slate-300 dark:placeholder:text-slate-700"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
            </div>
            <button
              disabled={loading}
              className="w-full md:w-auto flex items-center justify-center gap-2 rounded-[1.5rem] bg-slate-900 dark:bg-emerald-600 px-10 py-4 font-bold text-white transition-all hover:bg-slate-800 dark:hover:bg-emerald-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Scanning
                </>
              ) : (
                'Analyze'
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mx-auto mt-8 max-w-xl animate-in fade-in slide-in-from-top-2 rounded-2xl border border-rose-100 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/30 p-5 text-center shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-center gap-3 text-rose-600 dark:text-rose-400">
              <ShieldAlert size={20} className="shrink-0" />
              <p className="text-sm font-bold leading-relaxed">
                {error}
              </p>
            </div>
          </div>
        )}

        {result && <ResultCard data={result} />}
      </div>

      <footer className="absolute bottom-8 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">
       &bull; CertView (SSL Diagnostics Tool) made by Ismail Mahmud Nur &bull; 
      </footer>
    </main>
  );
}