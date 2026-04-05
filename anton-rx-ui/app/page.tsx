"use client"; // This tells Next.js this is an interactive client-side component

import { useState, useEffect } from "react";

// The shape of your data
interface PolicyData {
  id: string;
  documentName: string;
  extractedSummary: string;
  confidenceScore: number;
}

export default function Home() {
  // Set up state to hold our live data and track if it's loading
  const [policies, setPolicies] = useState<PolicyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect runs automatically when the page loads
  useEffect(() => {
    // Define the async function to grab data from FastAPI
    const fetchPolicies = async () => {
      try {
        // Change this URL to wherever your FastAPI endpoint is running
        const response = await fetch("http://127.0.0.1:8000/api/policies"); 
        
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        
        const data = await response.json();
        setPolicies(data); // Save the fresh data into state
      } catch (error) {
        console.error("Error fetching policies:", error);
      } finally {
        setIsLoading(false); // Turn off the loading spinner
      }
    };

    fetchPolicies();
  }, []); // The empty array ensures this only runs once per page load

  return (
    <main className="min-h-screen p-8 bg-gray-50 text-gray-900">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-extrabold tracking-tight">Anton RX Tracker</h1>
        <p className="text-gray-500 mt-2">Parsed Policy Dashboard</p>
      </header>

      {/* Show a loading message while waiting for Python backend */}
      {isLoading ? (
        <div className="text-center text-gray-500 mt-10 animate-pulse">
          Connecting to data pipeline...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Loop through the LIVE data instead of mock data */}
          {policies.map((policy) => (
            <div key={policy.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-transform hover:scale-105">
              <h2 className="text-xl font-bold text-blue-600 mb-2">{policy.documentName}</h2>
              <p className="text-sm text-gray-700 mb-4">{policy.extractedSummary}</p>
              
              <div className="flex justify-between items-center text-xs text-gray-400 font-medium">
                <span>ID: {policy.id}</span>
                <span>AI Confidence: {(policy.confidenceScore * 100).toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}