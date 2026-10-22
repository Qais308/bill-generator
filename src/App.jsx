// import { useState, useEffect, useRef } from "react";
// import Navbar from "./components/Navbar";
// import HomePage from "./components/HomePage";
// import CompanyDetailsPage from "./components/CompanyDetailsPage";
// import CommissionBill from "./templates/CommissionBill";
// import LoadingAdviceBill from "./templates/LoadingAdviceBill";
// import "./index.css";

// export default function App() {
//   // 1. Initialize state from browser history so page refreshes don't reset to home
//   const [page, setPage] = useState(() => window.history.state?.page || "home");
//   const [selectedBillType, setSelectedBillType] = useState(() => window.history.state?.billType || null);
//   const [returnPage, setReturnPage] = useState(() => window.history.state?.fromPage || "home");
  
//   // Track unsaved changes globally for browser history interception
//   const unsavedChangesRef = useRef(false);

//   useEffect(() => {
//     // Only set initial history state if none exists yet (prevents breaking reloads)
//     if (!window.history.state) {
//       window.history.replaceState({ page: "home", billType: null, fromPage: "home" }, "");
//     }

//     const handlePopState = (event) => {
//       // 🛡️ Only prompt if we are currently ON the bill page and trying to leave it with unsaved changes
//       if (page === "bill" && unsavedChangesRef.current) {
//         const confirmLeave = window.confirm(
//           "You have unsaved changes in your bill. Are you sure you want to leave?"
//         );
//         if (!confirmLeave) {
//           // User canceled: push state back to lock them on the bill page
//           window.history.pushState({ page: "bill", billType: selectedBillType, fromPage: returnPage }, "");
//           return;
//         }
//       }

//       const state = event.state;
//       if (state && state.page) {
//         setPage(state.page);
//         setSelectedBillType(state.billType || null);
//         setReturnPage(state.fromPage || "home");
//       } else {
//         setPage("home");
//         setSelectedBillType(null);
//         setReturnPage("home");
//       }
//     };

//     window.addEventListener("popstate", handlePopState);
//     return () => window.removeEventListener("popstate", handlePopState);
//   }, [page, selectedBillType, returnPage]);

//   function handleSelectBillType(type) {
//     const newState = { page: "bill", billType: type, fromPage: "home" };
//     window.history.pushState(newState, "");
//     setSelectedBillType(type);
//     setPage("bill");
//     setReturnPage("home");
//   }

//   function handleOpenCompanyDetails(fromPage = "home") {
//     const newState = { page: "company", billType: selectedBillType, fromPage };
//     window.history.pushState(newState, "");
//     setReturnPage(fromPage);
//     setPage("company");
//   }

//   function handleBackFromCompany() {
//     if (returnPage === "bill") {
//       if (window.history.state?.page === "company") {
//         window.history.back();
//       } else {
//         setPage("bill");
//         setReturnPage("home");
//       }
//     } else {
//       goHome();
//     }
//   }

//   function goHome() {
//     const newState = { page: "home", billType: null, fromPage: "home" };
//     window.history.replaceState(newState, "");
//     setPage("home");
//     setSelectedBillType(null);
//     setReturnPage("home");
//   }

//   return (
//     <div className="min-h-screen bg-[#fdfbf7]">
//       <Navbar onGoHome={goHome} />

//       {page === "home" && (
//         <HomePage
//           onSelectBillType={handleSelectBillType}
//           onOpenCompanySettings={() => handleOpenCompanyDetails("home")}
//         />
//       )}

//       {page === "company" && (
//         <CompanyDetailsPage onBack={handleBackFromCompany} />
//       )}

//       {page === "bill" && selectedBillType === "commission" && (
//         <CommissionBill 
//           onBack={goHome} 
//           onOpenCompanySettings={() => handleOpenCompanyDetails("bill")}
//           onUnsavedChangesChange={(val) => { unsavedChangesRef.current = val; }}
//         />
//       )}

//       {page === "bill" && selectedBillType === "loading" && (
//         <LoadingAdviceBill onBack={goHome} />
//       )}
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import CompanyDetailsPage from "./components/CompanyDetailsPage";
import CommissionBill from "./templates/CommissionBill";
import LoadingAdviceBill from "./templates/LoadingAdviceBill";
import "./index.css";

export default function App() {
  // 1. Initialize state from browser history so page refreshes don't reset to home
  const [page, setPage] = useState(() => window.history.state?.page || "home");
  const [selectedBillType, setSelectedBillType] = useState(() => window.history.state?.billType || null);
  const [returnPage, setReturnPage] = useState(() => window.history.state?.fromPage || "home");
  
  // Track unsaved changes globally for browser history interception
  const unsavedChangesRef = useRef(false);

  useEffect(() => {
    // Only set initial history state if none exists yet (prevents breaking reloads)
    if (!window.history.state) {
      window.history.replaceState({ page: "home", billType: null, fromPage: "home" }, "");
    }

    const handlePopState = (event) => {
      // 🛡️ Only prompt if we are currently ON the bill page and trying to leave it with unsaved changes
      if (page === "bill" && unsavedChangesRef.current) {
        const confirmLeave = window.confirm(
          "You have unsaved changes in your bill. Are you sure you want to leave?"
        );
        if (!confirmLeave) {
          // User canceled: push state back to lock them on the bill page
          window.history.pushState({ page: "bill", billType: selectedBillType, fromPage: returnPage }, "");
          return;
        }
      }

      const state = event.state;
      if (state && state.page) {
        setPage(state.page);
        setSelectedBillType(state.billType || null);
        setReturnPage(state.fromPage || "home");
      } else {
        setPage("home");
        setSelectedBillType(null);
        setReturnPage("home");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [page, selectedBillType, returnPage]);

  function handleSelectBillType(type) {
    const newState = { page: "bill", billType: type, fromPage: "home" };
    window.history.pushState(newState, "");
    setSelectedBillType(type);
    setPage("bill");
    setReturnPage("home");
  }

  function handleOpenCompanyDetails(fromPage = "home") {
    const newState = { page: "company", billType: selectedBillType, fromPage };
    window.history.pushState(newState, "");
    setReturnPage(fromPage);
    setPage("company");
  }

  function handleBackFromCompany() {
    if (returnPage === "bill") {
      if (window.history.state?.page === "company") {
        window.history.back();
      } else {
        setPage("bill");
        setReturnPage("home");
      }
    } else {
      goHome();
    }
  }

  function goHome() {
    const newState = { page: "home", billType: null, fromPage: "home" };
    window.history.replaceState(newState, "");
    setPage("home");
    setSelectedBillType(null);
    setReturnPage("home");
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7]">
      <Navbar onGoHome={goHome} />

      {page === "home" && (
        <HomePage
          onSelectBillType={handleSelectBillType}
          onOpenCompanySettings={() => handleOpenCompanyDetails("home")}
        />
      )}

      {page === "company" && (
        <CompanyDetailsPage onBack={handleBackFromCompany} />
      )}

      {page === "bill" && selectedBillType === "commission" && (
        <CommissionBill 
          onBack={goHome} 
          onOpenCompanySettings={() => handleOpenCompanyDetails("bill")}
          onUnsavedChangesChange={(val) => { unsavedChangesRef.current = val; }}
        />
      )}

      {page === "bill" && selectedBillType === "loading" && (
        <LoadingAdviceBill 
          onBack={goHome} 
          onOpenCompanySettings={() => handleOpenCompanyDetails("bill")}
          onUnsavedChangesChange={(val) => { unsavedChangesRef.current = val; }}
        />
      )}
    </div>
  );
}