"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  Waves,
  LogOut,
  X,
  AlertCircle
} from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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

  const handleLogout = () => {
    window.location.href = "/";
  };

  return (
    <>
      <aside className="w-64 h-full bg-card border-r border-border flex flex-col pt-6 overflow-hidden">
        <div className="px-6 mb-8 flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center shadow-lg shadow-primary/20">
            <Waves className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-primary tracking-tight leading-none">CapFlow</span>
            <span className="text-[10px] font-medium text-foreground/40 uppercase tracking-widest mt-1">Working Capital</span>
          </div>
        </div>

        <nav className="flex-1 space-y-6 px-4 overflow-y-auto custom-scrollbar">
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
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center space-x-3 px-3 py-3 hover:bg-background rounded-sm transition-all group border border-transparent hover:border-border cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
              AD
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">Admin</p>
              <p className="text-xs text-foreground/40 truncate">admin@snssquare.com</p>
            </div>
            <LogOut className="w-4 h-4 text-foreground/20 group-hover:text-error transition-colors" />
          </button>
        </div>
      </aside>

      {showLogoutConfirm && (
        <div 
          onClick={() => setShowLogoutConfirm(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-card w-full max-w-sm rounded-md shadow-2xl border border-border p-6 scale-in-center animate-in zoom-in-95 duration-200 cursor-default"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-error/10 rounded-sm">
                <AlertCircle className="w-6 h-6 text-error" />
              </div>
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="p-1 hover:bg-background rounded-sm transition-colors text-foreground/40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-2 mb-6">
              <h3 className="text-lg font-bold text-foreground">Sign Out</h3>
              <p className="text-sm text-foreground/60">
                Are you sure you want to sign out of your account? You will need to login again to access your dashboard.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-sm hover:bg-accent/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 px-4 py-2 text-sm font-bold text-error bg-white border-2 border-error hover:bg-error/5 rounded-sm shadow-md transition-all uppercase tracking-wider"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
