"use client";

import { useState, useEffect } from "react";

// Updated to match the exact problem statement criteria
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
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Selection state for comparison
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  useEffect(() => {
    // Simulating the fetch - replace with your actual fetch logic
    const fetchPolicies = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/policies");
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

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= 3) return prev; // Let them compare up to 3 now!
      return [...prev, id];
    });
  };

  const filteredPolicies = policies.filter(p => 
    p.drugName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.payerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.requiredDiagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get the actual data objects for the comparison table
  const selectedPolicies = policies.filter(p => selectedIds.includes(p.id));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Navbar */}
      <nav className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center shadow-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold text-xl">A</div>
          <h1 className="text-xl font-bold tracking-wide">Anton RX <span className="font-light text-blue-400">Intelligence</span></h1>
        </div>
        <span className="text-sm font-medium bg-slate-800 border border-slate-700 px-4 py-1.5 rounded-full">
          Medical Benefit Formulary
        </span>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        
        {/* Search Engine Header */}
        <section className="mb-10 bg-white rounded-2xl p-10 shadow-sm border border-slate-200">
          <h2 className="text-3xl font-extrabold mb-2 text-slate-800">Medical Policy Cross-Walk</h2>
          <p className="text-slate-500 mb-8 max-w-3xl text-lg">
            Instantly search and compare medical benefit coverage, step therapy, and site-of-care requirements across all health plans.
          </p>
          <div className="relative">
            <svg className="absolute left-4 top-4 h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search by Drug (e.g., Rituxan), Payer, or Diagnosis..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-xl border-2 border-slate-200 text-slate-900 text-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </section>

        {/* Results Grid */}
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl font-bold text-slate-800">Available Policies</h2>
          <span className="text-sm text-slate-500 font-medium">Select up to 3 to compare</span>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-slate-500 animate-pulse font-medium text-lg">
            Indexing medical policies...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolicies.map((policy) => {
              const isSelected = selectedIds.includes(policy.id);
              return (
                <div 
                  key={policy.id} 
                  onClick={() => toggleSelection(policy.id)}
                  className={`cursor-pointer p-6 rounded-xl shadow-sm border-2 transition-all ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-white hover:border-blue-300'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{policy.payerName}</span>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                      {isSelected && <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">{policy.drugName}</h3>
                  <p className="text-sm text-slate-600 font-medium mb-5 truncate">Dx: {policy.requiredDiagnosis}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-100 p-2 rounded flex flex-col">
                      <span className="text-slate-400 uppercase text-[10px] font-bold">Prior Auth</span>
                      <span className="font-semibold text-slate-700">{policy.priorAuth}</span>
                    </div>
                    <div className="bg-slate-100 p-2 rounded flex flex-col">
                      <span className="text-slate-400 uppercase text-[10px] font-bold">Site of Care</span>
                      <span className="font-semibold text-slate-700 truncate">{policy.siteOfCare}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-40 flex justify-center items-center gap-6">
          <span className="font-bold text-slate-700">{selectedIds.length} Policies Selected</span>
          <button 
            onClick={() => setShowCompareModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold shadow-md transition-colors"
          >
            Generate Matrix Comparison
          </button>
        </div>
      )}

      {/* Matrix Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Medical Benefit Policy Matrix</h2>
                <p className="text-slate-500 text-sm mt-1">Cross-walking requirements for selected policies</p>
              </div>
              <button onClick={() => setShowCompareModal(false)} className="text-slate-400 hover:text-slate-700 text-2xl font-bold leading-none">&times;</button>
            </div>

            <div className="p-6 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 border-b-2 border-slate-200 text-slate-400 font-bold uppercase text-xs w-1/4">Criteria</th>
                    {selectedPolicies.map(p => (
                      <th key={p.id} className="p-4 border-b-2 border-slate-200 text-lg font-bold text-slate-800 w-1/4">
                        {p.payerName}
                        <div className="text-blue-600 text-sm font-medium">{p.drugName}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-700">Coverage Status</td>
                    {selectedPolicies.map(p => <td key={p.id} className="p-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">{p.isCovered}</span></td>)}
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-700">Required Diagnosis</td>
                    {selectedPolicies.map(p => <td key={p.id} className="p-4 text-slate-600">{p.requiredDiagnosis}</td>)}
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-700">Step Therapy (Try First)</td>
                    {selectedPolicies.map(p => <td key={p.id} className="p-4 text-slate-600">{p.stepTherapy}</td>)}
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-700">Prior Auth Required</td>
                    {selectedPolicies.map(p => <td key={p.id} className="p-4 font-semibold text-slate-800">{p.priorAuth}</td>)}
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-700">Site of Care Limits</td>
                    {selectedPolicies.map(p => <td key={p.id} className="p-4 text-slate-600">{p.siteOfCare}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}