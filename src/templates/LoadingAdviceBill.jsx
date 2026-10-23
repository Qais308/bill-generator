import { useRef, useState, useEffect } from "react";
import { ArrowLeft, Download, ImagePlus, RotateCcw, Building2, Save, BookmarkCheck, ArrowRight } from "lucide-react";
import { getSavedCompanyDetails } from "../components/CompanyDetailsPage";
import { toPng } from "html-to-image";

const createEmptyBill = () => ({
    billNumber: getInitialBillNumber(),
    date: new Date().toISOString().slice(0, 10),
    recipient: "",
    recipientAddress: "",
    truckNumber: "",
    from: "",
    to: "",
    rate: "",
    tonText: "PAR TON",
    totalWt: "",
    totalFreight: "",
    serviceCharges: "",
    diesel: "",
    advance: "",
    balance: "",
});

const moneyFields = [
    ["totalFreight", "Total freight"],
    ["serviceCharges", "T. Service Charges"],
    ["diesel", "Diesel"],
    ["advance", "Advance Rs."],
    ["balance", "Balance Rs."],
];

const NEXT_NUMBER_STORAGE_KEY = "loading_advice_next_number";

const getInitialBillNumber = () => {
    try {
        const saved = localStorage.getItem(NEXT_NUMBER_STORAGE_KEY);
        if (saved) return saved;
    } catch (e) {
        console.error("Failed to load next bill number", e);
    }
    return "1"; // Default starting number
};

const DRAFT_STORAGE_KEY = "loading_advice_bill_draft";

export default function LoadingAdviceBill({
    data: externalData,
    onChange: externalOnChange,
    onBack,
    onOpenCompanySettings,
    onUnsavedChangesChange,
}) {
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Load saved draft if explicitly saved, otherwise start blank
    const [bill, setBill] = useState(() => {
        try {
            const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
            if (savedDraft) {
                return { ...JSON.parse(savedDraft), company: getSavedCompanyDetails() };
            }
        } catch (e) {
            console.error("Failed to load draft", e);
        }
        return {
            ...createEmptyBill(),
            ...(externalData || {}),
            company: getSavedCompanyDetails(),
        };
    });

    const [showEditor, setShowEditor] = useState(true);
    const [isDraftSaved, setIsDraftSaved] = useState(false);

    // Sync unsaved changes with App.js for gesture interception
    useEffect(() => {
        onUnsavedChangesChange?.(hasUnsavedChanges);
    }, [hasUnsavedChanges, onUnsavedChangesChange]);

    // Keep master company branding updated
    useEffect(() => {
        const companyMaster = getSavedCompanyDetails();
        setBill((prev) => ({ ...prev, company: companyMaster }));
    }, []);

    // 🛡️ Browser tab close / refresh warning
    useEffect(() => {
        function handleBeforeUnload(e) {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = "";
            }
        }
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [hasUnsavedChanges]);

    const adviceRef = useRef(null);

    async function downloadAdviceImage() {
        if (!adviceRef.current) return;

        try {
            const dataUrl = await toPng(adviceRef.current, { cacheBust: true, quality: 0.95, pixelRatio: 2 });

            const link = document.createElement("a");
            link.download = `Loading-Advice-${bill.billNumber || "1"}.png`;
            link.href = dataUrl;
            link.click();

            // 🔄 Auto-increment next bill number (+1) after download
            const currentNum = parseInt(bill.billNumber, 10);
            if (!isNaN(currentNum)) {
                const nextNum = (currentNum + 1).toString();
                localStorage.setItem(NEXT_NUMBER_STORAGE_KEY, nextNum);
            }

            // Clean up draft and reset form
            localStorage.removeItem(DRAFT_STORAGE_KEY);
            setBill({
                ...createEmptyBill(),
                company: getSavedCompanyDetails(),
            });
            setHasUnsavedChanges(false);

        } catch (e) {
            console.error("Failed to generate advice image", e);
            alert("Failed to download image. Please try again.");
        }
    }

    const currentBill = externalData
        ? { ...createEmptyBill(), ...externalData, company: getSavedCompanyDetails() }
        : bill;

    function updateField(key, value) {
        setBill((previous) => ({ ...previous, [key]: value }));
        setHasUnsavedChanges(true);
        setIsDraftSaved(false);
        externalOnChange?.(key, value);
    }

    function handleBackNavigation() {
        if (hasUnsavedChanges) {
            const confirmLeave = window.confirm(
                "You have unsaved changes! Are you sure you want to leave without saving?"
            );
            if (!confirmLeave) return;
        }
        onBack?.();
    }

    function handleOpenSettingsWithCheck() {
        if (hasUnsavedChanges) {
            const confirmLeave = window.confirm(
                "You have unsaved changes! Are you sure you want to leave to configure company settings?"
            );
            if (!confirmLeave) return;
        }
        onOpenCompanySettings?.();
    }

    function handleSaveDraft() {
        try {
            localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(bill));
            setIsDraftSaved(true);
            setHasUnsavedChanges(false);
            setTimeout(() => setIsDraftSaved(false), 3000);
        } catch (e) {
            console.error("Failed to save draft", e);
        }
    }


    function printBill() {
        try {
            // 🔄 Auto-increment next bill number (+1)
            const currentNum = parseInt(bill.billNumber, 10);
            if (!isNaN(currentNum)) {
                const nextNum = (currentNum + 1).toString();
                localStorage.setItem(NEXT_NUMBER_STORAGE_KEY, nextNum);
            }
        } catch (e) {
            console.error("Failed to update next bill number", e);
        }

        // Clean up draft and trigger print
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        window.print();

        // ⚡ Reset form instantly with the newly incremented bill number from storage
        setBill({
            ...createEmptyBill(),
            company: getSavedCompanyDetails(),
        });

        setHasUnsavedChanges(false);
    }
    return (
        <main className="min-h-screen bg-[#fdfbf7] px-3 py-5 sm:px-6 sm:py-8">
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
        /* Container Query driven paper proportions */
        .bill-wrapper {
          container-type: inline-size;
          width: 100%;
          max-width: 794px;
          margin: 0 auto;
        }

        .commission-paper {
        font-family: "Times New Roman", Times, serif;
          box-sizing: border-box;
          position: relative;
          width: 100%;
          aspect-ratio: 210 / 297;
          margin: 0 auto;
          overflow: hidden;
          background: white;
          color: #111;
          border: 3px solid #111;
          border-radius: 12px;
          padding: 3cqw 3.5cqw;
          display: flex;
          flex-direction: column;
          font-size: 2.2cqw;
          line-height: 1;
          color: #000050
        }

        .commission-paper * {
          box-sizing: border-box;
        }

        .bill-top {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: start;
          width: 100%;
          margin-top: 0;
        }

        .bill-top > div:first-child {
          text-align: left;
        }

        .bill-top-center {
          text-align: center;
        }

        .bill-top-right {
          white-space: pre-line;
          text-align: right;
          font-weight: 400;
          line-height: 1.15;
          justify-self: end;
        }

        /* Company header */
        .company-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1cqw;
          margin-top: 0.1cqw;
          min-height: 4.5cqw;
        }

        .company-logo {
  flex: 0 0 auto;
  object-fit: contain;
  height: 9cqw !important;    
  max-height: 10cqw !important; 
  width: auto !important;     
  margin: 0;
}


        .company-name {
          font-family: 'Kanit', sans-serif;
  font-weight: 850; /* Maximum thickness */
  text-transform: uppercase; /* Forces all caps like the image */
  letter-spacing: 0.5px;
          font-size: 5cqw;
          line-height: 1.2;
          white-space: nowrap;
          letter-spacing: -0.04em;
        }

        .company-subtitle {
          text-align: center;
          font-size: 1.35em;
          font-style: italic;
          font-weight: 500;
          line-height: 1.2;
        }

        .company-regions {
          text-align: center;
          font-size: 1.25em;
          font-style: italic;
          font-weight: 500;
        }

        .company-email {
          text-align: center;
          font-size: 1.25em;
          font-weight: 600;
          overflow-wrap: anywhere;
        }

        /* Address and date */
        .bill-address {
        background-color: #0b1f3a; /* 👈 Dark blue background */
          color: #ffffff;
          margin: 0.6cqw -0.3cqw 0;
          padding: 0.4cqw 0;
          text-align: center;
          font-size: 1.35em;
          font-weight: 800;
          border-top: 2px solid #111;
          border-bottom: 2px solid #111;
        }

        .bill-date-row {
          display: flex;
          justify-content: flex-end;
          align-items: baseline;
          gap: 0.8cqw;
          margin: 0.8cqw 0.2cqw 0.5cqw;
          font-size: 1.15em;
          font-weight: 600;
        }

        /* Bill fields */
        .bill-fields {
          display: flex;
          flex-direction: column;
          gap: 0.7cqw;
          flex: 1;
          min-height: 0;
          padding-top: 0.5cqw;
        }

        .bill-line {
          display: flex;
          align-items: baseline;
          gap: 0.8cqw;
          min-height: 1.6em;
          font-size: 1.15em;
          font-weight: 600;
        }

        .bill-label {
          flex: 0 0 auto;
          white-space: nowrap;
          line-height: 1.3;
        }

        /* Crisp black dots with downward offset */
        .bill-dots {
          flex: 1;
          min-width: 5px;
          min-height: 1.4em;
          position: relative;
          background-image: url("data:image/svg+xml,%3Csvg width='6' height='2' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='0.9' fill='black'/%3E%3C/svg%3E");
          background-repeat: repeat-x;
          background-position: left bottom;
          display: flex;
          align-items: flex-end;
          transform: translateY(2px);
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .bill-value {
        font-family: 'Caveat', cursive;
          display: inline-block;
          position: relative;
          padding: 0 0.5cqw 0 5cqw;
          background: white;
          transform: translateY(-2px);
          overflow-wrap: anywhere;
          font-size: 1.1em;
          font-weight: 500;
          -webkit-font-smoothing: antialiased;
          line-height: 1.2;
          color: #111;
          z-index: 2;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .bill-two-columns {
          display: flex;
          align-items: baseline;
          gap: 0.8cqw;
          width: 100%;
        }

        .bill-two-columns .bill-line {
          flex: 1;
          min-width: 0;
        }

        .bill-money-row {
          display: flex;
          width: 68%;
          min-height: 1.6em;
          align-items: baseline;
          gap: 0.8cqw;
          font-size: 1.15em;
          font-weight: 600;
        }

        /* Notice / Footer message */
        .bill-notice {
          flex-shrink: 0;
          border-top: 2px solid #111;
          margin: -1cqw -0.3cqw 0;
          padding: 0.4cqw 0.4cqw 0.1cqw;
          color: #660066;
        }

        .bill-notice-text {
          font-size: 1.15em;
          font-style: italic;
          font-weight: 550;
          line-height: 1.3;
          text-align: center;
        }

        /* Signature + Manager container */
        .bill-signature-container {
          position: absolute;
          right: 4%;
          bottom: 15%;
          width: 30%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          gap: 0.4cqw;
          box-sizing: border-box;
          text-align: center;
          z-index: 2;
        }

        .bill-signature {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          min-width: 0;
        }

        .bill-signature-space {
          width: 100%;
          min-height: 5cqw;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        }

        .bill-signature-image {
          display: block;
          width: auto;
          height: auto;
          max-width: 100%;
          max-height: 13cqw;
          object-fit: contain;
          object-position: center;
          margin: 0 auto;
        }

        .bill-signature-container > div:last-child {
          width: 100%;
          font-size: 1.6cqw;
          font-weight: 600;
          line-height: 1.2;
          overflow-wrap: anywhere;
          text-align: center;
        }

         /* Tighter line spacing ONLY on mobile screens */
        @media (max-width: 768px) {
          .bill-fields {
            gap: 0.35cqw !important;
            padding-top: 0.2cqw !important;
          }
          .bill-line {
            min-height: 1.35em !important;
          }
          .bill-money-row {
            min-height: 1.35em !important;
          }
          .bill-dots {
            background-image: url("data:image/svg+xml,%3Csvg width='4' height='2' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='0.6' fill='black'/%3E%3C/svg%3E") !important;
            background-repeat: repeat-x !important;
            background-position: left bottom !important;
            transform: translateY(2px) !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
      .company-logo {
  height: 3.5em !important;     /* 👈 Increase this from 1.8em to a larger value (e.g., 3.5em or 4em) */
  max-height: 4em !important;   /* 👈 Make sure max-height is higher so it has room to grow */
}
            
        }

        @media (max-width: 480px) {
          .bill-signature-image {
            max-height: 8cqw !important;
          }
          .bill-signature-container > div:last-child {
            font-size: 9px !important;
          }
        }

        /* Form inputs */
        .bill-input {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 9px 10px;
          background: white;
          color: #111827;
          outline: none;
        }

        .bill-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px #bfdbfe;
        }

        /* Print Override */
        @media print {
          @page {
            size: auto;
            margin: 0mm;
          }

          html,
          body {
            width: 100%;
            height: 100%;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            overflow: hidden !important;
          }

          body * {
            visibility: hidden;
          }

          .bill-wrapper,
          .bill-wrapper * {
            visibility: visible;
          }

         .bill-address {
            background-color: #0b1f3a !important;
            color: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .bill-wrapper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            height: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 5mm !important;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .commission-paper {
            width: 100% !important;
            height: 100% !important;
            max-width: 210mm !important;
            max-height: 297mm !important;
            border: 1.5px solid #111 !important;
            border-radius: 8px !important;
            box-shadow: none !important;
            aspect-ratio: 210 / 297 !important;
          }

          .no-print {
            display: none !important;
          }
        }
      `}</style>

            <div className="no-print mx-auto mb-5 flex max-w-7xl flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <button
                            type="button"
                            onClick={handleBackNavigation}
                            className="flex items-center gap-1 rounded-xl border border-amber-200/80 bg-white/80 px-3.5 py-2 text-sm font-semibold text-amber-900 transition hover:bg-amber-100/60 cursor-pointer shadow-2xs"
                        >
                            <ArrowLeft size={17} /> Back
                        </button>
                    )}
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                            Loading Advice
                        </h1>
                        <p className="text-xs text-amber-800/80 sm:text-sm font-medium">
                            Enter loading advice details. Save draft if leaving half-filled.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                    {/* Save Draft Button */}
                    <button
                        type="button"
                        onClick={handleSaveDraft}
                        className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-100/60 px-3.5 py-2 text-sm font-bold text-amber-900 hover:bg-amber-200 cursor-pointer transition shadow-2xs"
                    >
                        {isDraftSaved ? <BookmarkCheck size={16} className="text-emerald-700" /> : <Save size={16} />}
                        <span>{isDraftSaved ? "Draft Saved!" : "Save Draft"}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowEditor((value) => !value)}
                        className="rounded-xl border border-amber-200/80 bg-white/90 px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-50 cursor-pointer transition shadow-2xs"
                    >
                        {showEditor ? "Hide editor" : "Edit details"}
                    </button>
                    <button
                        type="button"
                        onClick={downloadAdviceImage}
                        className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-amber-950 shadow-sm transition hover:bg-amber-400 cursor-pointer"
                    >
                        <Download size={16} /> Download Bill Image
                    </button>
                </div>
            </div>

            {/* Responsive layout */}
            <div
                className={`mx-auto max-w-7xl ${showEditor
                    ? "grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
                    : "max-w-4xl"
                    }`}
            >
                {showEditor && (
                    <section className="no-print rounded-2xl border border-amber-200/80 bg-white/90 p-4 shadow-sm sm:p-6 lg:sticky lg:top-5 backdrop-blur-md space-y-6">

                        <div
                            onClick={handleOpenSettingsWithCheck}
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


                        <div className="border-t border-amber-100 pt-2">
                            <h2 className="mb-3 font-bold text-gray-900">
                                Loading advice details
                            </h2>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {[
                                    ["billNumber", "Bill number (No.)"],
                                    ["date", "Date", "date"],
                                    ["recipient", "M/s"],
                                    ["recipientAddress", "Customer address (second line)"],
                                    ["truckNumber", "Truck No."],
                                    ["from", "Ex (From)"],
                                    ["to", "To destination"],
                                    ["rate", "Rate (Rs.)"],
                                    ["tonText", "Unit text (e.g. PAR TON)"],
                                    ...moneyFields,
                                    ["totalWt", "Total Wt."],
                                ].map(([key, label, type]) => (
                                    <label
                                        key={key}
                                        className={`block text-xs font-bold text-gray-700 ${key === "recipientAddress" ? "sm:col-span-2" : ""
                                            }`}
                                    >
                                        <span className="mb-1 block font-bold">{label}</span>
                                        <input
                                            className="bill-input"
                                            type={type || "text"}
                                            value={currentBill[key] ?? ""}
                                            placeholder=""
                                            onChange={(event) => updateField(key, event.target.value)}
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <section className="bill-wrapper lg:sticky lg:top-5">
                    <div className="no-print mb-3 text-center text-xs font-medium text-amber-900/80">
                        Bill preview · Exact A4 proportional match
                    </div>

                    <article className="commission-paper" ref={adviceRef}>
                        <div className="bill-top">
                            <div>
                                <strong style={{ fontSize: "1.4em" }}>
                                    {currentBill.billNumber}
                                </strong>
                            </div>

                            <div className="bill-top-center">
                                <div style={{ fontSize: "1.4em" }}>786</div>
                            </div>

                            <div
                                className="bill-top-right"
                                style={{ color: currentBill.company.headerTextColor || "#111" }}
                            >
                                MOB:{" "}
                                {currentBill.company.phones
                                    ? currentBill.company.phones.split("\n").join(" / ")
                                    : ""}
                            </div>
                        </div>

                        <div className="company-row">
                            {currentBill.company.logoUrl && (
                                <img
                                    src={currentBill.company.logoUrl}
                                    alt="Company logo"
                                    className="company-logo"
                                />
                            )}

                            <div className="company-name">
                                {currentBill.company.nameWordColors &&
                                    currentBill.company.nameWordColors.length > 0 ? (
                                    currentBill.company.nameWordColors.map((item, idx) => (
                                        <span
                                            key={idx}
                                            style={{ color: item.color }}
                                            className="mr-1.5"
                                        >
                                            {item.word}
                                        </span>
                                    ))
                                ) : (
                                    <span style={{ color: "#d51f20" }}>
                                        {currentBill.company.companyName || ""}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div
                            className="company-subtitle"
                            style={{ color: currentBill.company.headerTextColor || "#111" }}
                        >
                            {currentBill.company.subtitle}
                        </div>
                        <div
                            className="company-regions"
                            style={{ color: currentBill.company.headerTextColor || "#111" }}
                        >
                            {currentBill.company.regions}
                        </div>
                        <div
                            className="company-email"
                            style={{ color: currentBill.company.headerTextColor || "#111" }}
                        >
                            {currentBill.company.email ? `email : ${currentBill.company.email}` : ""}
                        </div>

                        <div
                            className="bill-address"
                            style={{ color: '#ffffff', backgroundColor: '#0b1f3a' }}
                        >
                            {currentBill.company.address}
                        </div>

                        <div className="bill-date-row">
                            <span className="bill-label">Date :</span>
                            <span className="bill-dots" style={{ width: "160px", flex: "none" }}>
                                <span className="bill-value">
                                    {currentBill.date
                                        ? new Date(
                                            `${currentBill.date}T00:00:00`
                                        ).toLocaleDateString("en-GB")
                                        : ""}
                                </span>
                            </span>
                        </div>

                        <div className="bill-fields">
                            <div className="bill-line" style={{ fontStyle: "italic" }}>
                                <span className="bill-label">To</span>
                            </div>

                            <div className="bill-line">
                                <span className="bill-label">M/s</span>
                                <span className="bill-dots">
                                    <span className="bill-value">{currentBill.recipient}</span>
                                </span>
                            </div>

                            <div className="bill-line">
                                <span className="bill-dots">
                                    <span className="bill-value">
                                        {currentBill.recipientAddress}
                                    </span>
                                </span>
                            </div>

                            <div className="bill-line" style={{ marginTop: "0.2cqw" }}>
                                <span className="bill-label" style={{ fontStyle: "italic" }}>
                                    Ref: Truck No.
                                </span>
                                <span className="bill-dots">
                                    <span className="bill-value">{currentBill.truckNumber}</span>
                                </span>
                            </div>

                            <div className="bill-two-columns">
                                <div className="bill-line">
                                    <span className="bill-label" style={{ fontStyle: "italic" }}>
                                        Ex
                                    </span>
                                    <span className="bill-dots">
                                        <span className="bill-value">{currentBill.from}</span>
                                    </span>
                                </div>
                                <div className="bill-line">
                                    <span className="bill-label" style={{ fontStyle: "italic" }}>
                                        To
                                    </span>
                                    <span className="bill-dots">
                                        <span className="bill-value">{currentBill.to}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="bill-line">
                                <span className="bill-label" style={{ fontStyle: "italic" }}>
                                    Rate
                                </span>
                                <span className="bill-dots" style={{ flex: "0 0 40%" }}>
                                    <span className="bill-value">{currentBill.rate}</span>
                                </span>
                                <span style={{ fontWeight: "600", fontStyle: "italic" }}>
                                    /- {currentBill.tonText}
                                </span>
                                <span className="bill-dots"></span>
                            </div>

                            <div
                                className="bill-line"
                                style={{
                                    fontStyle: "italic",
                                    marginTop: "0.4cqw",
                                    marginBottom: "0.2cqw",
                                }}
                            >
                                <span>Dear Sir,</span>
                            </div>

                            <div
                                className="bill-line"
                                style={{
                                    fontStyle: "italic",
                                    textIndent: "2rem",
                                    lineHeight: "1.35",
                                }}
                            >
                                <span>
                                    As per your instruction we are sending the above truck to be
                                    loaded by you for the destination mentioned above.
                                </span>
                            </div>

                            <div
                                className="bill-line"
                                style={{
                                    justifyContent: "center",
                                    fontWeight: "bold",
                                    fontStyle: "italic",
                                    marginTop: "0.2cqw",
                                    marginBottom: "0.2cqw",
                                }}
                            >
                                <span>Please load the truck and oblige.</span>
                            </div>

                            <div className="bill-line">
                                <span className="bill-label" style={{ fontStyle: "italic" }}>
                                    Total Wt.
                                </span>
                                <span className="bill-dots">
                                    <span className="bill-value">{currentBill.totalWt}</span>
                                </span>
                            </div>

                            {moneyFields.map(([key, label]) => (
                                <div className="bill-money-row" key={key} style={{ fontStyle: "italic" }}>
                                    <span className="bill-label">{label}</span>
                                    <span className="bill-dots">
                                        <span className="bill-value">{currentBill[key]}</span>
                                    </span>
                                </div>
                            ))}

                            <div className="bill-signature-container">
                                <div style={{ fontWeight: "600", fontStyle: "italic", marginBottom: "0.2cqw" }}>
                                    Yours faithfully
                                </div>
                                <div className="bill-signature">
                                    <div className="bill-signature-space">
                                        {currentBill.company?.signature && (
                                            <img
                                                src={currentBill.company.signature}
                                                alt="Company signature or stamp"
                                                className="bill-signature-image"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div style={{ fontStyle: "italic", fontWeight: "bold" }}>Manager</div>
                            </div>
                        </div>

                        <div className="bill-notice">
                            <div className="bill-notice-text">
                                Please arrange to load the truck and check all necessary
                                papers before loading the goods. Kindly insure your goods
                                otherwise we are not responsible for any accident, theft loading,
                                Leakage Breakage and Damage etc.
                            </div>
                        </div>
                    </article>
                </section>
            </div>
        </main>
    );
}