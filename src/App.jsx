import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import CommissionBill from "./templates/CommissionBill";
import LoadingAdviceBill from "./templates/LoadingAdviceBill";
import "./index.css";

export default function App() {
  const [page, setPage] = useState(() => {
    return localStorage.getItem("app_page") || "home";
  });
  const [selectedBillType, setSelectedBillType] = useState(() => {
    return localStorage.getItem("app_bill_type") || null;
  });

  // Sync page and bill type changes to localStorage
  useEffect(() => {
    if (page === "home") {
      localStorage.removeItem("app_page");
      localStorage.removeItem("app_bill_type");
    } else {
      localStorage.setItem("app_page", page);
      if (selectedBillType) {
        localStorage.setItem("app_bill_type", selectedBillType);
      }
    }
  }, [page, selectedBillType]);

  // Back-button handler for browser history management
  useEffect(() => {
    const handlePopState = () => {
      setPage("home");
      setSelectedBillType(null);
      localStorage.removeItem("app_page");
      localStorage.removeItem("app_bill_type");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function handleSelectBillType(type) {
    window.history.pushState({ page: "bill", type }, "");
    setSelectedBillType(type);
    setPage("bill");
  }

  function goHome() {
    setPage("home");
    setSelectedBillType(null);
    localStorage.removeItem("app_page");
    localStorage.removeItem("app_bill_type");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onGoHome={goHome}
      />

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