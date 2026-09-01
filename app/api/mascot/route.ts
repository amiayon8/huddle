import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages, userProfile, sprintContext, actionType } = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || 'minimax/minimax-m3:free';

    const systemPrompt = `You are Pip, the calm, friendly, and supportive AI Mascot for "Huddle" — a deliberate practice app that turns skill learning into 1 actionable daily step to beat doomscroll guilt.
User Name: ${userProfile?.name || 'Alex'}
Current Skill Focus: ${sprintContext?.skillTitle || 'System Architecture'}
Career Milestone Target: ${userProfile?.careerMilestone || 'Staff Systems Architect'}
Current Sprint: ${sprintContext?.durationDays || 4}-Day Sprint (Day ${sprintContext?.currentDay || 2})

Your Tone & Rules:
1. Casual, warm, non-corporate, and encouraging. Never sound like a corporate boss or an intrusive stats robot.
2. If the user missed a day or is busy, reassure them that consistency beats intensity and offer to reshuffle their sprint without penalties.
3. If they ask about learning, break concepts down into simple, high-leverage mental models with bite-sized actionable steps.
4. Keep responses concise (2-4 short sentences or bullet points) so it feels conversational and easy to read.
5. If the user asks for a sprint schedule or recommendations, suggest 1-3 concrete 15-20 min tasks referencing real-world engineering concepts.`;

    const openRouterMessages = [
      { role: 'system', content: systemPrompt },
      ...(messages || []).map((m: { sender: string; text: string }) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }))
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://huddle.dev',
        'X-Title': 'Huddle App Mascot',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: openRouterMessages,
        temperature: 0.7,
        max_tokens: 350
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter error:', errorText);
      // Fallback response if model is busy or rate limited
      return NextResponse.json({
        reply: `Pip here! I noticed you are making steady headway on ${sprintContext?.skillTitle || 'your daily practice'}. Ready to knock out today's 18-minute session?`,
        mascotSvg: '/mascot_encouragement.svg'
      });
    }

    const data = await response.json();
    const replyText = data.choices?.[0]?.message?.content || "Keep up the great momentum! Consistency beats intensity every single time.";

    // Choose mascot SVG emotion based on content
    let mascotSvg = '/mascot_encouragement.svg';
    const lower = replyText.toLowerCase();
    if (lower.includes('reshuffle') || lower.includes('plan') || lower.includes('step')) {
      mascotSvg = '/mascot_planning.svg';
    } else if (lower.includes('great') || lower.includes('congrats') || lower.includes('done') || lower.includes('spot on')) {
      mascotSvg = '/mascot_success.svg';
    } else if (lower.includes('think') || lower.includes('architecture') || lower.includes('pattern')) {
      mascotSvg = '/mascot_deep_thinking.svg';
    }

    return NextResponse.json({
      reply: replyText,
      mascotSvg: mascotSvg,
      usage: data.usage
    });
  } catch (error: any) {
    console.error('Mascot API error:', error);
    return NextResponse.json({
      reply: "Pip here! I'm right by your side. Let's focus on today's single action.",
      mascotSvg: '/mascot_idle.svg'
    });
  }
}
