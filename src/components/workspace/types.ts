/**
 * Single task state machine — the one source of truth used by both the task
 * rows inside a category and the task detail page.
 */
export type TaskStatus =
  | "Not Started"
  | "Active"
  | "Paused"
  | "Under Review"
  | "Held"
  | "Completed";

export const TASK_STATUSES: TaskStatus[] = [
  "Not Started",
  "Active",
  "Paused",
  "Under Review",
  "Held",
  "Completed",
];

/** Palette-aligned colors for every task status. */
export const TASK_STATUS_STYLE: Record<
  TaskStatus,
  { color: string; background: string }
> = {
  "Not Started": { color: "#777b78", background: "rgba(119, 123, 120, 0.14)" },
  Active: { color: "#2f6664", background: "rgba(57, 122, 120, 0.14)" },
  Paused: { color: "#777b78", background: "rgba(119, 123, 120, 0.14)" },
  "Under Review": { color: "#4f8b88", background: "rgba(111, 166, 162, 0.2)" },
  Held: { color: "#9b7f4c", background: "rgba(197, 164, 109, 0.18)" },
  Completed: { color: "#4b7a5f", background: "rgba(95, 146, 116, 0.16)" },
};

export type ActivityIcon = "created" | "request";

export type ActivityEntry = {
  icon: ActivityIcon;
  text: string;
  /** ISO timestamp of the event. */
  timestamp: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  owner: string;
  deadline: string;
  /** Estimated time range, e.g. "8h – 16h". */
  estTime?: string;
  status: TaskStatus;
  activity?: ActivityEntry[];
};

export type Category = {
  id: string;
  name: string;
  tasks: Task[];
};

export type RiskSeverity = "Low" | "Medium" | "High";

export type Risk = {
  id: string;
  title: string;
  severity: RiskSeverity;
  taskId: string | null;
};

export type RequestStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Resolved via direct action";

export type RequestType = "Hold" | "Unhold" | "Reopen";

/**
 * Single global source of truth for requests. Requests are never stored per
 * project — every count and list is derived by filtering this collection.
 */
export type GlobalRequest = {
  id: string;
  type: RequestType;
  requester: string;
  projectId: string;
  categoryId: string;
  categoryName: string;
  taskId: string;
  taskTitle: string;
  status: RequestStatus;
  /** ISO timestamp of submission. */
  submittedAt: string;
  reason: string;
  expanded: boolean;
};

/** Requests belonging to one project. */
export function requestsForProject(
  requests: GlobalRequest[],
  projectId: string,
): GlobalRequest[] {
  return requests.filter((request) => request.projectId === projectId);
}

/** Pending requests belonging to one project. */
export function pendingRequestsForProject(
  requests: GlobalRequest[],
  projectId: string,
): GlobalRequest[] {
  return requestsForProject(requests, projectId).filter(
    (request) => request.status === "Pending",
  );
}

/** Requests linked to one task. */
export function requestsForTask(
  requests: GlobalRequest[],
  taskId: string,
): GlobalRequest[] {
  return requests.filter((request) => request.taskId === taskId);
}

export type Meeting = {
  id: string;
  title: string;
  /** ISO date, e.g. "2026-09-17" */
  date: string;
  /** Display time, e.g. "9:00 AM" */
  time: string;
};

export type Project = {
  id: string;
  name: string;
  projectId: string;
  startDate: string | null;
  deadline: string | null;
  categories: Category[];
  members: string[];
  risks: Risk[];
  meetings: Meeting[];
};

export function countHeldTasks(project: Project): number {
  return project.categories.reduce(
    (sum, category) =>
      sum + category.tasks.filter((task) => task.status === "Held").length,
    0,
  );
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function meetingTimestamp(meeting: Meeting): number {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(meeting.time.trim());
  let hours = 0;
  let minutes = 0;
  if (match) {
    hours = Number(match[1]) % 12;
    minutes = Number(match[2]);
    if (match[3]?.toUpperCase() === "PM") hours += 12;
  }
  const date = new Date(`${meeting.date}T00:00:00`);
  date.setHours(hours, minutes, 0, 0);
  return date.getTime();
}

/** Meetings sorted chronologically. */
export function sortMeetings(meetings: Meeting[]): Meeting[] {
  return [...meetings].sort((a, b) => meetingTimestamp(a) - meetingTimestamp(b));
}

/** The soonest meeting that has not passed yet, else null. */
export function nextMeeting(project: Project): Meeting | null {
  const now = Date.now();
  const upcoming = sortMeetings(project.meetings).filter(
    (meeting) => meetingTimestamp(meeting) >= now,
  );
  return upcoming[0] ?? sortMeetings(project.meetings).slice(-1)[0] ?? null;
}

/** "Today, 9:00 AM" or "Sep 20, 9:00 AM". */
export function formatMeeting(meeting: Meeting): string {
  const day =
    meeting.date === todayISO()
      ? "Today"
      : new Date(`${meeting.date}T00:00:00`).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        });
  return `${day}, ${meeting.time}`;
}

export function nextMeetingLabel(project: Project): string | null {
  const meeting = nextMeeting(project);
  return meeting ? formatMeeting(meeting) : null;
}

export const OWNERS = [
  "Member 1",
  "Member 2",
  "Member 3",
  "Member 4",
  "Member 5",
  "Member 6",
];

function task(
  id: string,
  title: string,
  owner: string,
  deadline: string,
  status: TaskStatus,
): Task {
  return {
    id,
    title,
    description: "",
    owner,
    deadline,
    estTime: "Not set",
    status,
    activity: [],
  };
}

/** DEMO/SAMPLE DATA — placeholder detail records, not real data. */
const SAMPLE_DETAILS: {
  categories: Category[];
  members: string[];
  risks: Risk[];
  meetings: Meeting[];
}[] = [
  {
    categories: [
      {
        id: "d1-c1",
        name: "Backend",
        tasks: [
          task("d1-t1", "API integration", "Member 1", "", "Active"),
          task("d1-t2", "Payment retry logic", "Member 2", "", "Under Review"),
          task("d1-t3", "DB migration", "Member 3", "", "Held"),
        ],
      },
      {
        id: "d1-c2",
        name: "Frontend",
        tasks: [
          task("d1-t4", "Onboarding flow", "Member 4", "", "Active"),
          task("d1-t5", "Landing page copy", "Member 5", "", "Under Review"),
          task("d1-t6", "Nav bar redesign", "Member 2", "", "Completed"),
        ],
      },
      {
        id: "d1-c3",
        name: "QA",
        tasks: [task("d1-t7", "Regression suite", "Member 6", "", "Active")],
      },
    ],
    members: ["Member 1", "Member 2", "Member 3", "Member 4", "Member 5", "Member 6"],
    risks: [
      { id: "d1-r1", title: "Supplier delivery may slip", severity: "High", taskId: "d1-t1" },
      { id: "d1-r2", title: "Budget approval pending", severity: "Medium", taskId: "d1-t2" },
      { id: "d1-r3", title: "Key member on leave next week", severity: "Medium", taskId: "d1-t4" },
      { id: "d1-r4", title: "Test environment unstable", severity: "Low", taskId: "d1-t7" },
    ],
    meetings: [
      { id: "d1-m1", title: "Daily stand-up", date: todayISO(), time: "9:00 AM" },
    ],
  },
  {
    categories: [
      {
        id: "d2-c1",
        name: "Design",
        tasks: [
          task("d2-t1", "Wireframes", "Member 1", "", "Active"),
          task("d2-t2", "Design system tokens", "Member 3", "", "Held"),
        ],
      },
      {
        id: "d2-c2",
        name: "Content",
        tasks: [
          task("d2-t3", "Product copy", "Member 4", "", "Active"),
          task("d2-t4", "Help center articles", "Member 5", "", "Not Started"),
          task("d2-t5", "Launch email", "Member 2", "", "Held"),
        ],
      },
    ],
    members: ["Member 1", "Member 2", "Member 3", "Member 4", "Member 5"],
    risks: [{ id: "d2-r1", title: "Scope still not final", severity: "High", taskId: "d2-t1" }],
    meetings: [
      { id: "d2-m1", title: "Client review", date: todayISO(), time: "11:30 AM" },
    ],
  },
  {
    categories: [
      {
        id: "d3-c1",
        name: "Research",
        tasks: [
          task("d3-t1", "Vendor comparison", "Member 2", "", "Active"),
          task("d3-t2", "User interviews", "Member 6", "", "Completed"),
        ],
      },
      {
        id: "d3-c2",
        name: "Rollout",
        tasks: [
          task("d3-t3", "Pilot site setup", "Member 1", "", "Active"),
          task("d3-t4", "Training material", "Member 3", "", "Not Started"),
        ],
      },
    ],
    members: ["Member 1", "Member 2", "Member 3", "Member 6"],
    risks: [
      { id: "d3-r1", title: "Dependency on external team", severity: "Medium", taskId: "d3-t1" },
      { id: "d3-r2", title: "Unclear acceptance criteria", severity: "Low", taskId: "d3-t2" },
      { id: "d3-r3", title: "Hardware arriving late", severity: "High", taskId: "d3-t3" },
    ],
    
    meetings: [],
  },
];

/** DEMO/SAMPLE DATA — Project 1/2/3 shown only when an account has no real projects. */
export function demoProjects(): Project[] {
  return SAMPLE_DETAILS.map((details, index) => ({
    id: `demo-project-${index + 1}`,
    name: `Project ${index + 1}`,
    projectId: "",
    startDate: null,
    deadline: null,
    ...details,
  }));
}

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 3600 * 1000).toISOString();
}

/**
 * DEMO/SAMPLE DATA — the single global requests collection for Project 1/2/3.
 * Every entry links to a real task id from the same project.
 */
export function demoRequests(): GlobalRequest[] {
  return [
    {
      id: "req-d1-1",
      type: "Hold",
      requester: "Member 3",
      projectId: "demo-project-1",
      categoryId: "d1-c1",
      categoryName: "Backend",
      taskId: "d1-t3",
      taskTitle: "DB migration",
      status: "Pending",
      submittedAt: hoursAgo(5),
      reason: "Extend deadline by 3 days — the staging database is still locked by the vendor.",
      expanded: false,
    },
    {
      id: "req-d1-2",
      type: "Reopen",
      requester: "Member 6",
      projectId: "demo-project-1",
      categoryId: "d1-c3",
      categoryName: "QA",
      taskId: "d1-t7",
      taskTitle: "Regression suite",
      status: "Approved",
      submittedAt: hoursAgo(28),
      reason: "Add one more reviewer before we close the regression run.",
      expanded: false,
    },
    {
      id: "req-d2-1",
      type: "Hold",
      requester: "Member 1",
      projectId: "demo-project-2",
      categoryId: "d2-c1",
      categoryName: "Design",
      taskId: "d2-t1",
      taskTitle: "Wireframes",
      status: "Pending",
      submittedAt: hoursAgo(3),
      reason: "Scope is still not final, so reassigning the task owner would waste work.",
      expanded: false,
    },
    {
      id: "req-d2-2",
      type: "Unhold",
      requester: "Member 3",
      projectId: "demo-project-2",
      categoryId: "d2-c1",
      categoryName: "Design",
      taskId: "d2-t2",
      taskTitle: "Design system tokens",
      status: "Pending",
      submittedAt: hoursAgo(9),
      reason: "Tokens are unblocked now that the palette is signed off.",
      expanded: false,
    },
    {
      id: "req-d2-3",
      type: "Reopen",
      requester: "Member 4",
      projectId: "demo-project-2",
      categoryId: "d2-c2",
      categoryName: "Content",
      taskId: "d2-t3",
      taskTitle: "Product copy",
      status: "Rejected",
      submittedAt: hoursAgo(50),
      reason: "Copy was signed off last week; reopening it would delay the launch email.",
      expanded: false,
    },
    {
      id: "req-d2-4",
      type: "Hold",
      requester: "Member 5",
      projectId: "demo-project-2",
      categoryId: "d2-c2",
      categoryName: "Content",
      taskId: "d2-t4",
      taskTitle: "Help center articles",
      status: "Approved",
      submittedAt: hoursAgo(72),
      reason: "Holding until the new category structure is agreed.",
      expanded: false,
    },
    {
      id: "req-d3-1",
      type: "Hold",
      requester: "Member 3",
      projectId: "demo-project-3",
      categoryId: "d3-c2",
      categoryName: "Rollout",
      taskId: "d3-t4",
      taskTitle: "Training material",
      status: "Pending",
      submittedAt: hoursAgo(7),
      reason: "Change project deadline first — hardware is arriving late.",
      expanded: false,
    },
  ];
}
