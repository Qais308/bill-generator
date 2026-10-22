import { Building2, Sparkles, ArrowRight, FileText, Truck, ShieldCheck, Printer, Zap } from "lucide-react";

export default function HomePage({ onSelectBillType, onOpenCompanySettings }) {
  return (
    <main className="relative min-h-[calc(100vh-65px)] flex flex-col justify-between overflow-hidden bg-[#fdfbf7] px-4 py-8 sm:px-8 sm:py-10">
      {/* Yellowish Background Aura & Square Grid */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="h-[650px] w-[850px] rounded-full bg-gradient-to-b from-amber-200/60 via-yellow-100/30 to-transparent blur-3xl"></div>
      </div>
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, #000 70%, transparent 100%)'
        }}
      ></div>

      <div className="relative mx-auto max-w-6xl w-full my-auto">
        {/* Top Header section */}
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-white/80 px-3.5 py-1 text-xs font-semibold text-amber-900 shadow-sm backdrop-blur-md mb-3">
            <Sparkles size={14} className="text-amber-600" />
            <span>Transport & Logistics Bill Suite</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Create professional transport bills in seconds
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
            Manage your company branding once and generate accurate commission bills or loading advice documents instantly.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Company Profile & Details Card */}
          <div 
            onClick={onOpenCompanySettings}
            className="group relative flex flex-col justify-between rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/60 via-white to-white p-6 shadow-sm shadow-amber-900/5 transition-all hover:border-amber-400 hover:shadow-md cursor-pointer"
          >
            <div>
              <div className="mb-4 flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-800 transition-transform group-hover:scale-105">
                  <Building2 size={22} />
                </span>
                <span className="rounded-full bg-amber-100/70 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                  Setup First
                </span>
              </div>

              <h3 className="text-base font-bold text-gray-900 group-hover:text-amber-900">
                Company Profile & Details
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                Configure default company name, address, phone numbers, and signature branding applied across all bills.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-amber-800">
              <span>Manage details</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Commission Bill Card */}
          <div 
            onClick={() => onSelectBillType("commission")}
            className="group relative flex flex-col justify-between rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/60 via-white to-white p-6 shadow-sm shadow-amber-900/5 transition-all hover:border-amber-400 hover:shadow-md cursor-pointer"
          >
            <div>
              <div className="mb-4 flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-800 transition-transform group-hover:scale-105">
                  <FileText size={22} />
                </span>
                <span className="rounded-full bg-amber-100/70 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                  Template
                </span>
              </div>

              <h3 className="text-base font-bold text-gray-900 group-hover:text-amber-900">
                Commission Bill
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                Create a transport commission bill with freight, deductions, payments, and balance details.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-amber-800">
              <span>Create bill</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Loading Advice Bill Card */}
          <div 
            onClick={() => onSelectBillType("loading")}
            className="group relative flex flex-col justify-between rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/60 via-white to-white p-6 shadow-sm shadow-amber-900/5 transition-all hover:border-amber-400 hover:shadow-md cursor-pointer"
          >
            <div>
              <div className="mb-4 flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-800 transition-transform group-hover:scale-105">
                  <Truck size={22} />
                </span>
                <span className="rounded-full bg-amber-100/70 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                  Template
                </span>
              </div>

              <h3 className="text-base font-bold text-gray-900 group-hover:text-amber-900">
                Loading Advice Bill
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                Prepare a loading advice bill with destination, weight, freight, and advance details.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-amber-800">
              <span>Create advice</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Feature Highlights Footer Strip */}
      <div className="relative mx-auto mt-12 max-w-5xl w-full border-t border-amber-200/55 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
            <Zap size={18} />
          </span>
          <div>
            <h4 className="text-xs font-bold text-gray-800">Instant PDF Output</h4>
            <p className="text-[11px] text-gray-500">Print or save straight to A4</p>
          </div>
        </div>

        <div className="flex items-center justify-center sm:justify-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
            <ShieldCheck size={18} />
          </span>
          <div>
            <h4 className="text-xs font-bold text-gray-800">Saved Preferences</h4>
            <p className="text-[11px] text-gray-500">Company profile secure locally</p>
          </div>
        </div>

        <div className="flex items-center justify-center sm:justify-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
            <Printer size={18} />
          </span>
          <div>
            <h4 className="text-xs font-bold text-gray-800">Exact Print Scaling</h4>
            <p className="text-[11px] text-gray-500">Optimized dot-matrix spacing</p>
          </div>
        </div>
      </div>
    </main>
  );
}