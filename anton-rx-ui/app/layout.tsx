import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { LayoutGrid, MessageSquare, FileText } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anton RX Intelligence",
  description: "Medical Benefit Drug Policy Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex h-screen bg-slate-50 text-slate-900 overflow-hidden`}>
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-20 shrink-0">
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white text-xl">A</div>
              <h1 className="text-lg font-bold text-white tracking-wide">Anton RX</h1>
            </div>
            <p className="text-xs text-slate-500 mt-2 uppercase tracking-wider font-semibold">Intelligence Platform</p>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <Link href="/" className="flex items-center gap-3 hover:bg-slate-800 hover:text-white focus:bg-blue-600/10 focus:text-blue-400 px-4 py-3 rounded-lg font-medium transition-colors">
              <LayoutGrid className="w-5 h-5" />
              Coverage Matrix
            </Link>
            
            {/* NEW: AI Copilot Link */}
            <Link href="/chat" className="flex items-center gap-3 hover:bg-slate-800 hover:text-white focus:bg-blue-600/10 focus:text-blue-400 px-4 py-3 rounded-lg font-medium transition-colors">
              <MessageSquare className="w-5 h-5" />
              Policy Copilot
            </Link>
            
            <Link href="#" className="flex items-center gap-3 hover:bg-slate-800 hover:text-white px-4 py-3 rounded-lg font-medium transition-colors opacity-50 cursor-not-allowed" title="Coming soon">
              <FileText className="w-5 h-5" />
              Raw Documents
            </Link>
          </nav>
          
          <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Environment
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          {children}
        </main>
        
      </body>
    </html>
  );
}