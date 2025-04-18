import { useEffect, useState } from "react";
import { fetchLedger } from "../api";
import { Loader2, AlertTriangle, FileX } from "lucide-react";

export default function Ledger() {
  const [ledger, setLedger] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFetching(true);
    fetchLedger()
      .then((data) => {
        setLedger(data);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load ledger entries.");
      })
      .finally(() => {
        setFetching(false);
      });
  }, []);

  return (
    <div className="bg-white p-8 rounded-xl border border-gray-300">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">📚 Ledger Records</h2>

      {error && (
        <div className="flex items-center text-sm text-red-600 bg-red-100 p-3 rounded-md mb-4">
          <AlertTriangle className="mr-2" size={18} />
          {error}
        </div>
      )}

      <div className="overflow-x-auto relative min-h-[100px]">
        {fetching ? (
          <div className="flex items-center justify-center py-12 text-gray-600">
            <Loader2 className="animate-spin mr-2" size={20} />
            Fetching ledger...
          </div>
        ) : ledger.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <FileX size={48} className="mb-2" />
            <p className="text-sm">No ledger records found.</p>
          </div>
        ) : (
          <table className="min-w-full text-sm border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Account</th>
                <th className="px-4 py-3 text-left">Debit</th>
                <th className="px-4 py-3 text-left">Credit</th>
                <th className="px-4 py-3 text-left">Ref Type</th>
                <th className="px-4 py-3 text-left">Ref ID</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((entry) => (
                <tr key={entry.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{entry.id}</td>
                  <td className="px-4 py-3">{entry.posting_date}</td>
                  <td className="px-4 py-3">{entry.account}</td>
                  <td className="px-4 py-3 text-green-700 font-semibold">{entry.debit_amount}</td>
                  <td className="px-4 py-3 text-red-600 font-semibold">{entry.credit_amount}</td>
                  <td className="px-4 py-3">{entry.ref_type}</td>
                  <td className="px-4 py-3">{entry.ref_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
