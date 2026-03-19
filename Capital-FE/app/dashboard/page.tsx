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
  Loader2,
  DollarSign, 
  AlertCircle,
  BarChart as BarChartIcon
} from "lucide-react";
import Link from "next/link";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  Cell
} from 'recharts';

interface OverdueInvoice {
  id: string;
  invoice_no: string;
  invoice_date: string;
  due_date: string;
  total_amount: number;
  paid_amount: number;
  status: string;
  entityName: string;
}

interface MonthlyData {
  name: string;
  sales: number;
  purchases: number;
}

interface Metrics {
  totalReceivables: number;
  totalPayables: number;
  netWorkingCapital: number;
  cashOnHand: number;
  overdueReceivables: OverdueInvoice[];
  overduePayables: OverdueInvoice[];
  monthlyInvoiceData: MonthlyData[];
}

const CustomTooltip = ({ active, payload, label, formatCurrency }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 backdrop-blur-md border border-white/10 p-3 rounded-sm shadow-2xl animate-in fade-in zoom-in duration-300">
        <p className="text-[10px] uppercase tracking-wider font-bold text-white/40 mb-2">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.fill }}></div>
                <span className="text-xs font-medium text-white/80">{entry.name === 'sales' ? 'Sales' : 'Purchases'}</span>
              </div>
              <span className="text-xs font-bold text-white">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>("All");

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
      value: metrics ? formatCurrency(metrics.netWorkingCapital) : "₹0", 
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
        {/* Monthly Comparison Chart */}
        <div className="card-surface p-6 min-h-[480px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-foreground">Monthly Comparison</h3>
              <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-tight">Financial Inflow vs Outflow</p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-background border border-border text-[10px] font-bold uppercase px-2 py-1 rounded-sm focus:outline-none focus:border-primary transition-colors cursor-pointer"
              >
                <option value="All">All Years</option>
                {Array.from(new Set(metrics?.monthlyInvoiceData.map(d => d.name.split(' ')[1]) || [])).sort().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <div className="h-4 w-px bg-border mx-1"></div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.4)]"></div>
                    <span className="text-[10px] font-bold text-foreground/60 uppercase tracking-tighter">Sales</span>
                </div>
                <div className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 rounded-full bg-error shadow-[0_0_8px_rgba(var(--error-rgb),0.4)]"></div>
                    <span className="text-[10px] font-bold text-foreground/60 uppercase tracking-tighter">Purchases</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full min-h-[320px]">
            {metrics?.monthlyInvoiceData && metrics.monthlyInvoiceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={selectedYear === "All" 
                    ? metrics.monthlyInvoiceData 
                    : metrics.monthlyInvoiceData.filter(d => d.name.endsWith(selectedYear))
                  }
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                  barGap={12}
                >
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={1}/>
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.6}/>
                    </linearGradient>
                    <linearGradient id="purchaseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--error)" stopOpacity={1}/>
                      <stop offset="100%" stopColor="var(--error)" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: 700 }}
                    dy={12}
                    tickFormatter={(value) => value.split(' ')[0]} // Show only month name on axis if year filtered? No, keep it clean.
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: 700 }}
                    tickFormatter={(value) => value === 0 ? '0' : `₹${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    content={<CustomTooltip formatCurrency={formatCurrency} />}
                  />
                  <Bar 
                    name="sales"
                    dataKey="sales" 
                    fill="url(#salesGradient)" 
                    radius={[2, 2, 0, 0]} 
                    barSize={selectedYear === "All" ? 20 : 40}
                    animationDuration={1500}
                  />
                  <Bar 
                    name="purchases"
                    dataKey="purchases" 
                    fill="url(#purchaseGradient)" 
                    radius={[2, 2, 0, 0]} 
                    barSize={selectedYear === "All" ? 20 : 40}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-background/50 flex flex-col items-center justify-center rounded-sm border border-dashed border-border text-foreground/20">
                <BarChartIcon className="w-12 h-12 mb-2 opacity-10" />
                <p className="text-sm font-medium italic">Preparing your financial overview...</p>
              </div>
            )}
          </div>
        </div>
        <div className="card-surface p-6 min-h-[400px] flex flex-col">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Overdue Status</h3>
          <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            {/* Overdue Receivables */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Overdue Receivables</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                    {metrics?.overdueReceivables.length || 0} Invoices
                  </span>
                  <Link href="/dashboard/receivables" className="text-[10px] text-primary hover:underline font-bold uppercase">
                    View All
                  </Link>
                </div>
              </div>
              <div className="space-y-3">
                {metrics?.overdueReceivables.length === 0 ? (
                  <p className="text-sm text-foreground/40 italic py-2">No overdue receivables</p>
                ) : (
                  metrics?.overdueReceivables.map((inv) => (
                    <Link key={inv.id} href={`/dashboard/receivables?search=${inv.invoice_no}`} className="block group/item">
                      <div className="flex items-center justify-between p-3 rounded-sm bg-background/50 border border-border group-hover/item:border-primary/30 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-sm bg-primary/10 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-colors">
                            <ArrowDownLeft className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground line-clamp-1 group-hover/item:text-primary transition-colors">{inv.entityName}</p>
                            <p className="text-[10px] text-foreground/40 font-medium">Due: {new Date(inv.due_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} • {inv.invoice_no}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-foreground">{formatCurrency(inv.total_amount - inv.paid_amount)}</p>
                          <p className="text-[10px] text-error font-bold uppercase italic">Overdue</p>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Overdue Payables */}
            <div>
              <div className="flex items-center justify-between mb-3 pt-2">
                <h4 className="text-sm font-bold text-error uppercase tracking-wider">Overdue Payables</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] bg-error/10 text-error px-2 py-0.5 rounded-full font-bold">
                    {metrics?.overduePayables.length || 0} Invoices
                  </span>
                  <Link href="/dashboard/payables" className="text-[10px] text-error hover:underline font-bold uppercase">
                    View All
                  </Link>
                </div>
              </div>
              <div className="space-y-3">
                {metrics?.overduePayables.length === 0 ? (
                  <p className="text-sm text-foreground/40 italic py-2">No overdue payables</p>
                ) : (
                  metrics?.overduePayables.map((inv) => (
                    <Link key={inv.id} href={`/dashboard/payables?search=${inv.invoice_no}`} className="block group/item">
                      <div className="flex items-center justify-between p-3 rounded-sm bg-background/50 border border-border group-hover/item:border-error/30 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-sm bg-error/10 flex items-center justify-center text-error group-hover/item:bg-error group-hover/item:text-white transition-colors">
                            <ArrowUpRight className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground line-clamp-1 group-hover/item:text-error transition-colors">{inv.entityName}</p>
                            <p className="text-[10px] text-foreground/40 font-medium">Due: {new Date(inv.due_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} • {inv.invoice_no}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-foreground">{formatCurrency(inv.total_amount - inv.paid_amount)}</p>
                          <p className="text-[10px] text-error font-bold uppercase italic">Overdue</p>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
