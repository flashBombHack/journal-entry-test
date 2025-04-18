import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { BookOpenCheck, BookText } from "lucide-react";
import JournalEntries from "./pages/JournalEntries";
import Ledger from "./pages/Ledger";

function Sidebar() {
  const { pathname } = useLocation();
  const linkClasses = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      pathname === path
        ? "bg-white/10 text-white font-semibold text-white"
        : "hover:bg-white/10 text-gray-300"
    }`;

  return (
    <aside className="bg-gradient-to-b from-gray-900 to-gray-800 w-64 h-screen fixed p-6 border-r border-gray-700">
      <h2 className="text-lg font-bold text-white mb-10">
      Alpharithm
      </h2>
      <nav className="flex flex-col gap-2">
        <Link to="/" className={linkClasses("/")}>
          <BookText className="w-5 h-5" />
          <span className="text-white">Journal Entries</span>
        </Link>
        <Link to="/ledger" className={linkClasses("/ledger")}>
          <BookOpenCheck className="w-5 h-5" />
          <span className="text-white">Ledger</span>
        </Link>
      </nav>
    </aside>
  );
}


export default function App() {
  return (
    <Router>
      <div className="flex w-screen">
        <Sidebar />
        <main className="ml-64 min-h-screen w-full  bg-gray-50 p-6 sm:p-10">
          <Routes>
            <Route path="/" element={<JournalEntries />} />
            <Route path="/ledger" element={<Ledger />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

