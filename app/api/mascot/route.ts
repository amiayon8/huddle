import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages, userProfile, sprintContext, actionType, surveyData } = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || 'minimax/minimax-m3:free';

    const effectiveSurvey = surveyData || userProfile?.surveyData;

    const surveyPersonalization = effectiveSurvey ? `
=== STRUCTURED USER INTAKE SURVEY & PERSONALIZATION CONTEXT ===
- Favourite Subjects: ${effectiveSurvey.subjects?.join(', ') || 'Computer Science/ICT'}${effectiveSurvey.subjectsOther ? ` (Other: ${effectiveSurvey.subjectsOther})` : ''}
- Flow Hobbies & Passions: ${effectiveSurvey.hobbies?.join(', ') || 'Gaming'}${effectiveSurvey.hobbiesOther ? ` (Other: ${effectiveSurvey.hobbiesOther})` : ''}
- Age & Learning Stage: ${effectiveSurvey.age || '22'} years old (${effectiveSurvey.learningStage || 'Early Career / Rising Engineer'})
- Target Dream Profession: ${effectiveSurvey.targetProfession || userProfile?.careerMilestone || 'Staff Systems Architect'}${effectiveSurvey.professionOther ? ` (Other: ${effectiveSurvey.professionOther})` : ''}
- Selected Initial Skills: ${effectiveSurvey.startingSkills?.join(', ') || sprintContext?.skillTitle || 'System Architecture'}${effectiveSurvey.skillsOther ? ` (Other: ${effectiveSurvey.skillsOther})` : ''}

CRITICAL PERSONALIZATION DIRECTIVES FOR PIP:
1. Analogy & Mental Models: Actively draw metaphors from the user's hobbies (${effectiveSurvey.hobbies?.join(', ') || 'Gaming'}) and favorite subjects (${effectiveSurvey.subjects?.join(', ') || 'Science'}) when explaining complex technical concepts, distributed patterns, or sprint steps.
2. Direct Career Milestone Connection: Continually bridge today's 15-20 min deliberate practice step to their dream profession: "${effectiveSurvey.targetProfession || userProfile?.careerMilestone}". Remind them how this specific task builds undeniable proof for that exact role.
3. Rhythm & Stage Pacing: The user is at the "${effectiveSurvey.learningStage || 'Early Career / Rising Engineer'}" stage. Tailor the tone, depth, and pacing to match their reality. Keep tasks bite-sized (15-25 mins) and free from overwhelm.` : `
=== USER CONTEXT ===
- Milestone Goal: ${userProfile?.careerMilestone || 'Staff Systems Architect'}
- Current Focus: ${sprintContext?.skillTitle || 'System Architecture'}`;

    const systemPrompt = `You are Pip, the calm, friendly, and supportive AI mascot and deliberate practice tutor for "Huddle".
User Name: ${userProfile?.name || 'Alex'}
Current Skill Focus: ${sprintContext?.skillTitle || 'System Architecture'}
Career Milestone Target: ${userProfile?.careerMilestone || 'Staff Systems Architect'}
Current Sprint: ${sprintContext?.durationDays || 4}-Day Sprint (Day ${sprintContext?.currentDay || 2})

${surveyPersonalization}

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
