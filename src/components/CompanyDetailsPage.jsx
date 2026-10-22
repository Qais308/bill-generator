import { useState } from "react";
import { ArrowLeft, Building2, Save, CheckCircle2, ImagePlus, Trash2, Palette } from "lucide-react";

export const DEFAULT_COMPANY_DETAILS = {
  companyName: "",
  nameWordColors: [], // e.g. [{ word: "HIMMAT", color: "#dc2626" }, { word: "ROAD", color: "#991b1b" }, { word: "WAYS", color: "#1e3a8a" }]
  subtitle: "",
  regions: "",
  email: "",
  address: "",
  phones: "",
  logoUrl: "", // Base64 image data
  headerTextColor: "#111827", // Default dark gray for subtitles & details
};

export const COMPANY_STORAGE_KEY = "shared_company_details";

export function getSavedCompanyDetails() {
  try {
    const saved = localStorage.getItem(COMPANY_STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_COMPANY_DETAILS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error("Failed to load company details", e);
  }
  return DEFAULT_COMPANY_DETAILS;
}

export default function CompanyDetailsPage({ onBack }) {
  const [details, setDetails] = useState(getSavedCompanyDetails);
  const [savedSuccess, setSavedSuccess] = useState(false);

  function handleChange(key, value) {
    setDetails((prev) => {
      const updated = { ...prev, [key]: value };
      
      // If company name text changes, keep or sync word color array
      if (key === "companyName") {
        const words = value.trim().split(/\s+/).filter(Boolean);
        updated.nameWordColors = words.map((word, idx) => {
          return prev.nameWordColors[idx]
            ? { ...prev.nameWordColors[idx], word }
            : { word, color: "#dc2626" }; // Default color fallback
        });
      }
      return updated;
    });
    setSavedSuccess(false);
  }

  function handleWordColorChange(index, newColor) {
    setDetails((prev) => {
      const newColors = [...prev.nameWordColors];
      if (newColors[index]) {
        newColors[index] = { ...newColors[index], color: newColor };
      }
      return { ...prev, nameWordColors: newColors };
    });
    setSavedSuccess(false);
  }

  function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange("logoUrl", reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleRemoveLogo() {
    handleChange("logoUrl", "");
  }

  function handleSubmit(e) {
    e.preventDefault();
    try {
      localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(details));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error("Failed to save company details", e);
    }
  }

  return (
    <main className="relative min-h-[calc(100vh-65px)] overflow-hidden bg-[#fdfbf7] px-4 py-8 sm:px-8">
      {/* Background Aura & Grid */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="h-[550px] w-[750px] rounded-full bg-gradient-to-b from-amber-200/50 via-yellow-100/20 to-transparent blur-3xl"></div>
      </div>
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="relative mx-auto max-w-3xl">
        {/* Header Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl border border-amber-200/80 bg-white/80 px-4 py-2 text-xs font-semibold text-amber-900 shadow-xs hover:bg-amber-100/60 cursor-pointer transition"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>

          {savedSuccess && (
            <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <CheckCircle2 size={16} />
              <span>Details saved successfully!</span>
            </div>
          )}
        </div>

        {/* Main Form Container */}
        <div className="rounded-2xl border border-amber-200/80 bg-white/90 p-6 shadow-xl shadow-amber-900/5 backdrop-blur-xl sm:p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-amber-100 pb-5">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <Building2 size={24} />
            </span>
            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Company Profile & Branding Settings
              </h1>
              <p className="text-xs text-gray-500 sm:text-sm">
                Customize your company header, word-by-word colors, logo, and contact info saved in local storage.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Logo Upload Section */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Company Logo</label>
              <div className="flex items-center gap-4">
                {details.logoUrl ? (
                  <div className="relative group flex h-20 w-20 items-center justify-center rounded-xl border border-amber-200 bg-amber-50/40 p-2">
                    <img
                      src={details.logoUrl}
                      alt="Company Logo Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute -top-2 -right-2 rounded-full bg-red-600 p-1 text-white shadow-md hover:bg-red-700"
                      title="Remove logo"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex h-20 w-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-amber-200/90 bg-amber-50/20 text-amber-800 hover:bg-amber-100/50 transition">
                    <ImagePlus size={20} />
                    <span className="mt-1 text-[11px] font-semibold">Upload Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Company Name & Word-by-Word Color Picker */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                required
                value={details.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                placeholder=""
                className="w-full rounded-xl border border-amber-200/90 bg-amber-50/20 px-3.5 py-2.5 text-sm font-medium focus:border-amber-500 focus:bg-white focus:outline-none transition"
              />

              {/* Word-by-Word Color Selectors */}
              {details.nameWordColors && details.nameWordColors.length > 0 && (
                <div className="mt-3 rounded-xl border border-amber-200/70 bg-amber-50/40 p-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
                    <Palette size={14} />
                    <span>Word-by-Word Color Customization:</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {details.nameWordColors.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 rounded-lg bg-white p-2 border border-amber-200/80 shadow-2xs">
                        <span className="text-xs font-bold text-gray-800">{item.word}</span>
                        <input
                          type="color"
                          value={item.color || "#dc2626"}
                          onChange={(e) => handleWordColorChange(idx, e.target.value)}
                          className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Live Name Preview */}
                  <div className="mt-3 border-t border-amber-200/60 pt-2 text-center">
                    <span className="text-[11px] text-gray-500 block mb-1">Live Header Preview:</span>
                    <span className="text-xl font-black tracking-wide">
                      {details.nameWordColors.map((item, idx) => (
                        <span key={idx} style={{ color: item.color }} className="mr-1.5">
                          {item.word}
                        </span>
                      ))}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Subtitle & Header Color */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">Company Subtitle / Tagline</label>
                <input
                  type="text"
                  value={details.subtitle}
                  onChange={(e) => handleChange("subtitle", e.target.value)}
                  placeholder=""
                  className="w-full rounded-xl border border-amber-200/90 bg-amber-50/20 px-3.5 py-2.5 text-sm font-medium focus:border-amber-500 focus:bg-white focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Header Details Color</label>
                <div className="flex items-center gap-2.5 rounded-xl border border-amber-200/90 bg-amber-50/20 px-3 py-1.5">
                  <input
                    type="color"
                    value={details.headerTextColor || "#111827"}
                    onChange={(e) => handleChange("headerTextColor", e.target.value)}
                    className="h-7 w-7 cursor-pointer rounded border-0 bg-transparent"
                  />
                  <span className="text-xs font-mono text-gray-700">{details.headerTextColor || "#111827"}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Regions / Service Areas</label>
                <input
                  type="text"
                  value={details.regions}
                  onChange={(e) => handleChange("regions", e.target.value)}
                  placeholder=""
                  className="w-full rounded-xl border border-amber-200/90 bg-amber-50/20 px-3.5 py-2.5 text-sm font-medium focus:border-amber-500 focus:bg-white focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={details.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder=""
                  className="w-full rounded-xl border border-amber-200/90 bg-amber-50/20 px-3.5 py-2.5 text-sm font-medium focus:border-amber-500 focus:bg-white focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Company Address</label>
              <input
                type="text"
                value={details.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder=""
                className="w-full rounded-xl border border-amber-200/90 bg-amber-50/20 px-3.5 py-2.5 text-sm font-medium focus:border-amber-500 focus:bg-white focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Phone Numbers (one per line)</label>
              <textarea
                rows={3}
                value={details.phones}
                onChange={(e) => handleChange("phones", e.target.value)}
                placeholder=""
                className="w-full rounded-xl border border-amber-200/90 bg-amber-50/20 px-3.5 py-2.5 text-sm font-medium focus:border-amber-500 focus:bg-white focus:outline-none transition"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-amber-100">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-bold text-amber-950 shadow-sm hover:bg-amber-400 cursor-pointer transition"
              >
                <Save size={17} />
                <span>Save Company Details</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}