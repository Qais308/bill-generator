
import { useState } from 'react'
import {
  FileText,
  Download,
  Settings2,
  Eye,
  ReceiptText,
} from 'lucide-react'

function App() {
  const [bill, setBill] = useState({
    billNumber: '001',
    date: new Date().toISOString().slice(0, 10),
    company: 'Himmat Road Ways',
    customer: '',
    vehicle: '',
    from: '',
    to: '',
    weight: '',
    rate: '',
  })

  const updateField = (field, value) => {
    setBill((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const total = (
    Number(bill.weight || 0) * Number(bill.rate || 0)
  ).toFixed(2)

  const fields = [
    { label: 'Bill Number', key: 'billNumber' },
    { label: 'Bill Date', key: 'date', type: 'date' },
    { label: 'Company Name', key: 'company' },
    { label: 'Customer Name', key: 'customer' },
    { label: 'Vehicle Number', key: 'vehicle' },
    { label: 'From', key: 'from' },
    { label: 'To', key: 'to' },
    { label: 'Weight', key: 'weight', type: 'number' },
    { label: 'Rate', key: 'rate', type: 'number' },
  ]

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="flex items-center justify-between border-b bg-white px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-600 p-2 text-white">
            <ReceiptText size={23} />
          </div>
          <div>
            <h1 className="text-xl font-bold">BillCraft</h1>
            <p className="text-xs text-slate-500">
              Simple bill creation
            </p>
          </div>
        </div>

        <button
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          onClick={() => window.print()}
        >
          <Download size={16} />
          Download / Print
        </button>
      </header>

      <main className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Bill Editor</h2>
          <p className="mt-1 text-sm text-slate-500">
            Enter your details and see the bill update instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Settings2 className="text-blue-600" size={20} />
              <h3 className="text-lg font-semibold">Bill Details</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {fields.map((field) => (
                <label
                  key={field.key}
                  className="flex flex-col gap-1.5"
                >
                  <span className="text-sm font-medium text-slate-600">
                    {field.label}
                  </span>
                  <input
                    type={field.type || 'text'}
                    min={field.type === 'number' ? '0' : undefined}
                    step={field.type === 'number' ? 'any' : undefined}
                    value={bill[field.key]}
                    onChange={(event) =>
                      updateField(field.key, event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="min-w-0">
            <div className="mb-3 flex items-center gap-2">
              <Eye className="text-blue-600" size={20} />
              <h3 className="text-lg font-semibold">Live Preview</h3>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="mx-auto min-w-[300px] max-w-[600px] border-2 border-black p-4 text-sm text-black sm:p-6">
                <div className="border-b-2 border-black pb-4 text-center">
                  <h2 className="text-2xl font-bold uppercase">
                    {bill.company || 'Company Name'}
                  </h2>
                  <p className="mt-2 font-semibold">
                    TRANSPORT BILL
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 border-b border-black py-3">
                  <p>
                    <strong>Bill No:</strong> {bill.billNumber}
                  </p>
                  <p className="text-right">
                    <strong>Date:</strong> {bill.date}
                  </p>
                </div>

                <div className="space-y-3 border-b border-black py-4">
                  <p>
                    <strong>Customer:</strong>{' '}
                    {bill.customer || '—'}
                  </p>
                  <p>
                    <strong>Vehicle No:</strong>{' '}
                    {bill.vehicle || '—'}
                  </p>
                  <p>
                    <strong>From:</strong> {bill.from || '—'}
                  </p>
                  <p>
                    <strong>To:</strong> {bill.to || '—'}
                  </p>
                </div>

                <table className="mt-4 w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-black p-2 text-left">
                        Description
                      </th>
                      <th className="border border-black p-2 text-right">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-black p-2">
                        Weight: {bill.weight || '0'}
                      </td>
                      <td className="border border-black p-2 text-right">
                        ₹{Number(bill.weight || 0).toLocaleString('en-IN')}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-black p-2">
                        Rate: ₹{bill.rate || '0'}
                      </td>
                      <td className="border border-black p-2 text-right">
                        ₹{total}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="mt-4 border-t-2 border-black pt-3 text-right">
                  <p className="text-lg font-bold">
                    Total: ₹{Number(total).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div className="mt-12 border-t border-black pt-3 text-right">
                  <p className="font-semibold">
                    Authorised Signature
                  </p>
                </div>
              </div>
            </div>
            <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
              <FileText size={14} />
              Preview updates automatically as you edit the form.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
