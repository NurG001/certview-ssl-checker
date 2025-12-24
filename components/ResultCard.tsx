import React from 'react';
import { ShieldCheck, ShieldAlert, Calendar, Building2, Fingerprint, Clock } from 'lucide-react';

interface SSLData {
  valid: boolean;
  issuer: string;
  expiryDate: string;
  daysLeft: number;
  type: "DV" | "OV" | "EV" | "Unknown";
}

export default function ResultCard({ data }: { data: SSLData }) {
  const isSecure = data.valid;
  const theme = isSecure ? 'emerald' : 'rose';

  return (
    <div className="mt-12 w-full max-w-3xl animate-in fade-in zoom-in duration-500">
      
      {/* 1. HERO BANNER: Solid Icon Container for High Contrast */}
      <div className={`relative overflow-hidden rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none`}>
        <div className={`absolute -right-20 -top-20 h-64 w-64 rounded-full bg-${theme}-500/5 blur-[80px]`} />
        
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          {/* ICON CONTAINER: Ensures logo visibility on all backgrounds */}
          <div className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] shadow-xl transition-all duration-500 ${
            isSecure 
              ? 'bg-emerald-500 shadow-emerald-500/40' 
              : 'bg-rose-500 shadow-rose-500/40'
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
              <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                isSecure ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
              }`}>
                {isSecure ? "Verified" : "Action Required"}
              </span>
            </div>
            <p className="text-lg font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              {isSecure 
                ? "This domain uses industry-standard encryption to protect data." 
                : "The certificate is invalid, expired, or issued by an untrusted authority."}
            </p>
          </div>
        </div>
      </div>

      {/* 2. BENTO GRID: Information Hierarchy */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <BentoTile 
          label="Validation Level" 
          value={data.type} 
          icon={<Fingerprint className="text-indigo-500" size={24} />}
          description={
            data.type === 'EV' ? 'Highest tier: Extended vetting' : 
            data.type === 'OV' ? 'Organization verified by CA' : 
            'Basic domain-level ownership'
          }
        />
        
        <BentoTile 
          label="Trusted Issuer" 
          value={data.issuer} 
          icon={<Building2 className="text-blue-500" size={24} />}
          description="The Certificate Authority that verified this site."
        />

        {/* Full-Width Expiry Timeline */}
        <div className="md:col-span-2 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 shadow-sm transition-all hover:shadow-md">
          <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-500">
                <Clock size={24} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-800 dark:text-white">Lifespan Status</h4>
                <p className="text-sm text-slate-400 dark:text-slate-500 font-medium italic">Valid until {new Date(data.expiryDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className={`rounded-2xl px-6 py-3 text-center ${data.daysLeft < 30 ? 'bg-rose-50 dark:bg-rose-900/20' : 'bg-emerald-50 dark:bg-emerald-900/20'}`}>
               <p className={`text-2xl font-black ${data.daysLeft < 30 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {data.daysLeft}
               </p>
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Days Left</p>
            </div>
          </div>

          <div className="relative h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                isSecure ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-rose-500 shadow-rose-500/30'
              }`}
              style={{ width: `${Math.max(5, Math.min((data.daysLeft / 365) * 100, 100))}%` }}
            />
          </div>
          
          <div className="mt-6 flex justify-between text-[11px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-slate-700">
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
    <div className="group rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 transition-all hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-none">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 transition-colors group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:shadow-lg">
        {icon}
      </div>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">{label}</p>
      <h4 className="text-2xl font-black text-slate-800 dark:text-white break-words leading-tight">{value}</h4>
      <p className="mt-3 text-sm font-medium text-slate-400 dark:text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}