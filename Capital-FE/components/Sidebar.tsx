"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  LayoutGrid, 
  Zap, 
  ArrowDownUp, 
  ReceiptText, 
  TrendingUp, 
  Users, 
  Truck, 
  Box, 
  CalendarClock,
  ArrowDownLeft,
  ArrowUpRight,
  Briefcase,
  Waves
} from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();

  const menuGroups = [
    {
      title: "Overview",
      icon: <LayoutGrid className="w-4 h-4" />,
      items: [
        { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
        { name: "AI Alerts", href: "/dashboard/ai-alerts", icon: <Zap className="w-4 h-4" /> },
      ],
    },
    {
      title: "Transactions",
      icon: <ArrowDownUp className="w-4 h-4" />,
      items: [
        { name: "Receivables", href: "/dashboard/receivables", icon: <ArrowDownLeft className="w-4 h-4" /> },
        { name: "Payables", href: "/dashboard/payables", icon: <ArrowUpRight className="w-4 h-4" /> },
        { name: "Invoices", href: "/dashboard/invoices", icon: <ReceiptText className="w-4 h-4" /> },
      ],
    },
    {
      title: "Management",
      icon: <Briefcase className="w-4 h-4" />,
      items: [
        { name: "Customers", href: "/dashboard/customers", icon: <Users className="w-4 h-4" /> },
        { name: "Vendors", href: "/dashboard/vendors", icon: <Truck className="w-4 h-4" /> },
        { name: "Inventory", href: "/dashboard/inventory", icon: <Box className="w-4 h-4" /> },
      ],
    },
    {
      title: "Intelligence",
      icon: <TrendingUp className="w-4 h-4" />,
      items: [
        { name: "Aging Buckets", href: "/dashboard/aging-buckets", icon: <CalendarClock className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col pt-6">
      <div className="px-6 mb-8 flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center shadow-lg shadow-primary/20">
          <Waves className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold text-primary tracking-tight leading-none">CapFlow</span>
          <span className="text-[10px] font-medium text-foreground/40 uppercase tracking-widest mt-1">Working Capital</span>
        </div>
      </div>

      <nav className="flex-1 space-y-6 px-4">
        {menuGroups.map((group) => (
          <div key={group.title} className="space-y-2">
            <div className="flex items-center space-x-2 px-2 text-xs font-semibold text-foreground/40 uppercase tracking-wider">
              {group.icon}
              <span>{group.title}</span>
            </div>
            <div className="space-y-1">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-sm transition-colors ${
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/60 hover:bg-background hover:text-foreground"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">John Doe</p>
            <p className="text-xs text-foreground/40 truncate">admin@capflow.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
