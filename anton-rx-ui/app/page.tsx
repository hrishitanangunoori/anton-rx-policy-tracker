import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutGrid, MessageSquare, Activity } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-transparent relative overflow-hidden h-full">

      <div className="z-10 text-center px-6 mb-24 flex flex-col items-center">
        
        {/* Animated Icon (Dark Mode adjusted) */}
        <div className="inline-flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md text-blue-400 rounded-3xl mb-8 shadow-2xl border border-white/10">
          <Activity className="w-10 h-10" />
        </div>

        {/* Massive Hero Title */}
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-white mb-6 drop-shadow-lg">
          Policy <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Pulse</span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mb-12 font-medium drop-shadow-md">
          The centralized intelligence engine for medical benefit drug coverage, step therapy, and prior authorization.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link href="/matrix">
            <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all border border-blue-500">
              <LayoutGrid className="mr-2 h-5 w-5" />
              Explore the Matrix
            </Button>
          </Link>
          <Link href="/chat">
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg rounded-xl border border-white/20 hover:bg-white/10 shadow-sm transition-all text-slate-200 bg-slate-900/50 backdrop-blur-md">
              <MessageSquare className="mr-2 h-5 w-5" />
              Ask the Copilot
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}