import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import CommissionBill from "./templates/CommissionBill";
import LoadingAdviceBill from "./templates/LoadingAdviceBill";
import "./index.css";

export default function App() {
  // 1. ALWAYS start on "home" when the app is freshly opened/refreshed
  const [page, setPage] = useState("home");
  const [selectedBillType, setSelectedBillType] = useState(null);

  // 2. Handle browser/mobile back button gracefully
  useEffect(() => {
    // Push an initial history entry when the app loads
    window.history.replaceState({ page: "home" }, "");

    const handlePopState = (event) => {
      // If the user clicks back while on a bill page, return home instead of exiting site
      setPage("home");
      setSelectedBillType(null);
      // Ensure history state stays synchronized
      window.history.replaceState({ page: "home" }, "");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function handleSelectBillType(type) {
    // Push a new history state when entering a bill so the back button can catch it
    window.history.pushState({ page: "bill", type }, "");
    setSelectedBillType(type);
    setPage("bill");
  }

  function goHome() {
    setPage("home");
    setSelectedBillType(null);
    window.history.replaceState({ page: "home" }, "");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onGoHome={goHome} />

      {page === "home" && (
        <HomePage onSelectBillType={handleSelectBillType} />
      )}

      {page === "bill" && selectedBillType === "commission" && (
        <CommissionBill onBack={goHome} />
      )}

      {page === "bill" && selectedBillType === "loading" && (
        <LoadingAdviceBill onBack={goHome} />
      )}
    </div>
  );
}