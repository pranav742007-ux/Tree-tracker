import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// This simulates a real-time database backend while integrating actual database counts
export async function GET() {
  // Use the current time to create a slow, deterministic upward trend
  // This ensures the data looks "live" and goes up continuously over time.
  const now = Date.now();
  
  // Base numbers (approximate to previous mock data)
  const baseTrees = 124847;
  const baseCo2 = 45200; // 45.2K
  const baseWater = 892000000; // 892M
  const baseVolunteers = 8429;
  
  // Calculate a growth factor based on seconds passed since an arbitrary epoch (e.g. today's start)
  const epoch = new Date().setHours(0,0,0,0);
  const secondsSinceEpoch = Math.floor((now - epoch) / 1000);
  
  // Get actual database tree count
  let actualDbTrees = 0;
  try {
    actualDbTrees = await prisma.tree.count();
  } catch (e) {
    console.error("Failed to fetch tree count:", e);
  }

  // Trees grow by ~1 every 5 seconds, plus the actual ones logged in the database!
  const liveTrees = baseTrees + Math.floor(secondsSinceEpoch / 5) + actualDbTrees;
  // CO2 offset grows slowly
  const liveCo2 = baseCo2 + Math.floor(secondsSinceEpoch / 15);
  // Water saved grows faster
  const liveWater = baseWater + (secondsSinceEpoch * 45);
  // Volunteers occasionally join
  const liveVolunteers = baseVolunteers + Math.floor(secondsSinceEpoch / 300);

  // Simulate a bit of random noise for realism
  const randomNoise = Math.random() * 2 - 1; 
  const survivalRate = (94.7 + (randomNoise * 0.1)).toFixed(2);

  // Generate the last 12 months of chart data dynamically
  const MOCK_CHART_DATA = [
    { year: "2021", co2: 12000 },
    { year: "2022", co2: 19000 },
    { year: "2023", co2: 28000 },
    { year: "2024", co2: 35000 },
    { year: "2025", co2: 42000 },
    { year: "2026", co2: liveCo2 }, // Live year updates
  ];

  const responseData = {
    metrics: [
      { label: "Total Trees", value: liveTrees.toLocaleString(), iconId: "trees", change: "+2.4%" },
      { label: "CO2 Offset", value: `${(liveCo2 / 1000).toFixed(1)}K tons`, iconId: "co2", change: "+5.1%" },
      { label: "Water Saved", value: `${(liveWater / 1000000).toFixed(1)}M gal`, iconId: "water", change: "+1.8%" },
      { label: "Volunteers", value: liveVolunteers.toLocaleString(), iconId: "volunteers", change: "+12.3%" },
      { label: "Survival Rate", value: `${survivalRate}%`, iconId: "survival", change: "+0.3%" },
    ],
    chartData: MOCK_CHART_DATA,
    timestamp: new Date().toISOString()
  };

  // Add Cache-Control headers to prevent caching for real-time data
  return NextResponse.json(responseData, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    }
  });
}
