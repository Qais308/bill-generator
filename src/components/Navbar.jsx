import { FileText, Home } from "lucide-react";

export default function Navbar({ onGoHome }) {
  return (
    <header className="flex w-full items-center justify-between gap-4 border-b border-amber-200/60 bg-[#fdfbf7]/90 px-4 py-3 backdrop-blur-md sm:px-8">
      {/* Brand Logo & Name */}
      <button
        type="button"
        onClick={onGoHome}
        aria-label="Go to home page"
        className="flex items-center gap-3 rounded-lg text-left cursor-pointer"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-amber-950 shadow-xs">
          <FileText size={22} />
        </span>

        <span className="flex flex-col">
          <strong className="text-lg font-bold leading-tight text-gray-900">
            BillCraft
          </strong>
          <span className="text-xs text-amber-800/80 font-medium">
            Bill Generator
          </span>
        </span>
      </button>

      {/* Navigation */}
      <nav className="flex items-center gap-1 sm:gap-3">
        <button
          type="button"
          onClick={onGoHome}
          className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 bg-amber-100/80 hover:bg-amber-200/80 ring-1 ring-amber-300/80 hover:ring-amber-400 transition-all px-4 py-2 rounded-xl cursor-pointer shadow-2xs"
        >
          <Home size={16} className="text-amber-800" />
          <span className="hidden sm:inline">Home</span>
        </button>
      </nav>
    </header>
  );
}