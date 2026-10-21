
import { useState } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import CommissionBill from "./templates/CommissionBill";
import "./index.css";

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedBillType, setSelectedBillType] = useState(null);

  function handleSelectBillType(type) {
    setSelectedBillType(type);
    setPage("bill");
  }

  function goHome() {
    setPage("home");
    setSelectedBillType(null);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onGoHome={goHome}
        onGoSettings={() => {}}
      />

      {page === "home" && (
        <HomePage onSelectBillType={handleSelectBillType} />
      )}

      {page === "bill" && selectedBillType === "commission" && (
        <CommissionBill onBack={goHome} />
      )}

      {page === "bill" && selectedBillType === "loading" && (
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
          <button
            type="button"
            onClick={goHome}
            className="mb-6 rounded-lg px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
          >
            ← Back to bill types
          </button>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            The Truck Loading Letter template will be built next.
          </div>
        </section>
      )}
    </div>
  );
}
