import { NextRequest, NextResponse } from 'next/server';

interface QuestionnairePayload {
  step: number; // 2 (hobby), 3 (age), 4 (profession), 5 (skills)
  answers: {
    subjects?: string[];
    subjectsOther?: string;
    hobbies?: string[];
    hobbiesOther?: string;
    age?: string;
    ageOther?: string;
    profession?: string;
    professionOther?: string;
    skills?: string[];
    skillsOther?: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const payload: QuestionnairePayload = await req.json();
    const { step, answers } = payload;

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || 'minimax/minimax-m3:free';

    // Format collected answers for context
    const selectedSubjects = [
      ...(answers.subjects || []),
      ...(answers.subjectsOther ? [`Other: ${answers.subjectsOther}`] : [])
    ].join(', ') || 'Not specified';

    const selectedHobbies = [
      ...(answers.hobbies || []),
      ...(answers.hobbiesOther ? [`Other: ${answers.hobbiesOther}`] : [])
    ].join(', ') || 'Not specified';

    const selectedAge = answers.ageOther ? `Other: ${answers.ageOther}` : (answers.age || 'Not specified');

    const selectedProfession = answers.professionOther 
      ? `Other: ${answers.professionOther}` 
      : (answers.profession || 'Not specified');

    let prompt = '';

    if (step === 2) {
      // Question 2: Hobbies (adapted based on subjects)
      prompt = `The user selected favourite subject(s): "${selectedSubjects}".
Generate Question 2 asking about their hobbies.
Provide 5-6 relevant hobby options with short descriptions that connect with their subjects.
Include popular hobbies like Gaming, Listening to/Making Music, Sports & Physical Activities, Reading, Art & Creative Activities, or related fields.
Tone: Friendly, encouraging Pip mascot.
Return strictly valid JSON with this schema:
{
  "question": "What is your hobby?",
  "subtitle": "Short subtitle mentioning their interest in ${selectedSubjects}",
  "mascotEmotion": "encouragement",
  "mascotNote": "Encouraging 1-sentence thought from Pip the mascot connecting their subjects and hobbies",
  "isMultiple": true,
  "options": [
    { "id": "string", "title": "string", "desc": "string", "badge": "string" }
  ]
}`;
    } else if (step === 3) {
      // Question 3: Age & Stage
      prompt = `The user selected subjects: "${selectedSubjects}", hobbies: "${selectedHobbies}".
Generate Question 3:
Question title: "How would you describe your current learning stage?"
Subtitle: "Pip tunes your sprint intensity, schedule rhythms, and daily depth to match where you are right now."
Provide 4 learning stage options corresponding to their age/stage (e.g., Student / Early Explorer, University / Early Career, Mid-Level / Skill Upskilling, Senior / Leadership & Staff Track).
Tone: Warm, welcoming Pip mascot.
Return strictly valid JSON with this schema:
{
  "question": "How would you describe your current learning stage?",
  "subtitle": "Pip tunes your sprint intensity, schedule rhythms, and daily depth to match where you are right now.",
  "mascotEmotion": "thinking",
  "mascotNote": "Enter your age or birth year below! Pip will calibrate your daily workload to your current career rhythm.",
  "isMultiple": false,
  "options": [
    { "id": "string", "title": "string", "desc": "string", "badge": "string" }
  ]
}`;
    } else if (step === 4) {
      // Question 4: Profession / Dream Role (DYNAMIC based on subjects, hobbies, age)
      prompt = `The user has:
- Favourite Subject(s): "${selectedSubjects}"
- Hobbies: "${selectedHobbies}"
- Age: "${selectedAge}"

Generate Question 4 asking what profession or dream career role they want to pursue.
Generate 5-6 highly tailored, inspiring career options that directly merge their subjects and hobbies.
For example:
- If CS/Math + Gaming: Game Engine Developer, Graphics Engineer, Systems Architect.
- If Science/Math + Reading: Quantitative Researcher, Data Systems Scientist, Bio-Informatics Engineer.
- If Art/Humanities + CS: Creative Technologist, Product UX Architect, Design Engineer.
- If Business + CS: Technical Product Manager, Startup Founder, Solutions Architect.
Return strictly valid JSON with this schema:
{
  "question": "What do you want to be (profession)?",
  "subtitle": "Pip curated these high-leverage roles matching your background and passions.",
  "mascotEmotion": "planning",
  "mascotNote": "Pip's 1-2 sentence reflection connecting their unique background to these career paths",
  "isMultiple": false,
  "options": [
    { "id": "string", "title": "string", "desc": "string", "badge": "string" }
  ]
}`;
    } else if (step === 5) {
      // Question 5: Skills to start with (DYNAMIC based on profession, subjects, hobbies)
      prompt = `The user has:
- Favourite Subject(s): "${selectedSubjects}"
- Hobbies: "${selectedHobbies}"
- Age: "${selectedAge}"
- Target Profession: "${selectedProfession}"

Generate Question 5 asking which skill(s) they want to start with for their first 4-day deliberate sprint.
Provide 5-6 concrete, actionable engineering/technical skills tailored to help them achieve "${selectedProfession}".
Multiple selections should be enabled.
Return strictly valid JSON with this schema:
{
  "question": "Which skill do you want to start with?",
  "subtitle": "Select 1 or more focus areas. Pip will construct your daily 15-20 min practice sprint.",
  "mascotEmotion": "success",
  "mascotNote": "Pip's supportive guidance on taking small daily steps to build verified proof",
  "isMultiple": true,
  "options": [
    { "id": "string", "title": "string", "desc": "string", "badge": "string" }
  ]
}`;
    }

    if (apiKey && prompt) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://huddle.dev',
            'X-Title': 'Huddle Dynamic Questionnaire',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'system',
                content: 'You are Pip, the AI companion for Huddle. You output ONLY valid JSON without markdown formatting or commentary.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.6,
            max_tokens: 650
          })
        });

        if (response.ok) {
          const data = await response.json();
          let rawContent = data.choices?.[0]?.message?.content || '';

          // Strip markdown code block if wrapped
          rawContent = rawContent.replace(/```json/gi, '').replace(/```/g, '').trim();

          const parsed = JSON.parse(rawContent);
          if (parsed && parsed.question && Array.isArray(parsed.options)) {
            return NextResponse.json({
              success: true,
              dynamic: true,
              data: parsed
            });
          }
        }
      } catch (aiErr) {
        console.warn('OpenRouter dynamic questionnaire error, falling back to smart rules:', aiErr);
      }
    }

    // Fallback dynamic generator based on inputs
    const fallbackData = generateSmartFallback(step, answers);
    return NextResponse.json({
      success: true,
      dynamic: false,
      data: fallbackData
    });

  } catch (err: any) {
    console.error('Questionnaire API error:', err);
    return NextResponse.json({
      success: false,
      error: err.message
    }, { status: 500 });
  }
}

// Deterministic intelligent fallback when OpenRouter is unreachable or rate-limited
function generateSmartFallback(step: number, answers: QuestionnairePayload['answers']) {
  const subjects = [
    ...(answers.subjects || []),
    ...(answers.subjectsOther ? [answers.subjectsOther] : [])
  ];
  const isCS = subjects.some(s => s.toLowerCase().includes('computer') || s.toLowerCase().includes('ict'));
  const isMath = subjects.some(s => s.toLowerCase().includes('math'));
  const isBusiness = subjects.some(s => s.toLowerCase().includes('business'));
  const isArt = subjects.some(s => s.toLowerCase().includes('art') || s.toLowerCase().includes('humanities'));

  const hobbies = [
    ...(answers.hobbies || []),
    ...(answers.hobbiesOther ? [answers.hobbiesOther] : [])
  ];
  const isGaming = hobbies.some(h => h.toLowerCase().includes('game') || h.toLowerCase().includes('gaming'));
  const isMusic = hobbies.some(h => h.toLowerCase().includes('music'));
  const isCreative = hobbies.some(h => h.toLowerCase().includes('art') || h.toLowerCase().includes('creative'));

  if (step === 2) {
    return {
      question: "What is your hobby?",
      subtitle: isCS 
        ? "Many developers draw creative inspiration from their hobbies outside coding!"
        : "Hobbies reveal how you naturally learn, explore, and stay in flow.",
      mascotEmotion: "encouragement",
      mascotNote: "Pip loves combining analytical subjects with playful hobbies. Tell me what energizes you!",
      isMultiple: true,
      options: [
        { id: "gaming", title: "Gaming", desc: "Interactive worlds, mechanics & strategy", badge: "Flow" },
        { id: "music", title: "Listening to/Making Music", desc: "Audio composition, rhythms & production", badge: "Creative" },
        { id: "sports", title: "Sports & Physical Activities", desc: "Endurance, teamwork & motor skills", badge: "Active" },
        { id: "reading", title: "Reading", desc: "Books, technical papers & speculative fiction", badge: "Focus" },
        { id: "art", title: "Art & Creative Activities", desc: "Digital sketching, 3D modeling & crafts", badge: "Visual" }
      ]
    };
  }

  if (step === 3) {
    return {
      question: "How would you describe your current learning stage?",
      subtitle: "Pip tunes your sprint intensity, schedule rhythms, and daily depth to match where you are right now.",
      mascotEmotion: "thinking",
      mascotNote: "Enter your age or birth year below! Pip will calibrate your daily workload to your current career rhythm.",
      isMultiple: false,
      options: [
        { id: "student", title: "Student / Early Explorer", desc: "Foundational practice, building mental models & curiosity (Age <18)", badge: "Explorer" },
        { id: "rising", title: "Early Career / Rising Engineer", desc: "University student or early-career builder (Age 18–24)", badge: "Rising" },
        { id: "midlevel", title: "Mid-Level / Skill Upskilling", desc: "Working engineer deepening architecture & systems (Age 25–34)", badge: "Core" },
        { id: "leadership", title: "Senior / Leadership & Staff Track", desc: "Experienced practitioner & technical leader (Age 35+)", badge: "Staff" }
      ]
    };
  }

  if (step === 4) {
    // Tailored professions based on subject + hobby
    if (isGaming && (isCS || isMath)) {
      return {
        question: "What do you want to be (profession)?",
        subtitle: `Pip tailored these roles for your passion in ${subjects.join(' & ')} and Gaming.`,
        mascotEmotion: "planning",
        mascotNote: "Gaming paired with computing is one of the highest-demand engineering intersections!",
        isMultiple: false,
        options: [
          { id: "game-engine-dev", title: "Game Engine & Graphics Engineer", desc: "Low-level C++, shader pipelines, real-time physics & Vulkan", badge: "High Demand" },
          { id: "distributed-backend", title: "Multiplayer Systems & Backend Architect", desc: "High-concurrency servers, WebSocket pipelines & distributed state", badge: "Popular" },
          { id: "ai-engineer", title: "AI Game Systems & Agentic Developer", desc: "Autonomous NPC behavior trees, LLM agents & procedural logic", badge: "Emerging" },
          { id: "fullstack-product", title: "Interactive Web & Game Platform Engineer", desc: "Next.js, Canvas/WebGL, real-time apps & community platforms", badge: "Versatile" },
          { id: "solutions-arch", title: "Cloud Infrastructure & SRE Architect", desc: "Zero-downtime clusters, Kubernetes & global CDN delivery", badge: "Resilient" }
        ]
      };
    }

    if (isArt || isCreative) {
      return {
        question: "What do you want to be (profession)?",
        subtitle: "Pip tailored these roles combining design, aesthetics, and technical execution.",
        mascotEmotion: "planning",
        mascotNote: "Design engineers who code have an extraordinary unfair advantage in modern software.",
        isMultiple: false,
        options: [
          { id: "design-engineer", title: "Product Design Engineer (Frontend)", desc: "Tailwind, Framer Motion, accessible micro-interactions & polished UX", badge: "Unfair Advantage" },
          { id: "creative-technologist", title: "Creative Technologist / 3D Web Dev", desc: "Three.js, WebGL shaders, generative art & interactive installations", badge: "Art & Code" },
          { id: "fullstack-eng", title: "Full-Stack Software Engineer", desc: "End-to-end user experience, robust API design & clean interfaces", badge: "Comprehensive" },
          { id: "technical-pm", title: "Design-Savvy Technical Product Lead", desc: "Bridging product vision, engineering constraints & UX excellence", badge: "Leadership" }
        ]
      };
    }

    if (isBusiness) {
      return {
        question: "What do you want to be (profession)?",
        subtitle: "Pip tailored these high-impact commercial & technical leadership tracks.",
        mascotEmotion: "planning",
        mascotNote: "Software literacy combined with business strategy creates impactful tech founders and CTOs.",
        isMultiple: false,
        options: [
          { id: "tech-founder", title: "Technical Founder & Solopreneur", desc: "Rapid prototype builds, SaaS architecture & product distribution", badge: "Impact" },
          { id: "solutions-architect", title: "Enterprise Solutions Architect", desc: "Cloud economics, distributed system tradeoffs & client integrations", badge: "Enterprise" },
          { id: "fintech-eng", title: "Fintech Systems & Payments Engineer", desc: "Idempotent transactions, event-sourcing & secure ledger infrastructure", badge: "Fintech" },
          { id: "tech-lead", title: "Engineering Manager / Tech Lead", desc: "Team leverage, architecture roadmaps & engineering excellence", badge: "Leadership" }
        ]
      };
    }

    // Default general tech professions
    return {
      question: "What do you want to be (profession)?",
      subtitle: `Pip curated these career pathways based on your ${subjects.join(', ')} interests.`,
      mascotEmotion: "planning",
      mascotNote: "Choose your horizon! Pip will build a daily deliberate roadmap toward this craft.",
      isMultiple: false,
      options: [
        { id: "staff-architect", title: "Staff Distributed Systems Architect", desc: "High-scale backend, asynchronous event buses & resilient cloud infrastructure", badge: "Staff Track" },
        { id: "ai-engineer", title: "AI Application & Agentic Systems Engineer", desc: "LLM tool calling, deterministic evals, RAG pipelines & prompt engines", badge: "Cutting Edge" },
        { id: "fullstack-product", title: "Full-Stack Product Engineer", desc: "Next.js App Router, React Server Components & transactional databases", badge: "Popular" },
        { id: "quant-dev", title: "High-Performance / Quantitative Systems Engineer", desc: "Algorithmic optimization, low-latency data structures & math modeling", badge: "Math & Logic" }
      ]
    };
  }

  // Step 5: Skills tailored to chosen profession
  const professionTitle = answers.professionOther || answers.profession || 'Software Engineering';
  return {
    question: "Which skill do you want to start with?",
    subtitle: `Select 1 or more core capabilities to kickstart your journey toward ${professionTitle}.`,
    mascotEmotion: "success",
    mascotNote: "Consistency beats intensity! We will break your chosen skills into 1 daily 15-minute action.",
    isMultiple: true,
    options: [
      { id: "sys-arch", title: "System Architecture & Scalability", desc: "Distributed caching with Redis, asynchronous queues & database sharding", badge: "Foundation" },
      { id: "next-rsc", title: "Next.js App Router & Server Components", desc: "Stream rendering, server actions & modern production web architecture", badge: "Frontend" },
      { id: "ai-agents", title: "AI Engineering & Agentic Workflows", desc: "Multi-step tool calling, structured JSON output & deterministic testing", badge: "AI Era" },
      { id: "ts-mechanics", title: "TypeScript Type Mechanics & Design", desc: "Generics, mapped types, conditional inference & self-documenting codebases", badge: "Robustness" },
      { id: "ui-craft", title: "Product UI & Micro-interactions", desc: "Accessible component libraries, subtle motion curves & premium aesthetics", badge: "UX Polish" }
    ]
  };
}
