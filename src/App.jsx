import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import CompanyDetailsPage from "./components/CompanyDetailsPage";
import CommissionBill from "./templates/CommissionBill";
import LoadingAdviceBill from "./templates/LoadingAdviceBill";
import "./index.css";

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedBillType, setSelectedBillType] = useState(null);

  useEffect(() => {
    window.history.replaceState({ page: "home" }, "");

    const handlePopState = () => {
      setPage("home");
      setSelectedBillType(null);
      window.history.replaceState({ page: "home" }, "");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function handleSelectBillType(type) {
    window.history.pushState({ page: "bill", type }, "");
    setSelectedBillType(type);
    setPage("bill");
  }

  function handleOpenCompanyDetails() {
    window.history.pushState({ page: "company" }, "");
    setPage("company");
  }

  function goHome() {
    setPage("home");
    setSelectedBillType(null);
    window.history.replaceState({ page: "home" }, "");
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7]">
      <Navbar onGoHome={goHome} />

      {page === "home" && (
        <HomePage
          onSelectBillType={handleSelectBillType}
          onOpenCompanySettings={handleOpenCompanyDetails}
        />
      )}

      {page === "company" && (
        <CompanyDetailsPage onBack={goHome} />
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