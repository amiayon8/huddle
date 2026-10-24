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
  {
    id: "questionnaire_config",
    name: "Survey Questions Config",
    category: "Core & Auth",
  },
  {
    id: "admin_audit_logs",
    name: "Admin Audit Trail",
    category: "Core & Auth",
  },

  {
    id: "sprints",
    name: "Sprints (4-Day Cadence)",
    category: "Sprints & Drills",
  },
  {
    id: "sprint_tasks",
    name: "Sprint Tasks & Proofs",
    category: "Sprints & Drills",
  },
  {
    id: "focus_sessions",
    name: "Persistent Focus Timer Logs",
    category: "Sprints & Drills",
  },
  {
    id: "task_templates",
    name: "Curriculum Drill Templates",
    category: "Sprints & Drills",
  },
  {
    id: "practice_curriculum",
    name: "Practice Curriculum Modules",
    category: "Sprints & Drills",
  },
  {
    id: "practice_session_progress",
    name: "Session Notes & Code",
    category: "Sprints & Drills",
  },

  { id: "squads", name: "Micro-Squads", category: "Squads & Cohorts" },
  {
    id: "squad_members",
    name: "Squad Memberships",
    category: "Squads & Cohorts",
  },
  {
    id: "squad_activity_pings",
    name: "Daily Standup Pings",
    category: "Squads & Cohorts",
  },
  {
    id: "squad_projects",
    name: "Squad Projects & Repos",
    category: "Squads & Cohorts",
  },
  {
    id: "squad_reports",
    name: "Squad Safety Reports",
    category: "Squads & Cohorts",
  },
  {
    id: "macro_squad_updates",
    name: "Macro Circle Broadcasts",
    category: "Squads & Cohorts",
  },

  {
    id: "community_posts",
    name: "Community Discussions",
    category: "Community",
  },
  {
    id: "creators",
    name: "Curriculum Mentors & Creators",
    category: "Community",
  },
  { id: "creator_posts", name: "Creator Walkthroughs", category: "Community" },

  {
    id: "portfolio_items",
    name: "Verified Portfolio Proofs",
    category: "Career & Reputation",
  },
  {
    id: "real_world_proofs",
    name: "Production Proof Deliverables",
    category: "Career & Reputation",
  },
  {
    id: "career_timeline",
    name: "Career Milestones",
    category: "Career & Reputation",
  },
  {
    id: "skills_health",
    name: "Skill Decay & Health",
    category: "Career & Reputation",
  },

  { id: "roadmaps", name: "Skill Roadmaps", category: "Interactive & Systems" },
  {
    id: "binge_quizzes",
    name: "Anti-Doomscroll Quizzes",
    category: "Interactive & Systems",
  },
  {
    id: "notifications",
    name: "User Notifications",
    category: "Interactive & Systems",
  },
  {
    id: "mascot_messages",
    name: "Spark Mascot Guidance Feed",
    category: "Interactive & Systems",
  },
  {
    id: "search_suggestions",
    name: "Global Search Suggestions",
    category: "Interactive & Systems",
  },
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

  const fetchTableData = async (tableName: string, limit = rowLimit) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/database?table=${encodeURIComponent(tableName)}&limit=${limit}`,
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
      if (categoryFilter !== "all" && t.category !== categoryFilter)
        return false;
      return true;
    });
  }, [catalog, categoryFilter]);

  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return tableData.rows;
    const q = searchQuery.toLowerCase();
    return tableData.rows.filter((row) => {
      return Object.values(row).some((val) => {
        if (val === null || val === undefined) return false;
        if (typeof val === "object")
          return JSON.stringify(val).toLowerCase().includes(q);
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

  const renderCellValue = (colName: string, val: any, rowId?: string) => {
    if (val === null || val === undefined) {
      return (
        <span className="text-[#5D6080]/60 dark:text-[#BBBCE4]/40 italic font-mono text-[11px]">
          null
        </span>
      );
    }

    const lowerCol = colName.toLowerCase();
    const strVal = String(val);

    if (typeof val === "boolean") {
      return (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            val
              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
              : "bg-[#f6f7fc] dark:bg-[#141d33] text-[#5D6080] dark:text-[#BBBCE4]/70"
          }`}
        >
          {strVal}
        </span>
      );
    }

    if (typeof val === "object") {
      const isArr = Array.isArray(val);
      const label = isArr
        ? `[${val.length} items]`
        : `{${Object.keys(val).length} keys}`;
      return (
        <button
          onClick={() =>
            setInspectingJson({
              title: `${tableData.table}.${colName}`,
              data: val,
            })
          }
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#5420A6]/10 dark:bg-[#5420A6]/20 text-[#5420A6] dark:text-[#BBBCE4] hover:bg-[#5420A6]/20 dark:hover:bg-[#5420A6]/30 font-mono text-[10px] font-medium transition-colors cursor-pointer"
        >
          <Code2 className="w-3 h-3" />
          <span>{label}</span>
        </button>
      );
    }

    if (lowerCol.includes("email")) {
      return (
        <span className="font-mono text-[#06427D] dark:text-[#e6e9f7]">
          {maskEmail(strVal, rowId)}
        </span>
      );
    }

    if (
      lowerCol === "id" ||
      lowerCol.endsWith("_id") ||
      lowerCol.includes("token")
    ) {
      return (
        <span
          className="font-mono text-[#5D6080] dark:text-[#BBBCE4]/80"
          title={strVal}
        >
          {maskId(strVal, rowId)}
        </span>
      );
    }

    if (
      lowerCol.includes("_at") ||
      lowerCol.includes("date") ||
      lowerCol.includes("time")
    ) {
      const parsedDate = new Date(strVal);
      if (!isNaN(parsedDate.getTime())) {
        return (
          <span className="font-mono text-[#5D6080] dark:text-[#BBBCE4]/70 text-[11px]" title={strVal}>
            {parsedDate.toLocaleDateString()} {parsedDate.toLocaleTimeString()}
          </span>
        );
      }
    }

    return (
      <span className="truncate max-w-xs block text-[#06427D] dark:text-[#e6e9f7]">
        {strVal}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#5420A6]/10 via-[#BBBCE4]/15 to-[#A9DAF5]/10 border border-[#5420A6]/20 dark:border-[#5420A6]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#5420A6] text-white flex items-center justify-center shadow-xs">
              <Database className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-[#06427D] dark:text-[#BBBCE4]">
              Supabase Database Explorer
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
              26 Tables Live
            </span>
          </div>
          <p className="text-xs text-[#5D6080] dark:text-[#BBBCE4]/80">
            Real-time table viewer for all production PostgreSQL entities,
            survey payloads, and curriculum models.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchTableData(selectedTable, rowLimit)}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#0e1526] text-xs font-semibold text-[#5D6080] dark:text-[#BBBCE4] hover:bg-[#f6f7fc] dark:hover:bg-[#141d33] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#5420A6]" : ""}`}
            />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExportJson}
            disabled={tableData.rows.length === 0}
            className="px-3 py-1.5 rounded-xl bg-[#5420A6] hover:bg-[#5420A6]/90 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Table JSON</span>
          </button>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#5D6080] dark:text-[#BBBCE4]/60 uppercase tracking-wider">
            Database Catalog ({catalog.length} Tables)
          </span>
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors ${
                categoryFilter === "all"
                  ? "bg-[#5420A6] text-white"
                  : "text-[#5D6080] dark:text-[#BBBCE4]/70 hover:text-[#06427D] dark:hover:text-[#BBBCE4]"
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
                    ? "bg-[#5420A6] text-white"
                    : "text-[#5D6080] dark:text-[#BBBCE4]/70 hover:text-[#06427D] dark:hover:text-[#BBBCE4]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {filteredCatalog.map((t) => {
            const isSelected = selectedTable === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleTableSelect(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#FFFFFF] dark:bg-[#141d33] text-[#06427D] dark:text-[#BBBCE4] border-[#5420A6] ring-2 ring-[#5420A6]/20 shadow-sm"
                    : "bg-[#FFFFFF]/70 dark:bg-[#0e1526]/80 border-[#dcdff2] dark:border-[#1d2c4e] text-[#5D6080] dark:text-[#BBBCE4]/70 hover:text-[#06427D] dark:hover:text-[#BBBCE4] hover:border-[#BBBCE4] dark:hover:border-[#5420A6]/50"
                }`}
              >
                <Table
                  className={`w-3.5 h-3.5 ${isSelected ? "text-[#5420A6]" : "text-[#5D6080]/60"}`}
                />
                <span>{t.id}</span>
                {t.rowCount !== undefined && (
                  <span
                    className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded-full tabular-nums ${
                      isSelected
                        ? "bg-[#5420A6]/10 dark:bg-[#5420A6]/30 text-[#5420A6] dark:text-[#BBBCE4]"
                        : "bg-[#f6f7fc] dark:bg-[#141d33] text-[#5D6080] dark:text-[#BBBCE4]/60"
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

      <div className="p-4 rounded-2xl bg-[#FFFFFF] dark:bg-[#0e1526] border border-[#dcdff2] dark:border-[#1d2c4e] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-[#dcdff2] dark:border-[#1d2c4e]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-[#06427D] dark:text-[#BBBCE4]">
              public.{tableData.table}
            </span>
            <span className="text-[11px] text-[#5D6080] dark:text-[#BBBCE4]/70 font-medium">
              Showing {filteredRows.length} of {tableData.totalRows} rows •{" "}
              {tableData.columns.length} columns
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#5D6080]/60 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search within table..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#080c18] text-xs text-[#06427D] dark:text-[#e6e9f7] placeholder-[#5D6080]/60 focus:outline-none focus:ring-2 focus:ring-[#5420A6]/30"
              />
            </div>

            <select
              value={rowLimit}
              onChange={(e) => {
                const limit = parseInt(e.target.value, 10);
                setRowLimit(limit);
                fetchTableData(selectedTable, limit);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#080c18] text-xs text-[#06427D] dark:text-[#e6e9f7] focus:outline-none focus:ring-2 focus:ring-[#5420A6]/30 cursor-pointer"
            >
              <option value={25}>25 rows</option>
              <option value={50}>50 rows</option>
              <option value={100}>100 rows</option>
              <option value={200}>200 rows</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-2">
            <RefreshCw className="w-6 h-6 text-[#5420A6] animate-spin mx-auto" />
            <p className="text-xs text-[#5D6080] dark:text-[#BBBCE4]/70">
              Querying Supabase table data...
            </p>
          </div>
        ) : tableData.error ? (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{tableData.error}</span>
          </div>
        ) : tableData.columns.length === 0 ? (
          <div className="py-12 text-center text-[#5D6080] dark:text-[#BBBCE4]/60 text-xs">
            Table public.{tableData.table} contains 0 records.
          </div>
        ) : (
          <div className="rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-left text-xs divide-y divide-[#dcdff2] dark:divide-[#1d2c4e]">
              <thead className="bg-[#f6f7fc] dark:bg-[#141d33] sticky top-0 z-10 text-[10px] font-bold text-[#5D6080] dark:text-[#BBBCE4]/80 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center text-[#5D6080]/60">
                    #
                  </th>
                  {tableData.columns.map((col) => (
                    <th key={col} className="py-2.5 px-3 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dcdff2]/60 dark:divide-[#1d2c4e]/60 font-sans">
                {filteredRows.map((row, idx) => {
                  const rowId = row.id || `row-${idx}`;
                  return (
                    <tr
                      key={rowId}
                      className="hover:bg-[#f6f7fc]/80 dark:hover:bg-[#141d33]/50 transition-colors"
                    >
                      <td className="py-2.5 px-3 text-center text-[#5D6080]/60 font-mono text-[10px]">
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

      {inspectingJson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-xl max-h-[85vh] bg-[#FFFFFF] dark:bg-[#0e1526] border border-[#dcdff2] dark:border-[#1d2c4e] rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#dcdff2] dark:border-[#1d2c4e]">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#5420A6] dark:text-[#A9DAF5]" />
                <h3 className="text-sm font-bold text-[#06427D] dark:text-[#BBBCE4] font-mono">
                  {inspectingJson.title}
                </h3>
              </div>
              <button
                onClick={() => setInspectingJson(null)}
                className="p-1 rounded-lg text-[#5D6080] hover:text-[#06427D] dark:text-[#BBBCE4]/70 dark:hover:text-[#BBBCE4] hover:bg-[#BBBCE4]/20 dark:hover:bg-[#141d33] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto rounded-xl bg-[#080c18] p-3.5 border border-[#1d2c4e]">
              <pre className="font-mono text-xs text-[#A9DAF5] overflow-x-auto leading-relaxed">
                {JSON.stringify(inspectingJson.data, null, 2)}
              </pre>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#dcdff2] dark:border-[#1d2c4e]">
              <button
                onClick={() => handleCopyJson(inspectingJson.data)}
                className="px-3 py-1.5 rounded-xl bg-[#5420A6] hover:bg-[#5420A6]/90 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
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
                className="px-3 py-1.5 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] text-[#5D6080] dark:text-[#BBBCE4] text-xs font-semibold hover:bg-[#f6f7fc] dark:hover:bg-[#141d33] transition-colors cursor-pointer"
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
