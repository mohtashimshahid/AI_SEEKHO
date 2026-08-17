"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Upload, CheckCircle2, AlertTriangle, FileSpreadsheet, RefreshCw, Info, Download } from "lucide-react";

interface UnparsedRowError {
  sheet: string;
  row_number: number;
  raw_data: Record<string, any>;
  reason: string;
}

interface IngestionSummary {
  id: string;
  filename: string;
  status: string;
  total_rows: number;
  parsed_sections: number;
  error_count: number;
  unparsed_errors: UnparsedRowError[];
  created_at: string;
}

export default function AdminIngestionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<IngestionSummary | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8000/api/v1/ingestion/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Ingestion failed");
      }

      const data: IngestionSummary = await res.json();
      setSummary(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1712] text-[#f3f4f3] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="border-b border-[#23352a] pb-6">
          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#f3f4f3]">
            Admin Master Timetable Ingestion
          </h1>
          <p className="text-[#9ea8a1] text-sm mt-1">
            Upload the university master Excel spreadsheet (.xlsx, one sheet per day). The ingestion engine parses sections and logs unparseable rows for manual review.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Upload Dropzone Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#16221b] rounded-xl border border-[#23352a] p-6 space-y-5 shadow-xl">
              <h3 className="font-serif-display text-xl font-bold text-[#f3f4f3] flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#D4AF37]" />
                <span>Upload Spreadsheet</span>
              </h3>

              {/* Drag & Drop Area */}
              <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#23352a] hover:border-[#D4AF37] rounded-xl cursor-pointer bg-[#0e1712] transition-all group">
                <Upload className="w-10 h-10 text-[#9ea8a1] group-hover:text-[#D4AF37] mb-3 transition-colors" />
                <span className="text-sm font-semibold text-[#f3f4f3] group-hover:text-[#D4AF37]">
                  {file ? file.name : "Click or drag master .xlsx spreadsheet"}
                </span>
                <span className="text-xs text-[#9ea8a1] mt-1 font-mono-data">Supports multi-sheet day tabs</span>
                <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="hidden" />
              </label>

              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-[#0e1712] font-semibold text-sm shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                <span>{loading ? "Parsing Master Excel..." : "Parse & Ingest Spreadsheet"}</span>
              </button>
            </div>
          </div>

          {/* Ingestion Summary & Error Logging Report */}
          <div className="lg:col-span-7 space-y-6">
            {!summary ? (
              <div className="text-center py-20 bg-[#16221b] rounded-xl border border-[#23352a] text-[#9ea8a1] space-y-3">
                <Info className="w-10 h-10 mx-auto text-[#D4AF37]" />
                <h4 className="font-serif-display text-lg font-bold text-[#f3f4f3]">No Ingestion Run Yet</h4>
                <p className="text-xs max-w-sm mx-auto">
                  Upload a master spreadsheet to view live parsing counts, section extraction, and bad row flags.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Summary Metrics Bar */}
                <div className="bg-[#16221b] p-6 rounded-xl border border-[#23352a] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#9ea8a1] font-mono-data">Ingestion Status:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-mono-data font-bold uppercase tracking-wider ${
                            summary.status === "SUCCESS"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {summary.status}
                        </span>
                        <span className="text-xs text-[#9ea8a1] font-mono-data">{summary.filename}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#23352a] text-center font-mono-data">
                    <div className="p-3 bg-[#0e1712] rounded-lg border border-[#23352a]">
                      <span className="text-xs text-[#9ea8a1] block">Total Rows</span>
                      <span className="text-lg font-bold text-[#f3f4f3]">{summary.total_rows}</span>
                    </div>
                    <div className="p-3 bg-[#0e1712] rounded-lg border border-[#23352a]">
                      <span className="text-xs text-[#9ea8a1] block">Parsed Sections</span>
                      <span className="text-lg font-bold text-[#D4AF37]">{summary.parsed_sections}</span>
                    </div>
                    <div className="p-3 bg-[#0e1712] rounded-lg border border-[#23352a]">
                      <span className="text-xs text-[#9ea8a1] block">Unparsed Errors</span>
                      <span className="text-lg font-bold text-amber-400">{summary.error_count}</span>
                    </div>
                  </div>
                </div>

                {/* Unparsed Errors Table (§6.1 Manual Review Requirement) */}
                {summary.unparsed_errors.length > 0 && (
                  <div className="bg-[#16221b] p-6 rounded-xl border border-[#23352a] space-y-4">
                    <h4 className="font-serif-display text-lg font-bold text-[#f3f4f3] flex items-center gap-2 text-amber-400">
                      <AlertTriangle className="w-5 h-5" />
                      <span>Unparsed Rows Logged for Manual Review ({summary.unparsed_errors.length})</span>
                    </h4>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono-data border-collapse">
                        <thead>
                          <tr className="border-b border-[#23352a] text-[#9ea8a1] bg-[#0e1712]">
                            <th className="p-2.5">Sheet</th>
                            <th className="p-2.5">Row #</th>
                            <th className="p-2.5">Reason</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#23352a]/60 text-[#f3f4f3]">
                          {summary.unparsed_errors.map((err, idx) => (
                            <tr key={idx} className="hover:bg-[#0e1712]/50">
                              <td className="p-2.5 text-[#D4AF37]">{err.sheet}</td>
                              <td className="p-2.5">{err.row_number}</td>
                              <td className="p-2.5 text-amber-300">{err.reason}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}
