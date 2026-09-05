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
  skillCategory: "Backend & Systems",
  avatar: "/avatars/avatar-1.svg",
  members: [],
  activityPings: [],
  focusTrack: "System Architecture",
  sprintNumber: 1,
  inviteCode: "HUDDLE-SYS-01",
  createdAt: new Date().toISOString(),
};

export const defaultMacroSquad: MacroSquad = {
  id: "macro-squad-1",
  name: "Distributed Systems Guild",
  skillCategory: "Engineering",
  memberCount: 0,
  description: "Senior and staff engineers designing distributed systems.",
  members: [],
  milestoneUpdates: [],
};

export const presetAvailableSquads: MicroSquad[] = [];
