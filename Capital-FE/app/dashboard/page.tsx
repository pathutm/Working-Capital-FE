import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  Banknote,
  Clock,
  CheckCircle2,
  TrendingUp
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Receivables", value: "$124,500", change: "+12.5%", color: "text-primary", icon: <ArrowDownLeft className="w-4 h-4" /> },
          { label: "Total Payables", value: "$84,200", change: "-2.4%", color: "text-error", icon: <ArrowUpRight className="w-4 h-4" /> },
          { label: "Working Capital", value: "$40,300", change: "+5.2%", color: "text-accent", icon: <Wallet className="w-4 h-4" /> },
          { label: "Cash on Hand", value: "$52,000", change: "+8.1%", color: "text-primary", icon: <Banknote className="w-4 h-4" /> },
        ].map((stat) => (
          <div key={stat.label} className="card-surface p-6 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground/40">{stat.label}</p>
              <div className={`p-2 rounded-sm bg-background border border-border ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
              <span className={`text-xs font-semibold ${stat.color}`}>{stat.change}</span>
            </div>
          </div>
        ))}
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
                  <p className="text-sm font-semibold text-foreground">$1,250.00</p>
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
