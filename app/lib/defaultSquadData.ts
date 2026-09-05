import {
  MicroSquad,
  MacroSquad,
  SquadMember,
  SquadActivityPing,
  SquadProject,
} from "../types/huddle";

export const defaultSquadMembers: SquadMember[] = [];
export const defaultSquadProject: SquadProject | undefined = undefined;
export const defaultActivityPings: SquadActivityPing[] = [];

export const defaultMicroSquad: MicroSquad = {
  id: "squad-1",
  name: "System Architecture Crew",
  skillFocus: "System Architecture",
  sharedGoal: "Complete weekly deliberate engineering sessions.",
  currentProgress: 0,
  targetProgress: 12,
  inviteCode: "HUDDLE-SYS-01",
  members: [],
  activityPings: [],
};

export const defaultMacroSquad: MacroSquad = {
  id: "macro-squad-1",
  name: "Distributed Systems Guild",
  description: "Senior and staff engineers designing distributed systems.",
  trackCategory: "Engineering",
  membersCount: 0,
  members: [],
  milestoneUpdates: [],
};

export const presetAvailableSquads: MicroSquad[] = [];
