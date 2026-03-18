"use client";

import { useEffect, useState } from "react";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  Banknote,
  Clock,
  CheckCircle2,
  TrendingUp,
  Loader2
} from "lucide-react";
import Link from "next/link";

interface Metrics {
  totalReceivables: number;
  totalPayables: number;
  workingCapital: number;
  cashOnHand: number;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        // Dynamically get organizationId from localStorage (stored during login)
        const organizationId = localStorage.getItem("organizationId");

        if (!apiUrl || !organizationId) {
           console.error("Missing API configuration or Session");
           setLoading(false);
           return;
        }

        const response = await fetch(`${apiUrl}/dashboard/metrics?company_id=${organizationId}`);
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = [
    { 
      label: "Total Receivables", 
      value: metrics ? formatCurrency(metrics.totalReceivables) : "₹0", 
      iconColor: "text-primary", 
      icon: <ArrowDownLeft className="w-4 h-4" />,
      href: "/dashboard/receivables"
    },
    { 
      label: "Total Payables", 
      value: metrics ? formatCurrency(metrics.totalPayables) : "₹0", 
      iconColor: "text-error", 
      icon: <ArrowUpRight className="w-4 h-4" />,
      href: "/dashboard/payables"
    },
    { 
      label: "Working Capital", 
      value: metrics ? formatCurrency(metrics.workingCapital) : "₹0", 
      iconColor: "text-accent", 
      icon: <Wallet className="w-4 h-4" /> 
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const content = (
            <div className={`card-surface p-6 space-y-2 h-full ${stat.href ? 'hover:border-primary/50 cursor-pointer transition-colors' : ''}`}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground/40">{stat.label}</p>
                <div className={`p-2 rounded-sm bg-background border border-border ${stat.iconColor}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="flex items-end justify-between">
                <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
              </div>
            </div>
          );

          return stat.href ? (
            <Link key={stat.label} href={stat.href}>
              {content}
            </Link>
          ) : (
            <div key={stat.label}>{content}</div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-surface p-6 min-h-[400px]">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Monthly Cash Flow</h3>
          <div className="w-full h-[300px] bg-background flex items-center justify-center rounded-sm border border-dashed border-border text-foreground/20">
            <TrendingUp className="w-12 h-12 mb-2 opacity-10" />
            {/* Chart would go here */}
          </div>
        </div>
        <div className="card-surface p-6 min-h-[400px]">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Recent Transactions</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center text-primary">
                    <ArrowDownLeft className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">INV-2024-00{i}</p>
                    <p className="text-xs text-foreground/40">March {16 - i}, 2026</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">₹1,250.00</p>
                  <div className="flex items-center space-x-1 text-accent justify-end">
                    <CheckCircle2 className="w-3 h-3" />
                    <span className="text-xs">Paid</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
