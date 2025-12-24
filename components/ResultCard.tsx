import React from 'react';
import { ShieldCheck, ShieldAlert, Calendar, Building2, Fingerprint, Clock, Globe } from 'lucide-react';

interface SSLData {
  valid: boolean;
  issuer: string;
  expiryDate: string;
  daysLeft: number;
  type: "DV" | "OV" | "EV" | "Unknown";
  domainExpiry?: string; // New field from our RDAP API
}

export default function ResultCard({ data }: { data: SSLData }) {
  const isSecure = data.valid;
  const theme = isSecure ? 'emerald' : 'rose';

  // Helper to format the year for the Domain Registry tile
  const getExpiryYear = (dateStr?: string) => {
    if (!dateStr || dateStr === "Not Available") return "N/A";
    return new Date(dateStr).getFullYear();
  };

  return (
    <div className="mt-12 w-full max-w-3xl animate-in fade-in zoom-in duration-500">
      
      {/* 1. HERO BANNER */}
      <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none">
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] shadow-xl transition-all duration-500 ${
            isSecure ? 'bg-emerald-500 shadow-emerald-500/40' : 'bg-rose-500 shadow-rose-500/40'
          }`}>
            {isSecure ? (
              <ShieldCheck size={48} strokeWidth={2.5} className="text-white fill-white/10" />
            ) : (
              <ShieldAlert size={48} strokeWidth={2.5} className="text-white" />
            )}
          </div>

          <div className="text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {isSecure ? "Connection Secure" : "Security Risk"}
              </h2>
            </div>
            <p className="text-lg font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              {isSecure 
                ? "This domain uses industry-standard encryption to protect data." 
                : "The certificate is invalid, expired, or issued by an untrusted authority."}
            </p>
          </div>
        </div>
      </div>

      {/* 2. BENTO GRID: Now with 3 Columns on larger screens */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        <BentoTile 
          label="SSL Validation" 
          value={data.type} 
          icon={<Fingerprint className="text-indigo-500" size={24} />}
          description={
            data.type === 'EV' ? 'Highest tier vetting.' : 
            data.type === 'OV' ? 'Organization verified.' : 
            'Basic domain ownership.'
          }
        />
        
        <BentoTile 
          label="SSL Issuer" 
          value={data.issuer} 
          icon={<Building2 className="text-blue-500" size={24} />}
          description="The Authority verifying this site."
        />

        {/* NEW: Domain Registry Tile */}
        <BentoTile 
          label="Domain Registry" 
          value={`Expires ${getExpiryYear(data.domainExpiry)}`} 
          icon={<Globe className="text-amber-500" size={24} />}
          description="The ownership contract for this domain name."
        />

        {/* 3. FULL-WIDTH EXPIRY TIMELINE */}
        <div className="md:col-span-2 lg:col-span-3 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 shadow-sm">
          <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500">
                <Clock size={24} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-800 dark:text-white">SSL Lifespan</h4>
                <p className="text-sm text-slate-400 font-medium italic">Certificate valid until {new Date(data.expiryDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="rounded-2xl px-6 py-3 bg-emerald-50 dark:bg-emerald-900/20 text-center">
               <p className="text-2xl font-black text-emerald-600">{data.daysLeft}</p>
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Days Left</p>
            </div>
          </div>

          <div className="relative h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${isSecure ? 'bg-emerald-500' : 'bg-rose-500'}`}
              style={{ width: `${Math.max(5, Math.min((data.daysLeft / 365) * 100, 100))}%` }}
            />
          </div>
          
          <div className="mt-6 flex justify-between text-[11px] font-black uppercase tracking-[0.2em] text-slate-300">
            <span>Issue Date: Verified</span>
            <span>Expiration: {new Date(data.expiryDate).toDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BentoTile({ label, value, icon, description }: { label: string; value: string; icon: React.ReactNode, description: string }) {
  return (
    <div className="group rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 transition-all hover:border-slate-300">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800">{icon}</div>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">{label}</p>
      <h4 className="text-2xl font-black text-slate-800 dark:text-white break-words leading-tight">{value}</h4>
      <p className="mt-3 text-sm font-medium text-slate-400 dark:text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}