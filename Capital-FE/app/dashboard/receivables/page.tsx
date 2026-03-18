"use client";

import { useEffect, useState } from "react";
import { 
  ArrowLeft,
  ArrowDownLeft,
  Search,
  Filter,
  MoreVertical,
  Loader2,
  AlertCircle,
  Eye
} from "lucide-react";
import Link from "next/link";
import InvoiceDetailModal from "@/components/InvoiceDetailModal";

interface InvoiceItem {
  id: string;
  item_name: string;
  quantity: number;
  unit: string | null;
  unit_price: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
}

interface Invoice {
  id: string;
  invoice_no: string;
  invoice_date: string;
  due_date: string | null;
  payment_terms_days: number | null;
  po_reference?: string | null;
  customer: {
    company_name: string;
    customer_id: string;
    billing_address_line1: string;
    city: string;
    state: string;
    email: string;
    bank_name?: string | null;
    bank_account_no?: string | null;
    bank_ifsc?: string | null;
    bank_branch?: string | null;
  };
  total_amount: number;
  paid_amount: number;
  status: string;
  items: InvoiceItem[];
}

export default function ReceivablesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const organizationId = localStorage.getItem("organizationId");
        
        if (!apiUrl || !organizationId) return;

        const response = await fetch(`${apiUrl}/dashboard/receivables?company_id=${organizationId}`);
        const result = await response.json();
        setInvoices(result.data);
      } catch (error) {
        console.error("Failed to fetch receivables:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-primary/10 text-primary border-primary/20';
      case 'overdue': return 'bg-error/10 text-error border-error/20';
      case 'pending': return 'bg-accent/10 text-accent border-accent/20';
      case 'partiallypaid': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-foreground/5 text-foreground/40 border-foreground/10';
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoice_no.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inv.customer.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "All" || inv.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalOutstanding = invoices.reduce((acc, inv) => acc + (Number(inv.total_amount) - Number(inv.paid_amount)), 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="p-2 hover:bg-background rounded-sm transition-colors border border-border">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Receivables</h1>
            <p className="text-sm text-foreground/40">Manage and track your customer invoices</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn-secondary">Export Report</button>
          <button className="btn-primary">New Invoice</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-surface p-6 space-y-2">
          <p className="text-sm font-medium text-foreground/40">Total Outstanding</p>
          <h3 className="text-2xl font-bold text-foreground">{formatCurrency(totalOutstanding)}</h3>
          <div className="flex items-center text-xs text-primary bg-primary/10 w-fit px-2 py-1 rounded-sm">
            <ArrowDownLeft className="w-3 h-3 mr-1" />
            Active Collection
          </div>
        </div>
        <div className="card-surface p-6 space-y-2">
          <p className="text-sm font-medium text-foreground/40">Total Invoices</p>
          <h3 className="text-2xl font-bold text-foreground">{(invoices || []).length}</h3>
          <p className="text-xs text-foreground/40">Across {new Set((invoices || []).map(i => i.customer?.customer_id)).size} customers</p>
        </div>
        <div className="card-surface p-6 space-y-2 border-l-4 border-l-error">
          <p className="text-sm font-medium text-foreground/40">Overdue Amount</p>
          <h3 className="text-2xl font-bold text-error">{formatCurrency((invoices || []).filter(i => i.status === 'Overdue').reduce((acc, i) => acc + Number(i.total_amount), 0))}</h3>
          <p className="text-xs text-error/60 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            {(invoices || []).filter(i => i.status === 'Overdue').length} critical invoices
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="card-surface overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-background/50">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20" />
            <input 
              type="text" 
              placeholder="Search by invoice # or customer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-sm text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex items-center space-x-2">
            {['All', 'Paid', 'Pending', 'Overdue'].map((status) => (
              <button 
                key={status}
                onClick={() => setActiveFilter(status)}
                className={`px-3 py-2 border rounded-sm text-xs transition-colors ${
                  activeFilter === status 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'border-border text-foreground/60 hover:bg-background'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/30 text-foreground/40 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Invoice Details</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold text-right">Amount</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold">Due Date</th>
                <th className="px-6 py-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-background/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">#{invoice.invoice_no}</div>
                    <div className="text-xs text-foreground/40">{new Date(invoice.invoice_date).toLocaleDateString('en-IN')}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-foreground">{invoice.customer.company_name}</div>
                    <div className="text-xs text-foreground/40">ID: {invoice.customer.customer_id}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-bold text-foreground">{formatCurrency(invoice.total_amount)}</div>
                    {invoice.paid_amount > 0 && (
                      <div className="text-[10px] text-primary">Paid: {formatCurrency(invoice.paid_amount)}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-tight border ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground/60">
                    {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('en-IN') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                        <button 
                            onClick={() => setSelectedInvoice(invoice)}
                            className="p-2 hover:bg-background rounded-sm text-foreground/20 hover:text-primary transition-all"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-background rounded-sm text-foreground/20 hover:text-foreground transition-all">
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedInvoice && (
        <InvoiceDetailModal 
            type="receivables"
            invoice={selectedInvoice}
            onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}
