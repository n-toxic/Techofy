export interface HealthStatus {
  status: string;
}

export interface MessageResponse {
  message: string;
}

export interface ErrorResponse {
  error: string;
}

export type UserRole = typeof UserRole[keyof typeof UserRole];


export const UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  walletBalance: number;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterBody {
  email: string;
  password: string;
  name: string;
}

export interface VerifyOtpBody {
  email: string;
  code: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface RequestOtpBody {
  email: string;
}

export interface UpdateProfileBody {
  name?: string;
}

export interface WalletInfo {
  balance: number;
  currency: string;
}

export interface DepositBody {
  amount: number;
}

export interface DepositOrder {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface VerifyDepositBody {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export type TransactionType = typeof TransactionType[keyof typeof TransactionType];


export const TransactionType = {
  DEPOSIT: 'DEPOSIT',
  DEDUCTION: 'DEDUCTION',
} as const;

export type TransactionStatus = typeof TransactionStatus[keyof typeof TransactionStatus];


export const TransactionStatus = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
} as const;

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description?: string;
  status: TransactionStatus;
  date: string;
}

export type InstanceType = typeof InstanceType[keyof typeof InstanceType];


export const InstanceType = {
  RDP: 'RDP',
  VPS: 'VPS',
} as const;

export type InstanceStatus = typeof InstanceStatus[keyof typeof InstanceStatus];


export const InstanceStatus = {
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  STOPPED: 'STOPPED',
  DEPLOYING: 'DEPLOYING',
} as const;

export interface Instance {
  id: string;
  type: InstanceType;
  os: string;
  ram: number;
  cpu: number;
  storage: number;
  hostname?: string;
  status: InstanceStatus;
  monthlyCost: number;
  createdAt: string;
  location?: string;
}

export type PortRuleProtocol = typeof PortRuleProtocol[keyof typeof PortRuleProtocol];


export const PortRuleProtocol = {
  TCP: 'TCP',
  UDP: 'UDP',
} as const;

export type PortRuleDirection = typeof PortRuleDirection[keyof typeof PortRuleDirection];


export const PortRuleDirection = {
  INBOUND: 'INBOUND',
  OUTBOUND: 'OUTBOUND',
} as const;

export interface PortRule {
  id: string;
  port: number;
  protocol: PortRuleProtocol;
  description?: string;
  direction: PortRuleDirection;
}

export type InstanceDetail = Instance & {
  ports?: PortRule[];
};

export interface InstanceCredentials {
  hostname: string;
  username: string;
  password: string;
  port: number;
}

export type DeployInstanceBodyType = typeof DeployInstanceBodyType[keyof typeof DeployInstanceBodyType];


export const DeployInstanceBodyType = {
  RDP: 'RDP',
  VPS: 'VPS',
} as const;

export interface DeployInstanceBody {
  type: DeployInstanceBodyType;
  os: string;
  ram: number;
  cpu: number;
  storage: number;
  location?: string;
  customUsername?: string;
  customPassword?: string;
}

export type AddPortBodyProtocol = typeof AddPortBodyProtocol[keyof typeof AddPortBodyProtocol];


export const AddPortBodyProtocol = {
  TCP: 'TCP',
  UDP: 'UDP',
} as const;

export type AddPortBodyDirection = typeof AddPortBodyDirection[keyof typeof AddPortBodyDirection];


export const AddPortBodyDirection = {
  INBOUND: 'INBOUND',
  OUTBOUND: 'OUTBOUND',
} as const;

export interface AddPortBody {
  port: number;
  protocol: AddPortBodyProtocol;
  description?: string;
  direction: AddPortBodyDirection;
}

export type SupportTicketStatus = typeof SupportTicketStatus[keyof typeof SupportTicketStatus];


export const SupportTicketStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
} as const;

export type SupportTicketPriority = typeof SupportTicketPriority[keyof typeof SupportTicketPriority];


export const SupportTicketPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const;

export interface SupportTicket {
  id: string;
  subject: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  createdAt: string;
  updatedAt: string;
  userId: string;
  userEmail?: string;
}

export interface TicketMessage {
  id: string;
  content: string;
  isAdmin: boolean;
  createdAt: string;
  authorName?: string;
}

export type SupportTicketDetail = SupportTicket & {
  messages?: TicketMessage[];
};

export type CreateTicketBodyPriority = typeof CreateTicketBodyPriority[keyof typeof CreateTicketBodyPriority];


export const CreateTicketBodyPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const;

export interface CreateTicketBody {
  subject: string;
  message: string;
  priority: CreateTicketBodyPriority;
}

export interface ReplyTicketBody {
  message: string;
}

export interface AdminStats {
  totalUsers: number;
  totalInstances: number;
  activeInstances: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingInstances: number;
  openTickets: number;
  serverPoolAvailable: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role: string;
  walletBalance: number;
  instanceCount: number;
  totalSpent: number;
  createdAt: string;
}

export interface AdjustWalletBody {
  amount: number;
  reason: string;
}

export interface AdminInstance {
  id: string;
  userId: string;
  userEmail?: string;
  type: string;
  os: string;
  ram: number;
  cpu: number;
  storage: number;
  hostname?: string;
  rawIp?: string;
  status: string;
  monthlyCost: number;
  createdAt: string;
}

export interface AssignInstanceBody {
  ip: string;
  username: string;
  password: string;
  hostname?: string;
}

export type ServerPoolEntryType = typeof ServerPoolEntryType[keyof typeof ServerPoolEntryType];


export const ServerPoolEntryType = {
  RDP: 'RDP',
  VPS: 'VPS',
} as const;

export type ServerPoolEntryStatus = typeof ServerPoolEntryStatus[keyof typeof ServerPoolEntryStatus];


export const ServerPoolEntryStatus = {
  AVAILABLE: 'AVAILABLE',
  ASSIGNED: 'ASSIGNED',
  MAINTENANCE: 'MAINTENANCE',
} as const;

export interface ServerPoolEntry {
  id: string;
  ip: string;
  rootUsername: string;
  type: ServerPoolEntryType;
  status: ServerPoolEntryStatus;
  assignedInstanceId?: string;
  location?: string;
  addedAt: string;
}

export type AddServerPoolBodyType = typeof AddServerPoolBodyType[keyof typeof AddServerPoolBodyType];


export const AddServerPoolBodyType = {
  RDP: 'RDP',
  VPS: 'VPS',
} as const;

export interface AddServerPoolBody {
  ip: string;
  rootUsername: string;
  rootPassword: string;
  type: AddServerPoolBodyType;
  location?: string;
}

export type PlanType = typeof PlanType[keyof typeof PlanType];


export const PlanType = {
  RDP: 'RDP',
  VPS: 'VPS',
} as const;

export interface Plan {
  id: string;
  name: string;
  type: PlanType;
  os: string;
  ram: number;
  cpu: number;
  storage: number;
  monthlyCost: number;
  features: string[];
  popular?: boolean;
}

export interface DashboardSummary {
  runningInstances: number;
  stoppedInstances: number;
  pendingInstances: number;
  totalInstances: number;
  walletBalance: number;
  monthlySpend: number;
  openTickets: number;
}

