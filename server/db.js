const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Default Seed Data
const defaultSeed = {
  team_members: [
    {
      member_id: 1,
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+91 98765 43210",
      role: "Senior Frontend Developer",
      department: "Engineering",
      joining_date: "2024-01-15",
      status: "Active",
      profile_photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
      created_at: "2026-01-15T09:00:00.000Z",
      updated_at: "2026-09-29T10:00:00.000Z"
    },
    {
      member_id: 2,
      name: "Priya Patel",
      email: "priya.patel@example.com",
      phone: "+91 98765 43211",
      role: "UI/UX Designer",
      department: "Design",
      joining_date: "2024-03-01",
      status: "Active",
      profile_photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250",
      created_at: "2026-03-01T09:00:00.000Z",
      updated_at: "2026-09-29T10:00:00.000Z"
    },
    {
      member_id: 3,
      name: "Alex Chen",
      email: "alex.chen@example.com",
      phone: "+1 555 019 2831",
      role: "Backend Engineer",
      department: "Engineering",
      joining_date: "2024-02-10",
      status: "Active",
      profile_photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
      created_at: "2026-02-10T09:00:00.000Z",
      updated_at: "2026-09-29T10:00:00.000Z"
    },
    {
      member_id: 4,
      name: "Sarah Jenkins",
      email: "sarah.j@example.com",
      phone: "+1 555 014 9920",
      role: "Product Manager",
      department: "Product",
      joining_date: "2023-11-20",
      status: "Active",
      profile_photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250",
      created_at: "2026-11-20T09:00:00.000Z",
      updated_at: "2026-09-29T10:00:00.000Z"
    },
    {
      member_id: 5,
      name: "David Kim",
      email: "david.kim@example.com",
      phone: "+1 555 018 7721",
      role: "QA Automation Lead",
      department: "Quality Assurance",
      joining_date: "2024-05-12",
      status: "Active",
      profile_photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
      created_at: "2026-05-12T09:00:00.000Z",
      updated_at: "2026-09-29T10:00:00.000Z"
    }
  ],
  activities: [
    {
      activity_id: 101,
      member_id: 1,
      activity_name: "Website Redesign UI Implementation",
      description: "Implement responsive Tailwind components for the new marketing dashboard.",
      assigned_date: "2026-09-20",
      start_date: "2026-09-21",
      due_date: "2026-09-25",
      completion_date: "2026-09-24",
      priority: "High",
      status: "Completed",
      notes: "Delivered ahead of deadline. Excellent test coverage.",
      created_at: "2026-09-20T08:00:00.000Z",
      updated_at: "2026-09-24T16:00:00.000Z"
    },
    {
      activity_id: 102,
      member_id: 1,
      activity_name: "API Integration & React Query Setup",
      description: "Connect frontend components with REST backend endpoints.",
      assigned_date: "2026-09-25",
      start_date: "2026-09-26",
      due_date: "2026-10-02",
      completion_date: null,
      priority: "Urgent",
      status: "In Progress",
      notes: "Currently setting up error handling middleware.",
      created_at: "2026-09-25T10:00:00.000Z",
      updated_at: "2026-09-28T11:30:00.000Z"
    },
    {
      activity_id: 103,
      member_id: 2,
      activity_name: "Design System Figma Components",
      description: "Create standard color tokens, typography, and card components.",
      assigned_date: "2026-09-10",
      start_date: "2026-09-12",
      due_date: "2026-09-18",
      completion_date: "2026-09-17",
      priority: "Medium",
      status: "Completed",
      notes: "Figma design system published for team.",
      created_at: "2026-09-10T09:00:00.000Z",
      updated_at: "2026-09-17T15:00:00.000Z"
    },
    {
      activity_id: 104,
      member_id: 2,
      activity_name: "User Journey & Analytics Flow Mockups",
      description: "Map out end-to-end user flow for reporting module.",
      assigned_date: "2026-09-22",
      start_date: "2026-09-23",
      due_date: "2026-09-30",
      completion_date: null,
      priority: "High",
      status: "In Progress",
      notes: "Draft complete, reviewing with PM.",
      created_at: "2026-09-22T14:00:00.000Z",
      updated_at: "2026-09-27T09:00:00.000Z"
    },
    {
      activity_id: 105,
      member_id: 3,
      activity_name: "Database Schema Optimization",
      description: "Optimize SQL indices and migrate legacy tables to foreign key schema.",
      assigned_date: "2026-09-15",
      start_date: "2026-09-16",
      due_date: "2026-09-22",
      completion_date: "2026-09-21",
      priority: "Urgent",
      status: "Completed",
      notes: "Improved query speeds by 45%.",
      created_at: "2026-09-15T10:00:00.000Z",
      updated_at: "2026-09-21T17:00:00.000Z"
    },
    {
      activity_id: 106,
      member_id: 3,
      activity_name: "JWT Authentication & Role Middleware",
      description: "Implement security token validation and permission checks.",
      assigned_date: "2026-09-24",
      start_date: "2026-09-25",
      due_date: "2026-10-05",
      completion_date: null,
      priority: "High",
      status: "Pending",
      notes: "Waiting on spec sign-off.",
      created_at: "2026-09-24T09:30:00.000Z",
      updated_at: "2026-09-24T09:30:00.000Z"
    },
    {
      activity_id: 107,
      member_id: 4,
      activity_name: "Q4 Roadmap Strategy Document",
      description: "Draft deliverable timeline and resource allocation for Q4 release.",
      assigned_date: "2026-09-01",
      start_date: "2026-09-05",
      due_date: "2026-09-15",
      completion_date: "2026-09-14",
      priority: "High",
      status: "Completed",
      notes: "Approved by leadership.",
      created_at: "2026-09-01T11:00:00.000Z",
      updated_at: "2026-09-14T16:00:00.000Z"
    },
    {
      activity_id: 108,
      member_id: 4,
      activity_name: "Sprint Retrospective & Demo Setup",
      description: "Organize sprint demo meeting and document feedback points.",
      assigned_date: "2026-09-26",
      start_date: "2026-09-27",
      due_date: "2026-09-29",
      completion_date: "2026-09-29",
      priority: "Medium",
      status: "Completed",
      notes: "Sprint completed with 92% velocity.",
      created_at: "2026-09-26T08:30:00.000Z",
      updated_at: "2026-09-29T18:00:00.000Z"
    },
    {
      activity_id: 109,
      member_id: 5,
      activity_name: "Automated E2E Test Suite Creation",
      description: "Write Playwright tests for core user checkout flow.",
      assigned_date: "2026-09-18",
      start_date: "2026-09-19",
      due_date: "2026-09-26",
      completion_date: "2026-09-25",
      priority: "High",
      status: "Completed",
      notes: "28 test scenarios added to CI/CD pipeline.",
      created_at: "2026-09-18T10:00:00.000Z",
      updated_at: "2026-09-25T14:20:00.000Z"
    },
    {
      activity_id: 110,
      member_id: 5,
      activity_name: "Performance & Load Testing Setup",
      description: "Run k6 load tests for peak throughput estimation.",
      assigned_date: "2026-09-27",
      start_date: "2026-09-28",
      due_date: "2026-10-04",
      completion_date: null,
      priority: "Medium",
      status: "In Progress",
      notes: "Simulating 5,000 concurrent virtual users.",
      created_at: "2026-09-27T15:00:00.000Z",
      updated_at: "2026-09-28T12:00:00.000Z"
    },
    {
      activity_id: 111,
      member_id: 1,
      activity_name: "Legacy Code Refactoring",
      description: "Clean up outdated CSS classes and deprecated state calls.",
      assigned_date: "2026-08-15",
      start_date: "2026-08-16",
      due_date: "2026-08-25",
      completion_date: "2026-08-24",
      priority: "Low",
      status: "Completed",
      notes: "Historical task for August.",
      created_at: "2026-08-15T09:00:00.000Z",
      updated_at: "2026-08-24T17:00:00.000Z"
    }
  ],
  point_transactions: [
    {
      point_id: 1,
      member_id: 1,
      activity_id: 101,
      points: 25,
      reason: "Completed Website Redesign UI early with high code quality",
      point_date: "2026-09-24",
      created_at: "2026-09-24T16:05:00.000Z"
    },
    {
      point_id: 2,
      member_id: 1,
      activity_id: 111,
      points: 15,
      reason: "Refactored legacy code components efficiently",
      point_date: "2026-08-24",
      created_at: "2026-08-24T17:05:00.000Z"
    },
    {
      point_id: 3,
      member_id: 2,
      activity_id: 103,
      points: 20,
      reason: "Created comprehensive Figma Design System tokens",
      point_date: "2026-09-17",
      created_at: "2026-09-17T15:10:00.000Z"
    },
    {
      point_id: 4,
      member_id: 3,
      activity_id: 105,
      points: 30,
      reason: "Optimized database query performance by 45%",
      point_date: "2026-09-21",
      created_at: "2026-09-21T17:15:00.000Z"
    },
    {
      point_id: 5,
      member_id: 4,
      activity_id: 107,
      points: 20,
      reason: "Delivered clear Q4 Roadmap Strategy Document",
      point_date: "2026-09-14",
      created_at: "2026-09-14T16:10:00.000Z"
    },
    {
      point_id: 6,
      member_id: 4,
      activity_id: 108,
      points: 15,
      reason: "Successfully led Sprint Demo and retrospective",
      point_date: "2026-09-29",
      created_at: "2026-09-29T18:05:00.000Z"
    },
    {
      point_id: 7,
      member_id: 5,
      activity_id: 109,
      points: 25,
      reason: "Built complete E2E test suite catching critical bugs",
      point_date: "2026-09-25",
      created_at: "2026-09-25T14:25:00.000Z"
    }
  ]
};

// Database helper class
class JSONDatabase {
  constructor() {
    this.data = null;
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
      } else {
        this.data = defaultSeed;
        this.save();
      }
    } catch (err) {
      console.error('Error reading DB, using seed:', err);
      this.data = defaultSeed;
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Error saving DB:', err);
    }
  }

  // --- MEMBER CRUD ---
  getMembers() {
    return this.data.team_members;
  }

  getMemberById(id) {
    return this.data.team_members.find(m => m.member_id === Number(id));
  }

  addMember(memberData) {
    const nextId = this.data.team_members.length > 0 
      ? Math.max(...this.data.team_members.map(m => m.member_id)) + 1 
      : 1;
    
    const now = new Date().toISOString();
    const newMember = {
      member_id: nextId,
      name: memberData.name,
      email: memberData.email,
      phone: memberData.phone || '',
      role: memberData.role || 'Team Member',
      department: memberData.department || 'General',
      joining_date: memberData.joining_date || new Date().toISOString().split('T')[0],
      status: memberData.status || 'Active',
      profile_photo: memberData.profile_photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(memberData.name)}`,
      created_at: now,
      updated_at: now
    };

    this.data.team_members.push(newMember);
    this.save();
    return newMember;
  }

  updateMember(id, memberData) {
    const index = this.data.team_members.findIndex(m => m.member_id === Number(id));
    if (index === -1) return null;

    const existing = this.data.team_members[index];
    const updated = {
      ...existing,
      ...memberData,
      member_id: existing.member_id, // preserve ID
      updated_at: new Date().toISOString()
    };

    this.data.team_members[index] = updated;
    this.save();
    return updated;
  }

  deleteMember(id) {
    const numId = Number(id);
    const index = this.data.team_members.findIndex(m => m.member_id === numId);
    if (index === -1) return false;

    this.data.team_members.splice(index, 1);
    
    // Also cleanup member's activities or unassign them safely
    this.data.activities = this.data.activities.map(act => {
      if (act.member_id === numId) {
        return { ...act, member_id: null, notes: (act.notes || '') + ' (Member removed)' };
      }
      return act;
    });

    this.save();
    return true;
  }

  // --- ACTIVITY CRUD ---
  getActivities() {
    return this.data.activities;
  }

  getActivityById(id) {
    return this.data.activities.find(a => a.activity_id === Number(id));
  }

  addActivity(actData) {
    const nextId = this.data.activities.length > 0
      ? Math.max(...this.data.activities.map(a => a.activity_id)) + 1
      : 101;

    const now = new Date().toISOString();
    const today = now.split('T')[0];

    const newActivity = {
      activity_id: nextId,
      member_id: Number(actData.member_id),
      activity_name: actData.activity_name,
      description: actData.description || '',
      assigned_date: actData.assigned_date || today,
      start_date: actData.start_date || today,
      due_date: actData.due_date || today,
      completion_date: actData.status === 'Completed' ? (actData.completion_date || today) : null,
      priority: actData.priority || 'Medium',
      status: actData.status || 'Pending',
      notes: actData.notes || '',
      created_at: now,
      updated_at: now
    };

    this.data.activities.push(newActivity);
    this.save();
    return newActivity;
  }

  updateActivity(id, actData) {
    const index = this.data.activities.findIndex(a => a.activity_id === Number(id));
    if (index === -1) return null;

    const existing = this.data.activities[index];
    const today = new Date().toISOString().split('T')[0];

    let completionDate = existing.completion_date;
    if (actData.status === 'Completed' && existing.status !== 'Completed') {
      completionDate = actData.completion_date || today;
    } else if (actData.status && actData.status !== 'Completed') {
      completionDate = null;
    }

    const updated = {
      ...existing,
      ...actData,
      member_id: actData.member_id ? Number(actData.member_id) : existing.member_id,
      activity_id: existing.activity_id,
      completion_date: completionDate,
      updated_at: new Date().toISOString()
    };

    this.data.activities[index] = updated;
    this.save();
    return updated;
  }

  deleteActivity(id) {
    const numId = Number(id);
    const index = this.data.activities.findIndex(a => a.activity_id === numId);
    if (index === -1) return false;

    this.data.activities.splice(index, 1);
    
    // Remove point transactions associated with this activity or decouple them
    this.data.point_transactions = this.data.point_transactions.filter(pt => pt.activity_id !== numId);

    this.save();
    return true;
  }

  // --- POINT TRANSACTIONS CRUD ---
  getPointTransactions() {
    return this.data.point_transactions;
  }

  addPointTransaction(ptData) {
    const nextId = this.data.point_transactions.length > 0
      ? Math.max(...this.data.point_transactions.map(p => p.point_id)) + 1
      : 1;

    const now = new Date().toISOString();
    const today = now.split('T')[0];

    const newPt = {
      point_id: nextId,
      member_id: Number(ptData.member_id),
      activity_id: ptData.activity_id ? Number(ptData.activity_id) : null,
      points: Number(ptData.points) || 0,
      reason: ptData.reason || 'Manual Adjustment',
      point_date: ptData.point_date || today,
      created_at: now
    };

    this.data.point_transactions.push(newPt);
    this.save();
    return newPt;
  }

  deletePointTransaction(id) {
    const numId = Number(id);
    const index = this.data.point_transactions.findIndex(p => p.point_id === numId);
    if (index === -1) return false;

    this.data.point_transactions.splice(index, 1);
    this.save();
    return true;
  }
}

const db = new JSONDatabase();
module.exports = db;
