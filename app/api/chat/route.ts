import { NextResponse } from 'next/server';

const AI_RESPONSES: Record<string, string> = {
  plant: "Great question! To log a new tree: go to Dashboard → click 'Add Tree' → enter species, location, and soil notes. Don't forget to mark GPS coordinates for precise tracking!",
  carbon: "Each tracked tree offsets an average of 22 kg of CO₂ per year. Your cumulative impact is shown on your Dashboard. We verify all credits annually through Gold Standard audits.",
  help: "Here's what I can help with:\n• 🌱 Planting tips & species selection\n• 📊 Dashboard & tracking questions\n• 🏆 Leaderboard & achievements\n• 🌍 Carbon offset calculations\n• 🔧 Account & settings support",
  water: "Soil moisture alerts are sent based on local weather data and species requirements. Check your notification settings in Profile → Account Settings to enable push notifications.",
  badge: "Badges are earned by reaching milestones! Current badges:\n• 🌱 First Tree (1 tree)\n• 💯 Century Club (100 trees)\n• 🌍 Carbon Fighter (1t CO₂)\n• 🏆 Forest Guardian (500 trees)\n• ⚡ Eco Warrior (10t CO₂)",
  default: "I'm TreeBot! 🌿 I'm currently running via a live server-side API stream! I can help you with planting tips, track your progress, or answer questions about TreeTracker. What would you like to know?"
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("plant") || lower.includes("tree") || lower.includes("log")) return AI_RESPONSES.plant;
  if (lower.includes("carbon") || lower.includes("co2") || lower.includes("offset")) return AI_RESPONSES.carbon;
  if (lower.includes("help") || lower.includes("what can")) return AI_RESPONSES.help;
  if (lower.includes("water") || lower.includes("moisture") || lower.includes("alert")) return AI_RESPONSES.water;
  if (lower.includes("badge") || lower.includes("achievement") || lower.includes("reward")) return AI_RESPONSES.badge;
  return AI_RESPONSES.default;
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    
    // Validate input (Basic Security)
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message format' }, { status: 400 });
    }

    // Rate Limiting Simulation (If this were a real app, you'd use Redis upstash here)
    // We'll simulate a secure API by logging the IP or request details in a real scenario
    
    const responseText = getAIResponse(message);
    
    // Simulate a stream using a TransformStream to send data chunk by chunk
    // This makes it feel like a real time LLM generating text token by token.
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    const writeStream = async () => {
      // Split into words for chunking
      const words = responseText.split(' ');
      
      // Simulate network thinking latency
      await new Promise(r => setTimeout(r, 600));

      for (let i = 0; i < words.length; i++) {
        // Send word plus space
        const chunk = words[i] + (i === words.length - 1 ? '' : ' ');
        await writer.write(encoder.encode(chunk));
        
        // Random typing delay between 20ms and 80ms per word
        await new Promise(r => setTimeout(r, 20 + Math.random() * 60));
      }
      
      await writer.close();
    };

    // Start streaming in the background
    writeStream();

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
