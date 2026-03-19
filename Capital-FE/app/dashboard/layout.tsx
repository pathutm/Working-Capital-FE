import Sidebar from "@/components/Sidebar";
import { Bell, Search } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-foreground">Overview</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="pl-10 pr-4 py-2 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all w-64"
              />
            </div>
            <button className="p-2 hover:bg-background rounded-sm transition-colors text-foreground/60 hover:text-primary">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8 font-sans">
          {children}
        </div>
      </main>
    </div>
  );
}
