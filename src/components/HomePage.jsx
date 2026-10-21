
import { FilePlus2, Clock3 } from "lucide-react";
import BillTypeCard from "./BillTypeCard";

export default function HomePage({ onSelectBillType }) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8 sm:py-14">
      <section className="mb-9 max-w-2xl">
        <span className="mb-3 inline-block text-xs font-bold tracking-[0.18em] text-blue-700">
          BILL MANAGEMENT
        </span>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          What would you like to create?
        </h1>

        <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base">
          Choose a bill type to get started. Enter your details
          and prepare a print-ready document.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
              Create a new document
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Select one of the available templates.
            </p>
          </div>

          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <FilePlus2 size={23} />
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <BillTypeCard
            title="Commission Bill"
            description="Create a transport commission bill with freight, deductions, payments, and balance details."
            icon="file"
            onClick={() => onSelectBillType("commission")}
          />

          <BillTypeCard
            title="Truck Loading Letter"
            description="Prepare a truck loading instruction letter with destination, weight, freight, and advance details."
            icon="truck"
            onClick={() => onSelectBillType("loading")}
          />
        </div>
      </section>

      <div className="mt-6 flex items-start gap-3 rounded-xl bg-gray-50 p-4 text-gray-500">
        <Clock3 size={19} className="mt-0.5 shrink-0 text-blue-700" />

        <p className="text-sm leading-6">
          Your recent entries and preferences will be saved in this
          browser when we implement local storage.
        </p>
      </div>
    </main>
  );
}
