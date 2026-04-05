import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { LayoutGrid, MessageSquare, Activity } from "lucide-react";


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
    <html lang="en" className="dark">
      <body className={`${outfit.className} flex flex-col h-screen text-slate-100 overflow-hidden relative`}>
        
        {/* --- THE BULLETPROOF ROTATED BACKGROUND --- */}
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-slate-950 flex items-center justify-center">
          <img 
            src="/images/dna_background.jpg" 
            alt="DNA Background"
            className="
              /* Force the image to be wider than the screen is tall, and taller than the screen is wide */
              min-w-[100vh] 
              min-h-[100vw]
              /* Scale it up slightly (1.25) to ensure zero black bars on the edges */
              scale-125
              /* The magic flip */
              rotate-90 
              object-cover 
              opacity-40
              /* Ensure it stays perfectly centered during the rotation */
              fixed
            "
          />
        </div>
        
        {/* TOP NAVIGATION BAR (DARK GLASS) */}
        {/* This stays exactly the same as before */}
        <header className="bg-slate-950/50 backdrop-blur-xl border-b border-white/10 shrink-0 z-50 shadow-2xl">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
              {/* The Pulse Icon Container */}
              <div className="relative flex items-center justify-center">
                {/* The main icon with a pulse animation */}
                <Activity className="w-7 h-7 text-blue-500 animate-pulse relative z-10" />
                
                {/* A soft background glow that pulses with the icon */}
                <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full animate-pulse z-0" />
              </div>

              <h1 className="text-2xl font-bold tracking-wide text-white">
                Policy <span className="text-blue-400">Pulse</span>
              </h1>
            </Link>

            <nav className="flex items-center gap-1 sm:gap-4">
              <Link href="/matrix" className="flex items-center gap-2 text-slate-300 hover:text-white hover:bg-white/10 text-sm font-semibold transition-all px-4 py-2 rounded-xl">
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </Link>
              <Link href="/chat" className="flex items-center gap-2 text-slate-300 hover:text-white hover:bg-white/10 text-sm font-semibold transition-all px-4 py-2 rounded-xl">
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">PulseBot</span>
              </Link>
              
              <div className="ml-2 sm:ml-4 pl-2 sm:pl-4 border-l border-slate-700 flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                Live
              </div>
            </nav>
            
          </div>
        </header>

        <main className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden relative">
          {children}
        </main>
        
      </body>
    </html>
  );
}