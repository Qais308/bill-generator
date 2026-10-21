import { useRef, useState } from "react";
import { ArrowLeft, Download, ImagePlus, RotateCcw } from "lucide-react";

const defaultBill = {
  billNumber: "1074",
  serialNumber: "786",
  date: new Date().toISOString().slice(0, 10),
  companyName: "HIMMAT ROAD WAYS",
  address: "BASUDEVPUR, HPL LINK ROAD, HALDIA, 721602",
  phones: "9002786772\n9002786561\n9932017824",
  subtitle:
    "Transport Contractors Commission Agent & Lorry Suppliers",
  regions: "Maharashtra, Assam, Gujrat, Karnataka all over India",
  loadingText: "LOADING FOR ALL OVER INDIA",
  email: "himmatroadways@gmail.com",
  recipient: "",
  recipientAddress: "",
  truckNumber: "",
  from: "",
  to: "",
  transport: "",
  weight: "",
  rate: "",
  freight: "",
  tripAllowance: "",
  cash: "",
  discount: "",
  oil: "",
  challan: "",
  commission: "",
  neft: "",
  balance: "",
};

const moneyFields = [
  ["freight", "Freight"],
  ["tripAllowance", "Tripal"],
  ["cash", "Cash"],
  ["discount", "Cash Discount"],
  ["oil", "Oil"],
  ["challan", "Challan"],
  ["commission", "Commission"],
  ["neft", "Neft"],
  ["balance", "Balance"],
];

export default function CommissionBill({
  data: externalData,
  onChange: externalOnChange,
  onBack,
}) {
  const [bill, setBill] = useState(() => ({
    ...defaultBill,
    ...(externalData || {}),
  }));
  const [logo, setLogo] = useState("");
  const [logoWidth, setLogoWidth] = useState(100);
  const [logoPosition, setLogoPosition] = useState("left");
  const [companyColor, setCompanyColor] = useState("#d51f20");
  const [showEditor, setShowEditor] = useState(true);
  const logoInput = useRef(null);
  const [signature, setSignature] = useState(
    () => localStorage.getItem("commissionBillSignature") || ""
  );
  const signatureInput = useRef(null);

  const currentBill = externalData
    ? { ...defaultBill, ...externalData }
    : bill;

  function updateField(key, value) {
    setBill((previous) => ({ ...previous, [key]: value }));
    externalOnChange?.(key, value);
  }

  function handleLogoUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result);
    reader.readAsDataURL(file);
  }

  function handleSignatureUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        localStorage.setItem(
          "commissionBillSignature",
          reader.result
        );
        setSignature(reader.result);
      } catch {
        alert("The image is too large to save. Please use a smaller image.");
      }
    };

    reader.readAsDataURL(file);
  }

  function removeSignature() {
    localStorage.removeItem("commissionBillSignature");
    setSignature("");

    if (signatureInput.current) {
      signatureInput.current.value = "";
    }
  }

  function printBill() {
    window.print();
  }

  function clearLogo() {
    setLogo("");
    if (logoInput.current) logoInput.current.value = "";
  }

  return (
    <main className="min-h-screen bg-gray-50 px-3 py-5 sm:px-6 sm:py-8">
      <style>{`
        /* Container Query driven paper proportions */
        .bill-wrapper {
          container-type: inline-size;
          width: 100%;
          max-width: 794px;
          margin: 0 auto;
        }

        .commission-paper {
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
          font-family: Arial, Helvetica, sans-serif;
          display: flex;
          flex-direction: column;
          font-size: 2.1cqw;
          line-height: 1.3;
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

        .bill-title {
          text-decoration: underline;
          font-size: 1.55em;
          font-weight: 800;
          margin-top: 0.1em;
        }

        /* Company header */
        .company-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1cqw;
          margin-top: 0.5cqw;
          min-height: 4.5cqw;
        }

        .company-logo {
          flex: 0 0 auto;
          object-fit: contain;
          max-height: 100%;
          max-width: 100%;
          margin: 0;
        }

        .company-name {
          font-weight: 900;
          font-size: 3.8cqw;
          line-height: 1;
          white-space: nowrap;
          letter-spacing: -0.04em;
        }

        .company-subtitle {
          text-align: center;
          font-size: 1.35em;
          font-style: italic;
          font-weight: 600;
          line-height: 1.2;
        }

        .company-regions {
          text-align: center;
          font-size: 1.25em;
          font-style: italic;
          font-weight: 600;
        }

        .company-loading {
          text-align: center;
          font-size: 1.4em;
          font-weight: 900;
        }

        .company-email {
          text-align: center;
          font-size: 1.25em;
          font-weight: 550;
          overflow-wrap: anywhere;
        }

        /* Address and date */
        .bill-address {
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

        /* Answer value bold and sharp on mobile & desktop */
        .bill-value {
          display: inline-block;
          position: relative;
          padding: 0 5px;
          background: white;
          transform: translateY(-2px);
          overflow-wrap: anywhere;
          font-size: 1em;
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

        .bill-two-columns .bill-label {
          white-space: nowrap;
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

        /* Notice */
        .bill-notice {
          flex-shrink: 0;
          border-top: 2px solid #111;
          margin: -1cqw -0.3cqw 0;
          padding: 0 0.4cqw 0.3cqw;
        }

        .bill-notice-title {
          text-align: center;
          font-size: 1.3em;
          font-weight: 900;
          text-decoration: underline;
          margin: -0.65em auto 0.4cqw;
          width: max-content;
          max-width: 100%;
          background: white;
          padding: 0 0.8cqw;
        }

        .bill-notice-text {
          font-size: 1.2em;
          font-weight: 550;
          line-height: 1.3;
          padding: 0.4cqw 0.5cqw 0.6cqw;
        }

        /* Signature + company name container */
        .bill-signature-container {
          position: absolute;
          right: 4%;
          bottom: 18%;
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
          max-height: 16cqw;
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
            background-image: url("data:image/svg+xml,%3Csvg width='3.5' height='2' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='0.6' fill='black'/%3E%3C/svg%3E") !important;
            background-repeat: repeat-x !important;
            background-position: left bottom !important;
            transform: translateY(2px) !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
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

          .bill-dots {
            background-image: url("data:image/svg+xml,%3Csvg width='6' height='2' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='0.9' fill='black'/%3E%3C/svg%3E") !important;
            background-repeat: repeat-x !important;
            background-position: left bottom !important;
            transform: translateY(2px) !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .bill-value {
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
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
              onClick={onBack}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-blue-700 transition hover:bg-blue-100"
            >
              <ArrowLeft size={17} /> Back
            </button>
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Commission Bill
            </h1>
            <p className="text-xs text-gray-500 sm:text-sm">
              Enter details and preview the exact A4 bill layout.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowEditor((value) => !value)}
            className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
          >
            {showEditor ? "Hide editor" : "Edit details"}
          </button>
          <button
            type="button"
            onClick={printBill}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-cyan-600 hover:to-blue-800"
          >
            <Download size={16} /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Responsive layout: Side-by-side on desktop (Form Left, Preview Right), stacked on mobile */}
      <div
        className={`mx-auto max-w-7xl ${
          showEditor
            ? "grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
            : "max-w-4xl"
        }`}
      >
        {showEditor && (
          <section className="no-print rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:sticky lg:top-5">
            <h2 className="mb-3 font-semibold text-gray-900">
              Company branding
            </h2>

            <div className="mb-4 rounded-xl border border-dashed border-blue-300 bg-blue-50/50 p-4">
              <label className="mb-2 block text-sm font-medium text-gray-800">
                Upload signature / stamp
              </label>

              <input
                ref={signatureInput}
                type="file"
                accept="image/*"
                onChange={handleSignatureUpload}
                className="hidden"
              />

              <p className="mt-2 text-xs text-gray-500">
                PNG, JPG, or another browser-supported image format.
              </p>

              {signature && (
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={signature}
                    alt="Saved signature or stamp"
                    className="h-12 max-w-32 object-contain"
                  />
                  <button
                    type="button"
                    onClick={removeSignature}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
                  >
                    <RotateCcw size={14} /> Remove signature / stamp
                  </button>
                </div>
              )}

              {!signature && (
                <button
                  type="button"
                  onClick={() => signatureInput.current?.click()}
                  className="mt-3 flex items-center gap-2 rounded-lg bg-gradient-to-br from-cyan-100 to-blue-200 px-3 py-2 text-sm font-medium text-blue-800 ring-1 ring-blue-300 transition hover:ring-2 hover:ring-blue-400"
                >
                  <ImagePlus size={16} /> Choose signature
                </button>
              )}
            </div>

            <div className="mb-4 rounded-xl border border-dashed border-blue-300 bg-blue-50/50 p-4">
              <label className="mb-2 block text-sm font-medium text-gray-800">
                Upload company logo
              </label>
              <input
                ref={logoInput}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-100 file:px-3 file:py-2 file:font-medium file:text-blue-700 hover:file:bg-blue-200"
              />
              <p className="mt-2 text-xs text-gray-500">
                PNG, JPG, or another browser-supported image format.
              </p>

              {logo && (
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={logo}
                    alt="Company logo preview"
                    className="h-12 max-w-32 object-contain"
                  />
                  <button
                    type="button"
                    onClick={clearLogo}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
                  >
                    <RotateCcw size={14} /> Remove logo
                  </button>
                </div>
              )}
              {!logo && (
                <button
                  type="button"
                  onClick={() => logoInput.current?.click()}
                  className="mt-3 flex items-center gap-2 rounded-lg bg-gradient-to-br from-cyan-100 to-blue-200 px-3 py-2 text-sm font-medium text-blue-800 ring-1 ring-blue-300 transition hover:ring-2 hover:ring-blue-400"
                >
                  <ImagePlus size={16} /> Choose logo
                </button>
              )}
            </div>

            <label className="mb-4 block text-sm text-gray-700">
              <span className="mb-2 flex items-center justify-between font-medium">
                Logo width <span>{logoWidth}px</span>
              </span>
              <input
                type="range"
                min="40"
                max="160"
                step="5"
                value={logoWidth}
                onChange={(event) => setLogoWidth(Number(event.target.value))}
                className="w-full accent-blue-600"
              />
            </label>

            <label className="mb-4 block text-sm text-gray-700">
              <span className="mb-2 block font-medium">Logo position</span>
              <select
                value={logoPosition}
                onChange={(event) => setLogoPosition(event.target.value)}
                className="bill-input"
              >
                <option value="left">Left of company name</option>
                <option value="right">Right of company name</option>
                <option value="top">Above company name</option>
              </select>
            </label>

            <label className="mb-4 block text-sm text-gray-700">
              <span className="mb-2 block font-medium">
                Company name text color
              </span>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={companyColor}
                  onChange={(event) => setCompanyColor(event.target.value)}
                  className="h-10 w-14 cursor-pointer rounded border border-gray-300 bg-white p-1"
                />
                <input
                  value={companyColor}
                  onChange={(event) => setCompanyColor(event.target.value)}
                  className="bill-input"
                  aria-label="Company name hex color"
                />
              </div>
            </label>

            <div className="my-6 border-t border-gray-200"></div>

            <h2 className="mb-3 font-semibold text-gray-900">
              Bill details
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-6">
              {[
                ["companyName", "Company name"],
                ["subtitle", "Company subtitle"],
                ["regions", "Regions / service area"],
                ["loadingText", "Loading heading"],
                ["email", "Email address"],
                ["address", "Company address"],
                ["phones", "Phone numbers (Mob.)"],
                ["billNumber", "Bill number (No.)"],
                ["serialNumber", "Top serial number"],
                ["date", "Date", "date"],
                ["recipient", "To / Customer name"],
                ["recipientAddress", "Customer address (second line)"],
                ["truckNumber", "Truck number"],
                ["from", "From destination"],
                ["to", "To destination"],
                ["transport", "Transport name"],
                ["weight", "Weight"],
                ["rate", "Rate (Rs.)"],
                ...moneyFields,
              ].map(([key, label, type]) => (
                <label key={key} className={`block text-sm text-gray-700 ${key === "phones" || key === "recipientAddress" ? "sm:col-span-2" : ""}`}>
                  <span className="mb-1 block font-medium">{label}</span>
                  {key === "phones" ? (
                    <textarea
                      rows={2}
                      value={currentBill[key] ?? ""}
                      onChange={(event) => updateField(key, event.target.value)}
                      className="bill-input"
                    />
                  ) : (
                    <input
                      className="bill-input"
                      type={type || "text"}
                      value={currentBill[key] ?? ""}
                      onChange={(event) => updateField(key, event.target.value)}
                    />
                  )}
                </label>
              ))}
            </div>
          </section>
        )}

        <section className="bill-wrapper lg:sticky lg:top-5">
          <div className="no-print mb-3 text-center text-xs text-gray-500">
            Bill preview · Exact A4 proportional match
          </div>

          <article className="commission-paper">
            <div className="bill-top">
              <div>
                No.:{" "}
                <strong style={{ fontSize: "1.5em", marginLeft: "0.3em" }}>
                  {currentBill.billNumber}
                </strong>
              </div>

              <div className="bill-top-center">
                <div style={{ fontSize: "1.4em" }}>
                  {currentBill.serialNumber}
                </div>
                <div className="bill-title">Commission Bill</div>
              </div>

              <div className="bill-top-right">
                Mob.: {currentBill.phones}
              </div>
            </div>

            <div
              className="company-row"
              style={{
                flexDirection: logoPosition === "top" ? "column" : "row",
                marginTop: logoPosition === "top" ? "0.3cqw" : "0.5cqw",
              }}
            >
              {logoPosition === "left" && logo && (
                <img
                  src={logo}
                  alt="Company logo"
                  className="company-logo"
                  style={{ width: `${logoWidth}px` }}
                />
              )}

              <div
                className="company-name"
                style={{ color: companyColor }}
              >
                {currentBill.companyName}
              </div>

              {logoPosition === "right" && logo && (
                <img
                  src={logo}
                  alt="Company logo"
                  className="company-logo"
                  style={{ width: `${logoWidth}px` }}
                />
              )}

              {logoPosition === "top" && logo && (
                <img
                  src={logo}
                  alt="Company logo"
                  className="company-logo"
                  style={{ width: `${logoWidth}px` }}
                />
              )}
            </div>

            <div className="company-subtitle">{currentBill.subtitle}</div>
            <div className="company-regions">{currentBill.regions}</div>
            <div className="company-loading">{currentBill.loadingText}</div>
            <div className="company-email">email : {currentBill.email}</div>

            <div className="bill-address">{currentBill.address}</div>

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
              <div className="bill-line">
                <span className="bill-label">To :</span>
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

              <div className="bill-line">
                <span className="bill-label">Truck No. :</span>
                <span className="bill-dots">
                  <span className="bill-value">{currentBill.truckNumber}</span>
                </span>
              </div>

              <div className="bill-two-columns">
                <div className="bill-line">
                  <span className="bill-label">From :</span>
                  <span className="bill-dots">
                    <span className="bill-value">{currentBill.from}</span>
                  </span>
                </div>
                <div className="bill-line">
                  <span className="bill-label">To :</span>
                  <span className="bill-dots">
                    <span className="bill-value">{currentBill.to}</span>
                  </span>
                </div>
              </div>

              <div className="bill-line">
                <span className="bill-label">Transport Name :</span>
                <span className="bill-dots">
                  <span className="bill-value">{currentBill.transport}</span>
                </span>
              </div>

              <div className="bill-two-columns">
                <div className="bill-line">
                  <span className="bill-label">Weight :</span>
                  <span className="bill-dots">
                    <span className="bill-value">{currentBill.weight}</span>
                  </span>
                </div>
                <div className="bill-line">
                  <span className="bill-label">Rate Rs. :</span>
                  <span className="bill-dots">
                    <span className="bill-value">{currentBill.rate}</span>
                  </span>
                </div>
              </div>

              {moneyFields.map(([key, label]) => (
                <div className="bill-money-row" key={key}>
                  <span className="bill-label">{label} :</span>
                  <span className="bill-dots">
                    <span className="bill-value">{currentBill[key]}</span>
                  </span>
                </div>
              ))}

              <div className="bill-signature-container">
                <div className="bill-signature">
                  <div className="bill-signature-space">
                    {signature && (
                      <img
                        src={signature}
                        alt="Company signature or stamp"
                        className="bill-signature-image"
                      />
                    )}
                  </div>
                </div>
                <div>For {currentBill.companyName}</div>
              </div>
            </div>

            <div className="bill-notice">
              <div className="bill-notice-title">IMPORTANT NOTICE</div>
              <div className="bill-notice-text">
                Sign challan (Acknowledgement) will be submitted within 15 days
                after the unloading date. If not 100 rupees will be deducted per
                day for late submission charge.
              </div>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}