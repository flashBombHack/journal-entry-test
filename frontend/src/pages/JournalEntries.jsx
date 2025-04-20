import { useEffect, useState } from "react";
import { fetchEntries, createEntry } from "../api";
import {
  Calendar,
  FileText,
  ArrowDownCircle,
  ArrowUpCircle,
  DollarSign,
  Loader2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export default function JournalEntries() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    entry_date: "",
    description: "",
    debit_account: "",
    credit_account: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchEntries()
      .then((data) => setEntries(data))
      .catch((err) => setError(err.message || "Error fetching entries"))
      .finally(() => setFetching(false));
  }, []);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
  
      return () => clearTimeout(timer); 
    }
  }, [error, success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await createEntry(form);
      setForm({
        entry_date: "",
        description: "",
        debit_account: "",
        credit_account: "",
        amount: "",
      });
      const entriesData = await fetchEntries();
      setEntries(entriesData);
      setSuccess("Entry created successfully.");
    } catch (err) {
      setError(err.message || "Failed to create entry.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = Object.values(form).every((val) => String(val).trim() !== "");


  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour12: true,
    });
  };
  return (
    <div className="bg-white p-8 rounded-xl border border-gray-300 ">
      <h2 className="text-2xl font-bold text-gray-700 mb-8">📘 Create Journal Entry</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="date"
              value={form.entry_date}
              onChange={(e) => setForm({ ...form, entry_date: e.target.value })}
              className="pl-10 p-3 border border-gray-300 rounded-md w-full"
              required
            />
          </div>
          <div className="relative">
            <FileText className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="pl-10 p-3 border border-gray-300 rounded-md w-full"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <ArrowDownCircle className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Debit Account"
              value={form.debit_account}
              onChange={(e) => setForm({ ...form, debit_account: e.target.value })}
              className="pl-10 p-3 border border-gray-300 rounded-md w-full"
              required
            />
          </div>
          <div className="relative">
            <ArrowUpCircle className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Credit Account"
              value={form.credit_account}
              onChange={(e) => setForm({ ...form, credit_account: e.target.value })}
              className="pl-10 p-3 border border-gray-300 rounded-md w-full"
              required
            />
          </div>
        </div>
        <div className="relative">
          <DollarSign className="absolute left-3 top-3.5 text-gray-400" size={18} />
          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="pl-10 p-3 border border-gray-300 rounded-md w-full"
            required
          />
        </div>
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`w-full p-3 rounded-md font-medium transition duration-300 focus:outline-none
            ${!isFormValid || loading
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-green-700 text-white hover:bg-green-900"}`
          }
          style={{
            backgroundColor: (!isFormValid || loading) ? "#d1d5db" : "#047857",
          }}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>


      </form>


     {error && (
        <div className="flex items-center mt-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">
          <AlertTriangle className="mr-2" size={18} />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center mt-4 text-sm text-green-700 bg-green-100 p-3 rounded-md">
          <CheckCircle className="mr-2" size={18} />
          {success}
        </div>
      )}

<h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-4">📄 Journal Entries</h2>
<div className="overflow-x-auto relative">
  {fetching ? (
    <div className="flex items-center justify-center py-12 text-gray-600">
      <Loader2 className="animate-spin mr-2" size={20} />
      Fetching entries...
    </div>
  ) : entries.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      <FileText size={48} className="mb-4" />
      <p className="text-lg font-medium">No journal entries found</p>
      <p className="text-sm text-gray-400 mt-1">Start by creating a new entry above.</p>
    </div>
  ) : (
    <table className="min-w-full text-sm border border-gray-200 rounded-md overflow-auto">
      <thead className="bg-gray-100 text-gray-600">
        <tr>
          <th className="text-left px-4 py-3">Date</th>
          <th className="text-left px-4 py-3">Description</th>
          <th className="text-left px-4 py-3">Account</th>
          <th className="text-left px-4 py-3">Debit</th>
          <th className="text-left px-4 py-3">Credit</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((e, i) => (
          <tr key={i} className="border-t hover:bg-gray-50 transition">
            <td className="px-4 py-3">{formatDate(e.entry_date)}</td>
            <td className="px-4 py-3">{e.description}</td>
            <td className="px-4 py-3">{e.account}</td>
            <td className="px-4 py-3 text-green-700 font-bold">{e.debit_amount}</td>
            <td className="px-4 py-3 text-red-600 font-bold">{e.credit_amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>

    </div>
  );
}