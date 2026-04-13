export type UserRole = "admin" | "viewer";
export type LeadSource = "quote_form" | "contact_form" | "manual";
export type LeadStatus = "new" | "contacted" | "quoted" | "won" | "lost";
export type ProjectStatus = "planning" | "in_progress" | "review" | "completed" | "on_hold" | "cancelled";
export type InvoiceStatus = "draft" | "sent" | "paid" | "partial" | "overdue" | "cancelled";
export type PaymentMethod = "eft" | "cash" | "card" | "other";
export type ExpenseCategory = "hosting" | "software" | "subscriptions" | "hardware" | "marketing" | "transport" | "office" | "professional_services" | "other";
export type RecurringInterval = "monthly" | "quarterly" | "yearly";
export type IncomeCategory = "web_dev" | "ecommerce" | "apps" | "training" | "consulting" | "other" | "investment";
export type DocumentType = "contract" | "proposal" | "invoice" | "receipt" | "agreement" | "report" | "other";
export type InvoiceDocType = "invoice" | "quotation";
export type InstallmentInterval = "weekly" | "bi-weekly" | "monthly";
export type InvestorStatus = "prospective" | "active" | "exited";
export type EmployeeStatus = "active" | "inactive" | "terminated";
export type Department = "development" | "design" | "marketing" | "operations" | "other";
export type AgentStatus = "active" | "paused" | "retired";
export type IncomeSource = "invoice" | "manual" | "investor";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  source: LeadSource;
  status: LeadStatus;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  location: string | null;
  service: string | null;
  package: string | null;
  scope: string | null;
  timeline: string | null;
  budget: string | null;
  message: string | null;
  notes: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  content: string;
  author_id: string | null;
  created_at: string;
}

export interface Client {
  id: string;
  lead_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  location: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  name: string;
  service: string | null;
  package: string | null;
  status: ProjectStatus;
  start_date: string | null;
  due_date: string | null;
  quoted_amount: number | null;
  progress_override: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  due_date: string | null;
  completed: boolean;
  completed_at: string | null;
  sort_order: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  project_id: string | null;
  client_id: string;
  doc_type: InvoiceDocType;
  amount: number;
  status: InvoiceStatus;
  due_date: string;
  paid_date: string | null;
  paid_amount: number;
  payment_plan_enabled: boolean;
  installment_count: number | null;
  installment_interval: InstallmentInterval | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_rate: number;
  amount: number;
  sort_order: number;
}

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  method: PaymentMethod;
  reference: string | null;
  proof_url: string | null;
  paid_at: string;
  notes: string | null;
  created_at: string;
}

export interface Expense {
  id: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
  recurring: boolean;
  recurring_interval: RecurringInterval | null;
  receipt_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface IncomeEntry {
  id: string;
  source: IncomeSource;
  invoice_id: string | null;
  investor_id: string | null;
  description: string;
  amount: number;
  date: string;
  category: IncomeCategory;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  client_id: string | null;
  project_id: string | null;
  investor_id: string | null;
  name: string;
  type: DocumentType;
  file_url: string;
  file_size: number;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

export interface Investor {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  investment_amount: number;
  equity_percentage: number | null;
  agreement_date: string | null;
  status: InvestorStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  department: Department;
  salary: number;
  start_date: string;
  end_date: string | null;
  status: EmployeeStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AiAgent {
  id: string;
  name: string;
  purpose: string;
  model: string;
  provider: string;
  monthly_cost: number;
  status: AgentStatus;
  config_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SalaryHistory {
  id: string;
  employee_id: string;
  amount: number;
  effective_date: string;
  notes: string | null;
  created_at: string;
}

export interface BusinessSettings {
  id: string;
  company_name: string;
  tagline: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  website: string | null;
  vat_number: string | null;
  registration_number: string | null;
  bank_name: string | null;
  bank_account_number: string | null;
  bank_branch_code: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

// Supabase Database type (used by the client generics)
export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile> & Pick<Profile, "id" | "full_name" | "email" | "role">; Update: Partial<Profile> };
      leads: { Row: Lead; Insert: Partial<Lead> & Pick<Lead, "name" | "email" | "source">; Update: Partial<Lead> };
      lead_notes: { Row: LeadNote; Insert: Partial<LeadNote> & Pick<LeadNote, "lead_id" | "content">; Update: Partial<LeadNote> };
      clients: { Row: Client; Insert: Partial<Client> & Pick<Client, "name" | "email">; Update: Partial<Client> };
      projects: { Row: Project; Insert: Partial<Project> & Pick<Project, "client_id" | "name">; Update: Partial<Project> };
      project_milestones: { Row: ProjectMilestone; Insert: Partial<ProjectMilestone> & Pick<ProjectMilestone, "project_id" | "title">; Update: Partial<ProjectMilestone> };
      invoices: { Row: Invoice; Insert: Partial<Invoice> & Pick<Invoice, "invoice_number" | "client_id" | "amount" | "due_date">; Update: Partial<Invoice> };
      payments: { Row: Payment; Insert: Partial<Payment> & Pick<Payment, "invoice_id" | "amount" | "method" | "paid_at">; Update: Partial<Payment> };
      expenses: { Row: Expense; Insert: Partial<Expense> & Pick<Expense, "category" | "description" | "amount" | "date">; Update: Partial<Expense> };
      income_entries: { Row: IncomeEntry; Insert: Partial<IncomeEntry> & Pick<IncomeEntry, "source" | "description" | "amount" | "date" | "category">; Update: Partial<IncomeEntry> };
      documents: { Row: Document; Insert: Partial<Document> & Pick<Document, "name" | "type" | "file_url" | "uploaded_by">; Update: Partial<Document> };
      investors: { Row: Investor; Insert: Partial<Investor> & Pick<Investor, "name">; Update: Partial<Investor> };
      employees: { Row: Employee; Insert: Partial<Employee> & Pick<Employee, "name" | "role" | "department" | "salary" | "start_date">; Update: Partial<Employee> };
      ai_agents: { Row: AiAgent; Insert: Partial<AiAgent> & Pick<AiAgent, "name" | "purpose" | "model" | "provider">; Update: Partial<AiAgent> };
      salary_history: { Row: SalaryHistory; Insert: Partial<SalaryHistory> & Pick<SalaryHistory, "employee_id" | "amount" | "effective_date">; Update: Partial<SalaryHistory> };
      business_settings: { Row: BusinessSettings; Insert: Partial<BusinessSettings> & Pick<BusinessSettings, "company_name">; Update: Partial<BusinessSettings> };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      lead_source: LeadSource;
      lead_status: LeadStatus;
      project_status: ProjectStatus;
      invoice_status: InvoiceStatus;
      payment_method: PaymentMethod;
      expense_category: ExpenseCategory;
      recurring_interval: RecurringInterval;
      income_category: IncomeCategory;
      document_type: DocumentType;
      investor_status: InvestorStatus;
      employee_status: EmployeeStatus;
      department: Department;
      agent_status: AgentStatus;
      income_source: IncomeSource;
    };
  };
}
