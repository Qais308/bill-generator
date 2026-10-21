import { FileText, Home } from "lucide-react";

export default function Navbar({ onGoHome }) {
  return (
    <header className="flex w-full items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 py-3 sm:px-8">
      <button
        type="button"
        onClick={onGoHome}
        aria-label="Go to home page"
        className="flex items-center gap-3 rounded-lg text-left cursor-pointer"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white">
          <FileText size={23} />
        </span>

        <span className="flex flex-col">
          <strong className="text-lg font-bold leading-tight text-gray-900">
            BillCraft
          </strong>
          <span className="text-xs text-gray-500">
            Bill Generator
          </span>
        </span>
      </button>

      <nav className="flex items-center gap-1 sm:gap-3">
        <button
          type="button"
          onClick={onGoHome}
          className="flex items-center gap-1 text-xs font-medium text-blue-700 bg-linear-to-br from-cyan-100 to-blue-200 ring-1 ring-blue-300 hover:ring-2 hover:ring-blue-400 transition-all px-4 py-2 rounded-lg cursor-pointer"
        >
          <Home size={17} />
          <span className="hidden sm:inline">Home</span>
        </button>
      </nav>
    </header>
  );
}