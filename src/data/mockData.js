// Mock dataset — replace each export with a real API call via src/api/axiosClient.js
// once the ML backend endpoints are live (e.g. GET /api/anomalies, GET /api/users/risk).

export const riskTrend = [
  { day: 'Mon', avgRisk: 32, incidents: 4 },
  { day: 'Tue', avgRisk: 38, incidents: 6 },
  { day: 'Wed', avgRisk: 29, incidents: 3 },
  { day: 'Thu', avgRisk: 45, incidents: 9 },
  { day: 'Fri', avgRisk: 61, incidents: 14 },
  { day: 'Sat', avgRisk: 40, incidents: 5 },
  { day: 'Sun', avgRisk: 52, incidents: 8 }
]

export const riskDistribution = [
  { name: 'Critical', value: 12, color: '#FF5D6C' },
  { name: 'High', value: 27, color: '#FF8A5B' },
  { name: 'Medium', value: 54, color: '#F5B942' },
  { name: 'Low', value: 131, color: '#33D6C0' }
]

export const anomalyTypeBreakdown = [
  { type: 'Off-hours access', count: 38 },
  { type: 'Bulk file download', count: 26 },
  { type: 'Privilege escalation', count: 14 },
  { type: 'Unusual login geo', count: 31 },
  { type: 'Lateral movement', count: 9 },
  { type: 'Data exfiltration', count: 6 }
]

export const users = [
  { id: 'U-1042', name: 'Ananya Roy', dept: 'Finance', role: 'Sr. Analyst', riskScore: 91, tier: 'Critical', lastActive: '2 min ago', anomalies: 7, trend: [22, 30, 28, 44, 60, 78, 91] },
  { id: 'U-2091', name: 'Vikram Shah', dept: 'Engineering', role: 'DevOps Lead', riskScore: 78, tier: 'High', lastActive: '11 min ago', anomalies: 5, trend: [15, 18, 24, 30, 42, 60, 78] },
  { id: 'U-3312', name: 'Meera Iyer', dept: 'HR', role: 'HRBP', riskScore: 24, tier: 'Low', lastActive: '1 hr ago', anomalies: 1, trend: [10, 12, 9, 14, 18, 20, 24] },
  { id: 'U-4187', name: 'Karan Malhotra', dept: 'Sales', role: 'Regional Head', riskScore: 66, tier: 'Medium', lastActive: '4 min ago', anomalies: 4, trend: [20, 22, 28, 35, 40, 55, 66] },
  { id: 'U-5502', name: 'Divya Krishnan', dept: 'IT', role: 'Sys Admin', riskScore: 88, tier: 'Critical', lastActive: 'Just now', anomalies: 9, trend: [30, 35, 38, 50, 65, 80, 88] },
  { id: 'U-6098', name: 'Arjun Desai', dept: 'Legal', role: 'Counsel', riskScore: 19, tier: 'Low', lastActive: '3 hr ago', anomalies: 0, trend: [8, 10, 12, 11, 14, 16, 19] },
  { id: 'U-7211', name: 'Sneha Pillai', dept: 'Finance', role: 'Controller', riskScore: 55, tier: 'Medium', lastActive: '22 min ago', anomalies: 3, trend: [18, 20, 26, 30, 38, 48, 55] },
  { id: 'U-8340', name: 'Rahul Bose', dept: 'Engineering', role: 'Backend Eng.', riskScore: 33, tier: 'Low', lastActive: '55 min ago', anomalies: 2, trend: [12, 14, 15, 20, 24, 28, 33] }
]

export const anomalies = [
  { id: 'A-9931', user: 'Ananya Roy', userId: 'U-1042', type: 'Bulk file download', severity: 'Critical', time: '2026-07-09 02:14', detail: '4.2 GB exported from Finance drive outside business hours', status: 'Open' },
  { id: 'A-9930', user: 'Divya Krishnan', userId: 'U-5502', type: 'Privilege escalation', severity: 'Critical', time: '2026-07-09 01:47', detail: 'Admin role granted to self without ticket reference', status: 'Investigating' },
  { id: 'A-9928', user: 'Vikram Shah', userId: 'U-2091', type: 'Unusual login geo', severity: 'High', time: '2026-07-08 23:58', detail: 'Login from Lisbon, 9 hrs after Bengaluru session', status: 'Open' },
  { id: 'A-9925', user: 'Karan Malhotra', userId: 'U-4187', type: 'Off-hours access', severity: 'Medium', time: '2026-07-08 22:31', detail: 'CRM accessed at 11:30 PM, 3 std. dev. from baseline', status: 'Resolved' },
  { id: 'A-9921', user: 'Sneha Pillai', userId: 'U-7211', type: 'Lateral movement', severity: 'Medium', time: '2026-07-08 19:02', detail: 'Accessed 6 unfamiliar internal endpoints in 4 minutes', status: 'Investigating' },
  { id: 'A-9918', user: 'Rahul Bose', userId: 'U-8340', type: 'Off-hours access', severity: 'Low', time: '2026-07-08 17:40', detail: 'Repo cloned at 6:40 PM, within acceptable variance', status: 'Resolved' },
  { id: 'A-9915', user: 'Ananya Roy', userId: 'U-1042', type: 'Unusual login geo', severity: 'High', time: '2026-07-08 14:12', detail: 'Impossible travel: Mumbai to Frankfurt in 40 minutes', status: 'Open' }
]

export const alerts = [
  { id: 'AL-4471', title: 'Critical risk threshold breached', user: 'Ananya Roy', severity: 'Critical', time: '3 min ago', read: false, channel: 'Risk Engine' },
  { id: 'AL-4470', title: 'Privilege escalation detected', user: 'Divya Krishnan', severity: 'Critical', time: '18 min ago', read: false, channel: 'Access Monitor' },
  { id: 'AL-4468', title: 'New device fingerprint flagged', user: 'Vikram Shah', severity: 'High', time: '1 hr ago', read: true, channel: 'Device Watch' },
  { id: 'AL-4463', title: 'Baseline drift exceeds 2.5', user: 'Karan Malhotra', severity: 'Medium', time: '2 hr ago', read: true, channel: 'Behavior Model' },
  { id: 'AL-4459', title: 'Weekly risk digest ready', user: 'All Users', severity: 'Info', time: '6 hr ago', read: true, channel: 'Reports' },
  { id: 'AL-4451', title: 'Anomaly resolved after review', user: 'Rahul Bose', severity: 'Low', time: '1 day ago', read: true, channel: 'Risk Engine' }
]

export const teamUsers = [
  { id: 1, name: 'Ravi Menon', email: 'admin@sentinelai.io', role: 'Company Admin', status: 'Active', lastLogin: 'Just now' },
  { id: 2, name: 'Priya Nair', email: 'analyst@sentinelai.io', role: 'Security Analyst', status: 'Active', lastLogin: '10 min ago' },
  { id: 3, name: 'Arvind Rao', email: 'arvind.rao@northbridge.com', role: 'Security Analyst', status: 'Active', lastLogin: '3 hr ago' },
  { id: 4, name: 'Fatima Sheikh', email: 'fatima.s@northbridge.com', role: 'Viewer', status: 'Invited', lastLogin: '—' },
  { id: 5, name: 'John Mathew', email: 'john.m@northbridge.com', role: 'Security Analyst', status: 'Suspended', lastLogin: '14 days ago' }
]

export const pipelineStages = [
  { key: 'ingest', label: 'Log Ingestion', desc: 'Parsing raw activity logs' },
  { key: 'feature', label: 'Feature Engineering', desc: 'Extracting behavioral signals' },
  { key: 'baseline', label: 'Baseline Profiling', desc: 'Modeling normal behavior per user' },
  { key: 'detect', label: 'Anomaly Detection', desc: 'Scoring deviation from baseline' },
  { key: 'risk', label: 'Risk Scoring', desc: 'Weighting anomalies into a risk index' },
  { key: 'alert', label: 'Alert Generation', desc: 'Raising alerts above threshold' }
]

export const reports = [
  { id: 'R-118', name: 'Weekly Risk Summary — Jul 1–7', type: 'Weekly Digest', generated: '2026-07-08', size: '842 KB' },
  { id: 'R-117', name: 'Finance Dept. Deep Dive', type: 'Departmental', generated: '2026-07-05', size: '1.4 MB' },
  { id: 'R-116', name: 'Critical Incidents — Q2', type: 'Incident Report', generated: '2026-06-30', size: '2.1 MB' },
  { id: 'R-115', name: 'Access Anomaly Audit', type: 'Compliance', generated: '2026-06-24', size: '968 KB' }
]
