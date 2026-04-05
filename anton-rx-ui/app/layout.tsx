import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { LayoutGrid, MessageSquare } from "lucide-react";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Policy Pulse | Anton RX",
  description: "Medical Benefit Drug Policy Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // THE FIX: Added "dark" class to html to trigger Shadcn's dark mode variables automatically!
    <html lang="en" className="dark">
      <body className={`${outfit.className} flex flex-col h-screen text-slate-100 overflow-hidden relative`}>
        
        {/* --- THE DARK ANIMATED BACKGROUND --- */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pooutfit-events-none bg-slate-950">
          <div 
            className="absolute top-[10%] left-[10%] w-[300px] h-[300px] rounded-full mix-blend-screen filter blur-[70px] opacity-40 animate-blob"
            style={{ backgroundColor: 'var(--color-orb-1)' }}
          />
          <div 
            className="absolute top-[20%] right-[15%] w-[400px] h-[400px] rounded-full mix-blend-screen filter blur-[80px] opacity-40 animate-blob animation-delay-2000"
            style={{ backgroundColor: 'var(--color-orb-2)' }}
          />
          <div 
            className="absolute bottom-[10%] left-[20%] w-[350px] h-[350px] rounded-full mix-blend-screen filter blur-[70px] opacity-40 animate-blob animation-delay-4000"
            style={{ backgroundColor: 'var(--color-orb-3)' }}
          />
          <div 
            className="absolute bottom-[20%] right-[20%] w-[250px] h-[250px] rounded-full mix-blend-screen filter blur-[60px] opacity-40 animate-blob animation-delay-6000"
            style={{ backgroundColor: 'var(--color-orb-4)' }}
          />
        </div>
        
        {/* TOP NAVIGATION BAR (DARK GLASS) */}
        <header className="bg-slate-950/50 backdrop-blur-xl border-b border-white/10 shrink-0 z-50 shadow-2xl">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-blue-600/90 rounded flex items-center justify-center font-bold text-white text-xl shadow-inner border border-blue-400/30">A</div>
              <h1 className="text-xl font-bold tracking-wide text-white">
                Anton RX <span className="font-light text-slate-400 hidden sm:inline">| Policy Pulse</span>
              </h1>
            </Link>

            <nav className="flex items-center gap-1 sm:gap-4">
              <Link href="/matrix" className="flex items-center gap-2 text-slate-300 hover:text-white hover:bg-white/10 text-sm font-semibold transition-all px-4 py-2 rounded-xl">
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Matrix</span>
              </Link>
              <Link href="/chat" className="flex items-center gap-2 text-slate-300 hover:text-white hover:bg-white/10 text-sm font-semibold transition-all px-4 py-2 rounded-xl">
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Copilot</span>
              </Link>
              
              <div className="ml-2 sm:ml-4 pl-2 sm:pl-4 border-l border-slate-700 flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                Live
              </div>
            </nav>
            
          </div>
        </header>

        <main className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
          {children}
        </main>
        
      </body>
    </html>
  );
}