import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export const dynamic = "force-dynamic";

export const KNOWN_DATABASE_TABLES = [
  { id: "profiles", name: "User Profiles & Surveys", category: "Core & Auth", icon: "Users" },
  { id: "questionnaire_config", name: "Survey Questions Config", category: "Core & Auth", icon: "HelpCircle" },
  { id: "admin_audit_logs", name: "Admin Audit Trail", category: "Core & Auth", icon: "History" },
  
  { id: "sprints", name: "Sprints (4-Day Cadence)", category: "Sprints & Drills", icon: "Activity" },
  { id: "sprint_tasks", name: "Sprint Tasks & Proofs", category: "Sprints & Drills", icon: "CheckSquare" },
  { id: "focus_sessions", name: "Persistent Focus Timer Logs", category: "Sprints & Drills", icon: "Clock" },
  { id: "task_templates", name: "Curriculum Drill Templates", category: "Sprints & Drills", icon: "BookOpen" },
  { id: "practice_curriculum", name: "Practice Curriculum Modules", category: "Sprints & Drills", icon: "Layers" },
  { id: "practice_session_progress", name: "Session Notes & Code", category: "Sprints & Drills", icon: "Code" },
  
  { id: "squads", name: "Micro-Squads", category: "Squads & Cohorts", icon: "Users" },
  { id: "squad_members", name: "Squad Memberships", category: "Squads & Cohorts", icon: "UserCheck" },
  { id: "squad_activity_pings", name: "Daily Standup Pings", category: "Squads & Cohorts", icon: "Radio" },
  { id: "squad_projects", name: "Squad Projects & Repos", category: "Squads & Cohorts", icon: "Folder" },
  { id: "squad_reports", name: "Squad Safety Reports", category: "Squads & Cohorts", icon: "AlertTriangle" },
  { id: "macro_squad_updates", name: "Macro Circle Broadcasts", category: "Squads & Cohorts", icon: "Globe" },
  
  { id: "community_posts", name: "Community Discussions", category: "Community", icon: "MessageSquare" },
  { id: "creators", name: "Curriculum Mentors & Creators", category: "Community", icon: "Star" },
  { id: "creator_posts", name: "Creator Walkthroughs", category: "Community", icon: "Video" },
  
  { id: "portfolio_items", name: "Verified Portfolio Proofs", category: "Career & Reputation", icon: "Briefcase" },
  { id: "real_world_proofs", name: "Production Proof Deliverables", category: "Career & Reputation", icon: "Award" },
  { id: "career_timeline", name: "Career Milestones", category: "Career & Reputation", icon: "GitCommit" },
  { id: "skills_health", name: "Skill Decay & Health", category: "Career & Reputation", icon: "HeartPulse" },
  
  { id: "roadmaps", name: "Skill Roadmaps", category: "Interactive & Systems", icon: "Map" },
  { id: "binge_quizzes", name: "Anti-Doomscroll Quizzes", category: "Interactive & Systems", icon: "HelpCircle" },
  { id: "notifications", name: "User Notifications", category: "Interactive & Systems", icon: "Bell" },
  { id: "mascot_messages", name: "Pip Mascot Guidance Feed", category: "Interactive & Systems", icon: "Sparkles" },
  { id: "search_suggestions", name: "Global Search Suggestions", category: "Interactive & Systems", icon: "Search" },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get("table") || "profiles";
    const limit = Math.min(200, parseInt(searchParams.get("limit") || "50", 10));
    const offset = Math.max(0, parseInt(searchParams.get("offset") || "0", 10));
    const action = searchParams.get("action");

    // Action: Return table catalog with live row counts
    if (action === "catalog") {
      const catalogWithCounts = await Promise.all(
        KNOWN_DATABASE_TABLES.map(async (t) => {
          try {
            const { count, error } = await supabase
              .from(t.id)
              .select("*", { count: "exact", head: true });
            return {
              ...t,
              rowCount: error ? 0 : count || 0,
            };
          } catch {
            return { ...t, rowCount: 0 };
          }
        })
      );

      return NextResponse.json({
        success: true,
        tables: catalogWithCounts,
      });
    }

    // Query specific table
    const validTable = KNOWN_DATABASE_TABLES.find((t) => t.id === table);
    const targetTableName = validTable ? validTable.id : "profiles";

    const { data, count, error } = await supabase
      .from(targetTableName)
      .select("*", { count: "exact" })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message, table: targetTableName },
        { status: 400 }
      );
    }

    const rows = data || [];
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

    return NextResponse.json({
      success: true,
      table: targetTableName,
      totalRows: count ?? rows.length,
      limit,
      offset,
      columns,
      rows,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to inspect database" },
      { status: 500 }
    );
  }
}
