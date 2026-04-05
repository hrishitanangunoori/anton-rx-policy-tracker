"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";

// Shadcn UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface PolicyData {
  id: string;
  payerName: string;
  drugName: string;
  isCovered: string;
  requiredDiagnosis: string;
  stepTherapy: string;
  priorAuth: string;
  siteOfCare: string;
}

export default function Home() {
  const [policies, setPolicies] = useState<PolicyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [coverageFilter, setCoverageFilter] = useState("All");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Deep Dive State
  const [selectedDrug, setSelectedDrug] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/policies");
        if (response.ok) {
          const data = await response.json();
          setPolicies(data);
        }
      } catch (error) {
        console.error("Error fetching policies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOrder, coverageFilter]);

  // --- DATA TRANSFORMATION ---
  const uniquePayers = Array.from(new Set(policies.map(p => p.payerName))).sort();
  const uniqueDrugs = Array.from(new Set(policies.map(p => p.drugName)));

  let processedDrugs = uniqueDrugs.filter(drug => 
    drug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (coverageFilter !== "All") {
    processedDrugs = processedDrugs.filter(drug => {
      const policyMatch = policies.find(p => p.drugName === drug && p.payerName === coverageFilter);
      return policyMatch && policyMatch.isCovered.toLowerCase() === "covered";
    });
  }

  processedDrugs.sort((a, b) => {
    if (sortOrder === "asc") return a.localeCompare(b);
    return b.localeCompare(a);
  });

  const totalPages = Math.ceil(processedDrugs.length / itemsPerPage);
  const paginatedDrugs = processedDrugs.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  // Enterprise Status Badges
  const getStatusBadge = (status: string | undefined) => {
    if (!status) return <span className="text-muted-foreground italic text-xs">No Data</span>;
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes("not covered")) return <Badge variant="destructive">Not Covered</Badge>;
    if (lowerStatus.includes("covered")) return <Badge className="bg-emerald-500 hover:bg-emerald-600">Covered</Badge>;
    return <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">{status}</Badge>;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent relative">
      
      {/* HEADER & FILTER BAR */}
      <header className="bg-slate-950/40 backdrop-blur-md border-b border-white/10 px-8 py-6 shrink-0 z-10 shadow-lg">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Coverage Matrix</h2>
        
        <div className="flex flex-col md:flex-row gap-4 max-w-5xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by Drug Name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
          
          <Select value={coverageFilter} onValueChange={setCoverageFilter}>
            <SelectTrigger className="w-[200px] h-10">
              <SelectValue placeholder="All Coverage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Coverage</SelectItem>
              <SelectGroup>
                <SelectLabel>Covered By:</SelectLabel>
                {uniquePayers.map(payer => (
                  <SelectItem key={payer} value={payer}>{payer}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={(val) => setSortOrder(val as "asc" | "desc")}>
            <SelectTrigger className="w-[140px] h-10">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">A - Z</SelectItem>
              <SelectItem value="desc">Z - A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* MAIN CONTENT: The Matrix Table */}
      <div className="flex-1 p-8 flex flex-col min-h-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground animate-pulse">
            <p className="font-medium">Compiling Cross-Payer Matrix...</p>
          </div>
        ) : (
          <>
            <Card className="flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-900/50 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl">
              <div className="overflow-auto flex-1 relative">
                <Table>
                  <TableHeader className="bg-muted/50 sticky top-0 z-30 shadow-sm">
                    <TableRow>
                      <TableHead className="w-[250px] font-bold uppercase tracking-wider text-xs sticky left-0 z-40 bg-slate-950/80 backdrop-blur-md border-r border-white/10 text-slate-300">
                        Medical Benefit Drug
                        </TableHead>
                      {uniquePayers.map(payer => (
                        <TableHead key={payer} className="font-bold text-foreground">
                          {payer}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedDrugs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={uniquePayers.length + 1} className="h-24 text-center">
                          No drugs found matching your criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedDrugs.map(drug => (
                        <TableRow key={drug} className="group hover:bg-muted/50">
                          <TableCell 
                          onClick={() => setSelectedDrug(drug)}
                          className="font-bold text-blue-400 hover:text-blue-300 sticky left-0 z-20 bg-slate-900/80 backdrop-blur-md group-hover:bg-slate-800/90 border-r border-white/10 cursor-pointer hover:underline transition-colors"
                            >
                          {drug}
                        </TableCell>
                          {uniquePayers.map(payer => {
                            const policyMatch = policies.find(p => p.drugName === drug && p.payerName === payer);
                            return (
                              <TableCell key={`${drug}-${payer}`}>
                                {getStatusBadge(policyMatch?.isCovered)}
                                {policyMatch && (
                                  <div className="text-[10px] text-muted-foreground mt-1 uppercase font-semibold">
                                    PA: {policyMatch.priorAuth}
                                  </div>
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * itemsPerPage, processedDrugs.length)}</span> of <span className="font-medium text-foreground">{processedDrugs.length}</span> drugs
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* --- SHADCN DIALOG (DEEP DIVE MODAL) --- */}
      <Dialog open={!!selectedDrug} onOpenChange={(open) => !open && setSelectedDrug(null)}>
        <DialogContent className="sm:max-w-[95vw] lg:max-w-6xl w-full h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-slate-950/80 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl">
          
          {/* Modal Header */}
          <DialogHeader className="p-6 sm:p-8 border-b border-white/10 bg-slate-900/50 shrink-0">
            <DialogTitle className="text-3xl font-extrabold text-white">{selectedDrug}</DialogTitle>
            <DialogDescription className="text-blue-400 font-medium text-base mt-1">
              Cross-Payer Deep Dive Report
            </DialogDescription>
          </DialogHeader>

          {/* Modal Body - Set to transparent so the glass effect isn't muddied */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-transparent w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              
              {uniquePayers.map(payer => {
                const policy = policies.find(p => p.drugName === selectedDrug && p.payerName === payer);
                if (!policy) return null;

                return (
                  <Card key={payer} className="w-full flex flex-col overflow-hidden bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-xl">
                    
                    {/* Card Header */}
                    <CardHeader className="bg-slate-800/50 border-b border-white/10 pb-4 pt-4 flex flex-row justify-between items-center space-y-0 shrink-0">
                      <CardTitle className="text-lg font-bold text-slate-100 truncate pr-4" title={payer}>{payer}</CardTitle>
                      {getStatusBadge(policy.isCovered)}
                    </CardHeader>
                    
                    {/* Card Content */}
                    <CardContent className="pt-6 space-y-6 flex-1 flex flex-col min-w-0">
                      
                      {/* Required Diagnosis */}
                      <div className="w-full">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Required Diagnosis</p>
                        <p className="text-sm font-medium text-slate-200 leading-relaxed break-words">{policy.requiredDiagnosis}</p>
                      </div>
                      
                      {/* Inner Grid for PA and Site of Care */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/50 p-4 rounded-xl border border-white/5 w-full">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Prior Auth</p>
                          <p className="text-sm font-bold text-slate-200 truncate">{policy.priorAuth}</p>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Site of Care</p>
                          <p className="text-sm font-bold text-slate-200 truncate" title={policy.siteOfCare}>{policy.siteOfCare}</p>
                        </div>
                      </div>

                      {/* Step Therapy Box - Upgraded to Dark Mode Neon Orange */}
                      <div className="flex-1 w-full">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Step Therapy (Try First)</p>
                        <div className="bg-orange-500/10 text-orange-300 border border-orange-500/20 p-4 rounded-xl h-full w-full">
                          <p className="text-sm leading-relaxed break-words">{policy.stepTherapy}</p>
                        </div>
                      </div>

                    </CardContent>
                  </Card>
                );
              })}

            </div>
          </div>
        </DialogContent>
      </Dialog>
      
    </div>
  );
}