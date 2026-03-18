"use client";

import { useEffect, useState } from "react";
import { 
  ArrowLeft,
  Search,
  Filter,
  MoreVertical,
  Loader2,
  FileText,
  Eye,
  ArrowUpRight,
  ArrowDownLeft
} from "lucide-react";
import Link from "next/link";
import InvoiceDetailModal from "@/components/InvoiceDetailModal";

interface InvoiceItem {
  id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface Invoice {
  id: string;
  invoice_no: string;
  invoice_date: string;
  invoice_type: 'Sales' | 'Purchase';
  entity_name: string;
  total_amount: number;
  paid_amount: number;
  status: string;
  due_date: string | null;
  items: InvoiceItem[];
  customer?: any;
  vendor?: any;
}

export default function AllInvoicesPage() {
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

        const response = await fetch(`${apiUrl}/dashboard/invoices?company_id=${organizationId}`);
        const result = await response.json();
        setInvoices(result.data);
      } catch (error) {
        console.error("Failed to fetch all invoices:", error);
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

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoice_no.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inv.entity_name.toLowerCase().includes(searchTerm.toLowerCase());
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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="p-2 hover:bg-background rounded-sm transition-colors border border-border">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">All Invoices</h1>
            <p className="text-sm text-foreground/40">Consolidated view of Sales and Purchase records</p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="card-surface overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-background/50">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20" />
            <input 
              type="text" 
              placeholder="Search invoices..." 
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
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Reference</th>
                <th className="px-6 py-4 font-semibold">Entity</th>
                <th className="px-6 py-4 font-semibold text-right">Amount</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-background/20 transition-colors group">
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase ${
                      invoice.invoice_type === 'Sales' ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'
                    }`}>
                      {invoice.invoice_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-foreground">#{invoice.invoice_no}</td>
                  <td className="px-6 py-4 text-sm text-foreground/60">{invoice.entity_name}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-bold text-foreground">{formatCurrency(invoice.total_amount)}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                     <span className="text-[10px] text-foreground/40 border border-border px-2 py-0.5 rounded-sm uppercase font-bold">
                        {invoice.status}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground/40">
                    {new Date(invoice.invoice_date).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-6 py-4 text-right cursor-default">
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
            type={selectedInvoice.invoice_type === 'Sales' ? 'receivables' : 'payables'}
            invoice={selectedInvoice}
            onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}
