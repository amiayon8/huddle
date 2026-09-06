"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Database,
  Search,
  RefreshCw,
  Download,
  Code2,
  Copy,
  Check,
  X,
  Eye,
  EyeOff,
  Filter,
  Layers,
  Table,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

interface DatabaseExplorerViewProps {
  privacySafeMode: boolean;
  isRevealed: (id: string) => boolean;
  toggleRevealItem: (id: string) => void;
  maskEmail: (email: string, id?: string) => string;
  maskId: (id: string, customItemId?: string) => string;
  truncateId: (id: string) => string;
}

export const KNOWN_DATABASE_TABLES = [
  { id: "profiles", name: "User Profiles & Surveys", category: "Core & Auth" },
  { id: "questionnaire_config", name: "Survey Questions Config", category: "Core & Auth" },
  { id: "admin_audit_logs", name: "Admin Audit Trail", category: "Core & Auth" },
  
  { id: "sprints", name: "Sprints (4-Day Cadence)", category: "Sprints & Drills" },
  { id: "sprint_tasks", name: "Sprint Tasks & Proofs", category: "Sprints & Drills" },
  { id: "task_templates", name: "Curriculum Drill Templates", category: "Sprints & Drills" },
  { id: "practice_curriculum", name: "Practice Curriculum Modules", category: "Sprints & Drills" },
  { id: "practice_session_progress", name: "Session Notes & Code", category: "Sprints & Drills" },
  
  { id: "squads", name: "Micro-Squads", category: "Squads & Cohorts" },
  { id: "squad_members", name: "Squad Memberships", category: "Squads & Cohorts" },
  { id: "squad_activity_pings", name: "Daily Standup Pings", category: "Squads & Cohorts" },
  { id: "squad_projects", name: "Squad Projects & Repos", category: "Squads & Cohorts" },
  { id: "squad_reports", name: "Squad Safety Reports", category: "Squads & Cohorts" },
  { id: "macro_squad_updates", name: "Macro Circle Broadcasts", category: "Squads & Cohorts" },
  
  { id: "community_posts", name: "Community Discussions", category: "Community" },
  { id: "creators", name: "Curriculum Mentors & Creators", category: "Community" },
  { id: "creator_posts", name: "Creator Walkthroughs", category: "Community" },
  
  { id: "portfolio_items", name: "Verified Portfolio Proofs", category: "Career & Reputation" },
  { id: "real_world_proofs", name: "Production Proof Deliverables", category: "Career & Reputation" },
  { id: "career_timeline", name: "Career Milestones", category: "Career & Reputation" },
  { id: "skills_health", name: "Skill Decay & Health", category: "Career & Reputation" },
  
  { id: "roadmaps", name: "Skill Roadmaps", category: "Interactive & Systems" },
  { id: "binge_quizzes", name: "Anti-Doomscroll Quizzes", category: "Interactive & Systems" },
  { id: "notifications", name: "User Notifications", category: "Interactive & Systems" },
  { id: "mascot_messages", name: "Pip Mascot Guidance Feed", category: "Interactive & Systems" },
  { id: "search_suggestions", name: "Global Search Suggestions", category: "Interactive & Systems" },
];

export const DatabaseExplorerView: React.FC<DatabaseExplorerViewProps> = ({
  privacySafeMode,
  isRevealed,
  toggleRevealItem,
  maskEmail,
  maskId,
  truncateId,
}) => {
  const [selectedTable, setSelectedTable] = useState("profiles");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [rowLimit, setRowLimit] = useState(50);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<{
    table: string;
    columns: string[];
    rows: any[];
    totalRows: number;
    error?: string;
  }>({
    table: "profiles",
    columns: [],
    rows: [],
    totalRows: 0,
  });

  const [catalog, setCatalog] = useState<
    Array<{ id: string; name: string; category: string; rowCount?: number }>
  >(KNOWN_DATABASE_TABLES);

  const [inspectingJson, setInspectingJson] = useState<{
    title: string;
    data: any;
  } | null>(null);

  const [copiedJson, setCopiedJson] = useState(false);

  // Fetch table data
  const fetchTableData = async (tableName: string, limit = rowLimit) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/database?table=${encodeURIComponent(tableName)}&limit=${limit}`
      );
      const json = await res.json();
      if (json.success) {
        setTableData({
          table: json.table,
          columns: json.columns || [],
          rows: json.rows || [],
          totalRows: json.totalRows ?? (json.rows?.length || 0),
        });
        setSelectedTable(json.table);
      } else {
        setTableData((prev) => ({
          ...prev,
          error: json.error || "Failed to query table",
        }));
      }
    } catch (err: any) {
      setTableData((prev) => ({
        ...prev,
        error: err.message || "Failed to fetch table data",
      }));
    } finally {
      setLoading(false);
    }
  };

  // Fetch catalog with counts
  const fetchCatalog = async () => {
    try {
      const res = await fetch("/api/admin/database?action=catalog");
      const json = await res.json();
      if (json.success && json.tables) {
        setCatalog(json.tables);
      }
    } catch (err) {
      console.error("Failed to load catalog:", err);
    }
  };

  useEffect(() => {
    fetchCatalog();
    fetchTableData(selectedTable);
  }, []);

  const handleTableSelect = (tableId: string) => {
    setSelectedTable(tableId);
    fetchTableData(tableId, rowLimit);
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    catalog.forEach((t) => set.add(t.category));
    return Array.from(set);
  }, [catalog]);

  const filteredCatalog = useMemo(() => {
    return catalog.filter((t) => {
      if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
      return true;
    });
  }, [catalog, categoryFilter]);

  // Search filter across loaded rows
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return tableData.rows;
    const q = searchQuery.toLowerCase();
    return tableData.rows.filter((row) => {
      return Object.values(row).some((val) => {
        if (val === null || val === undefined) return false;
        if (typeof val === "object") return JSON.stringify(val).toLowerCase().includes(q);
        return String(val).toLowerCase().includes(q);
      });
    });
  }, [tableData.rows, searchQuery]);

  const handleExportJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(tableData.rows, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${tableData.table}_export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyJson = (data: any) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  // Render dynamic cell value
  const renderCellValue = (colName: string, val: any, rowId?: string) => {
    if (val === null || val === undefined) {
      return <span className="text-zinc-400 dark:text-zinc-600 italic font-mono text-[11px]">null</span>;
    }

    const lowerCol = colName.toLowerCase();
    const strVal = String(val);

    if (typeof val === "boolean") {
      return (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            val
              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
          }`}
        >
          {strVal}
        </span>
      );
    }

    if (typeof val === "object") {
      const isArr = Array.isArray(val);
      const label = isArr ? `[${val.length} items]` : `{${Object.keys(val).length} keys}`;
      return (
        <button
          onClick={() =>
            setInspectingJson({ title: `${tableData.table}.${colName}`, data: val })
          }
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 font-mono text-[10px] font-medium transition-colors cursor-pointer"
        >
          <Code2 className="w-3 h-3" />
          <span>{label}</span>
        </button>
      );
    }

    if (lowerCol.includes("email")) {
      return (
        <span className="font-mono text-zinc-700 dark:text-zinc-300">
          {maskEmail(strVal, rowId)}
        </span>
      );
    }

    if (lowerCol === "id" || lowerCol.endsWith("_id") || lowerCol.includes("token")) {
      return (
        <span className="font-mono text-zinc-600 dark:text-zinc-400" title={strVal}>
          {maskId(strVal, rowId)}
        </span>
      );
    }

    // Timestamps
    if (lowerCol.includes("_at") || lowerCol.includes("date") || lowerCol.includes("time")) {
      const parsedDate = new Date(strVal);
      if (!isNaN(parsedDate.getTime())) {
        return (
          <span className="font-mono text-zinc-500 text-[11px]" title={strVal}>
            {parsedDate.toLocaleDateString()} {parsedDate.toLocaleTimeString()}
          </span>
        );
      }
    }

    return <span className="truncate max-w-xs block text-zinc-800 dark:text-zinc-200">{strVal}</span>;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner: Database Architecture */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/5 border border-indigo-200/70 dark:border-indigo-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Database className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-zinc-950 dark:text-white">
              Supabase Database Explorer
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
              26 Tables Live
            </span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Real-time table viewer for all production PostgreSQL entities, survey payloads, and curriculum models.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchTableData(selectedTable, rowLimit)}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#181a26] text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-indigo-500" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExportJson}
            disabled={tableData.rows.length === 0}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Table JSON</span>
          </button>
        </div>
      </div>

      {/* Table Category Rail */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            Database Catalog ({catalog.length} Tables)
          </span>
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors ${
                categoryFilter === "all"
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors ${
                  categoryFilter === cat
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table Selector Pills */}
        <div className="flex flex-wrap gap-2">
          {filteredCatalog.map((t) => {
            const isSelected = selectedTable === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleTableSelect(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white dark:bg-[#181a26] text-zinc-950 dark:text-white border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm"
                    : "bg-white/60 dark:bg-[#0e1019]/60 border-zinc-200/80 dark:border-white/[0.06] text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <Table className={`w-3.5 h-3.5 ${isSelected ? "text-indigo-500" : "text-zinc-400"}`} />
                <span>{t.id}</span>
                {t.rowCount !== undefined && (
                  <span
                    className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded-full tabular-nums ${
                      isSelected
                        ? "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {t.rowCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Data Viewport */}
      <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#0e1019]/80 backdrop-blur-xl border border-zinc-200/70 dark:border-white/[0.07] shadow-sm space-y-4">
        {/* Table Controls Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-zinc-950 dark:text-white">
              public.{tableData.table}
            </span>
            <span className="text-[11px] text-zinc-500 font-medium">
              Showing {filteredRows.length} of {tableData.totalRows} rows • {tableData.columns.length} columns
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search within table..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0b10] text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            {/* Limit Selector */}
            <select
              value={rowLimit}
              onChange={(e) => {
                const limit = parseInt(e.target.value, 10);
                setRowLimit(limit);
                fetchTableData(selectedTable, limit);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0b10] text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
            >
              <option value={25}>25 rows</option>
              <option value={50}>50 rows</option>
              <option value={100}>100 rows</option>
              <option value={200}>200 rows</option>
            </select>
          </div>
        </div>

        {/* Data Grid */}
        {loading ? (
          <div className="py-16 text-center space-y-2">
            <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin mx-auto" />
            <p className="text-xs text-zinc-500">Querying Supabase table data...</p>
          </div>
        ) : tableData.error ? (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{tableData.error}</span>
          </div>
        ) : tableData.columns.length === 0 ? (
          <div className="py-12 text-center text-zinc-400 text-xs">
            Table public.{tableData.table} contains 0 records.
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-left text-xs divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
              <thead className="bg-zinc-100/80 dark:bg-white/[0.04] sticky top-0 z-10 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center text-zinc-400">#</th>
                  {tableData.columns.map((col) => (
                    <th key={col} className="py-2.5 px-3 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/40 dark:divide-zinc-800/40 font-sans">
                {filteredRows.map((row, idx) => {
                  const rowId = row.id || `row-${idx}`;
                  return (
                    <tr
                      key={rowId}
                      className="hover:bg-zinc-50/70 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-2.5 px-3 text-center text-zinc-400 font-mono text-[10px]">
                        {idx + 1}
                      </td>
                      {tableData.columns.map((col) => (
                        <td key={col} className="py-2.5 px-3 whitespace-nowrap">
                          {renderCellValue(col, row[col], rowId)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RAW JSON INSPECTOR MODAL */}
      {inspectingJson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-xl max-h-[85vh] bg-white dark:bg-[#11131e] border border-zinc-200 dark:border-white/[0.1] rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white font-mono">
                  {inspectingJson.title}
                </h3>
              </div>
              <button
                onClick={() => setInspectingJson(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto rounded-xl bg-zinc-950 p-3.5 border border-zinc-800">
              <pre className="font-mono text-xs text-indigo-300 overflow-x-auto leading-relaxed">
                {JSON.stringify(inspectingJson.data, null, 2)}
              </pre>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => handleCopyJson(inspectingJson.data)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedJson ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setInspectingJson(null)}
                className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
