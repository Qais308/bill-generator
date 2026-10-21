
import { FileText, Truck, ArrowRight } from "lucide-react";

export default function BillTypeCard({
  title,
  description,
  icon,
  onClick,
}) {
  const Icon = icon === "truck" ? Truck : FileText;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-32 w-full items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 text-left transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-6"
    >
      <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-100">
        <Icon size={27} />
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-2">
        <span className="text-base font-semibold text-gray-900 sm:text-lg">
          {title}
        </span>

        <span className="text-sm leading-6 text-gray-500">
          {description}
        </span>
      </span>

      <ArrowRight
        size={20}
        className="shrink-0 text-gray-400 transition group-hover:translate-x-1 group-hover:text-blue-700"
      />
    </button>
  );
}
