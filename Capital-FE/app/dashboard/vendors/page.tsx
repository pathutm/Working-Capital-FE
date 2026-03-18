"use client";

import { useEffect, useState } from "react";
import { 
  ArrowLeft,
  Search,
  Filter,
  MoreVertical,
  Loader2,
  Store,
  Mail,
  Phone,
  Landmark
} from "lucide-react";
import Link from "next/link";

interface Vendor {
  id: string;
  company_name: string;
  vendor_id: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  purchaseInvoices: { total_amount: number; status: string; paid_amount: number }[];
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const organizationId = localStorage.getItem("organizationId");
        
        if (!apiUrl || !organizationId) return;

        const response = await fetch(`${apiUrl}/dashboard/vendors?company_id=${organizationId}`);
        const result = await response.json();
        setVendors(result.data);
      } catch (error) {
        console.error("Failed to fetch vendors:", error);
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

  const filteredVendors = (vendors || []).filter(v => 
    v.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.vendor_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Vendors</h1>
            <p className="text-sm text-foreground/40">Manage your suppliers and procurement partners</p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-surface p-6 space-y-2">
           <p className="text-sm font-medium text-foreground/40">Total Suppliers</p>
           <h3 className="text-2xl font-bold text-foreground">{(vendors || []).length}</h3>
        </div>
        <div className="card-surface p-6 space-y-2 border-l-4 border-l-error/30">
           <p className="text-sm font-medium text-foreground/40">Total Outstanding Payables</p>
           <h3 className="text-2xl font-bold text-error">
             {formatCurrency((vendors || []).reduce((acc, v) => acc + (v.purchaseInvoices || []).reduce((sacc, i) => sacc + (Number(i.total_amount) - Number(i.paid_amount || 0)), 0), 0))}
           </h3>
        </div>
        <div className="card-surface p-6 space-y-2">
           <p className="text-sm font-medium text-foreground/40">Strategic Partners</p>
           <h3 className="text-2xl font-bold text-accent">{(vendors || []).filter(v => (v.purchaseInvoices || []).length > 5).length}</h3>
        </div>
      </div>

      {/* Table Section */}
      <div className="card-surface overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-background/50">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20" />
            <input 
              type="text" 
              placeholder="Search vendors..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-sm text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-3 py-2 border border-border rounded-sm text-sm hover:bg-background transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/30 text-foreground/40 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Vendor Name</th>
                <th className="px-6 py-4 font-semibold">Contact Details</th>
                <th className="px-6 py-4 font-semibold text-right">Procurement Volume</th>
                <th className="px-6 py-4 font-semibold text-center">Bills</th>
                <th className="px-6 py-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-background/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-sm bg-error/5 border border-error/10 flex items-center justify-center text-error font-bold">
                            {vendor.company_name.charAt(0)}
                        </div>
                        <div>
                            <div className="text-sm font-bold text-foreground">{vendor.company_name}</div>
                            <div className="text-xs text-foreground/40">ID: {vendor.vendor_id}</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 space-y-1">
                    {vendor.email && (
                        <div className="flex items-center text-xs text-foreground/60">
                            <Mail className="w-3 h-3 mr-2 opacity-40" />
                            {vendor.email}
                        </div>
                    )}
                    {vendor.phone && (
                        <div className="flex items-center text-xs text-foreground/60">
                            <Phone className="w-3 h-3 mr-2 opacity-40" />
                            {vendor.phone}
                        </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-bold text-foreground">
                        {formatCurrency((vendor.purchaseInvoices || []).reduce((acc, i) => acc + (Number(i.total_amount) - Number(i.paid_amount || 0)), 0))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex justify-center flex-col items-center">
                        <div className="text-sm font-semibold">{(vendor.purchaseInvoices || []).length}</div>
                        <div className="text-[10px] uppercase text-foreground/40 font-bold">Invoices</div>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-background rounded-sm text-foreground/20 hover:text-foreground transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
