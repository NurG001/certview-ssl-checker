import React from 'react';
import { ShieldCheck, ShieldAlert, Building2, Fingerprint, Clock, Globe } from 'lucide-react';

interface SSLData {
  valid: boolean;
  issuer: string;
  expiryDate: string;
  daysLeft: number;
  type: "DV" | "OV" | "EV" | "Unknown";
  domainExpiry?: string;
}

export default function ResultCard({ data }: { data: SSLData }) {
  const isSecure = data.valid;
  const getExpiryYear = (dateStr?: string) => 
    (!dateStr || dateStr === "Not Available") ? "N/A" : new Date(dateStr).getFullYear();

  return (
    <div className="mt-8 md:mt-12 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. HERO BANNER: Responsive alignment and sizing */}
      <div className="rounded-[2rem] md:rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-10 shadow-xl">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 text-center md:text-left">
          <div className={`flex h-20 w-20 md:h-28 md:w-28 shrink-0 items-center justify-center rounded-[1.8rem] md:rounded-[2.2rem] ${
            isSecure ? 'bg-emerald-500 shadow-2xl shadow-emerald-500/30' : 'bg-rose-500 shadow-2xl shadow-rose-500/30'
          }`}>
            {isSecure ? (
              <ShieldCheck className="text-white w-10 h-10 md:w-16 md:h-16" />
            ) : (
              <ShieldAlert className="text-white w-10 h-10 md:w-16 md:h-16" />
            )}
          </div>
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
              {isSecure ? "Connection Secure" : "Security Risk"}
            </h2>
            <p className="mt-2 text-sm md:text-xl font-medium text-slate-500 dark:text-slate-400">
              {isSecure ? "Standard encryption verified." : "Handshake failed or untrusted issuer."}
            </p>
          </div>
        </div>
      </div>

      {/* 2. BENTO GRID: 1-Column Phone / 3-Column Browser */}
      <div className="mt-4 md:mt-6 grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
        <BentoTile 
          label="Validation Level" 
          value={data.type} 
          icon={<Fingerprint className="text-indigo-500 w-6 h-6 md:w-8 md:h-8" />} 
          description="Security Tier" 
        />
        
        {/* FIXED: This tile now allows long names like 'Google Trust Services' to wrap */}
        <BentoTile 
          label="Authority" 
          value={data.issuer} 
          icon={<Building2 className="text-blue-500 w-6 h-6 md:w-8 md:h-8" />} 
          description="Verified Issuer" 
        />
        
        <BentoTile 
          label="Domain" 
          value={`Expires ${getExpiryYear(data.domainExpiry)}`} 
          icon={<Globe className="text-amber-500 w-6 h-6 md:w-8 md:h-8" />} 
          description="Registry ownership" 
        />

        {/* 3. PROGRESS BAR SECTION: Browser Span */}
        <div className="lg:col-span-3 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-10">
          <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500">
                <Clock size={24} />
              </div>
              <div>
                <h4 className="font-black text-slate-800 dark:text-white text-base md:text-xl">SSL Lifespan</h4>
                <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest italic">
                  Valid until {new Date(data.expiryDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <span className="text-2xl md:text-4xl font-black text-emerald-600 block leading-none">{data.daysLeft}</span>
              <span className="text-[8px] md:text-[10px] font-bold uppercase text-slate-400">Days Left</span>
            </div>
          </div>
          <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-1000" 
              style={{ width: `${Math.max(5, (data.daysLeft / 365) * 100)}%` }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function BentoTile({ label, value, icon, description }: any) {
  return (
    <div className="flex flex-col rounded-[1.8rem] md:rounded-[2.2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 transition-all hover:scale-[1.03]">
      <div className="mb-5 flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800">
        {icon}
      </div>
      <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      
      {/* - Removed 'truncate' to allow text wrapping
          - Added 'break-words' to prevent long text from overflowing the container
      */}
      <h4 className="text-lg md:text-2xl font-black text-slate-800 dark:text-white leading-tight break-words">
        {value}
      </h4>
      
      <p className="mt-1 text-xs text-slate-400">{description}</p>
    </div>
  );
}