/* ================================================
   PSYCHE — Personality Test App
   Full logic: Quiz, Scoring, Radar, History, Share
================================================ */

'use strict';

// ================================================
// DATA — QUESTIONS PER MODE
// ================================================
const ALL_QUESTIONS = {
  career: [
    {
      id: 'c1',
      text: 'Your team is stuck on a problem. What's your instinctive first move?',
      options: [
        { text: 'Call a quick brainstorm — more heads, better ideas', scores: { extro: 2, comm: 2 } },
        { text: 'Step back and map the whole problem solo first', scores: { intro: 2, anal: 2 } },
        { text: 'Assign subtasks and co-ordinate everyone's strengths', scores: { lead: 2, disc: 1 } },
        { text: 'Sketch out a creative solution nobody has tried yet', scores: { crea: 2, adapt: 1 } },
        { text: 'Research what similar teams have done before', scores: { anal: 2, disc: 1 } }
      ]
    },
    {
      id: 'c2',
      text: 'Which environment helps you do your best work?',
      options: [
        { text: 'A buzzing open office — energy is contagious', scores: { extro: 2, comm: 1 } },
        { text: 'Quiet, solo focus time with headphones on', scores: { intro: 2, anal: 1 } },
        { text: 'A structured routine with clear milestones', scores: { disc: 2, lead: 1 } },
        { text: 'Somewhere new every week — variety sparks ideas', scores: { crea: 2, adapt: 2 } }
      ]
    },
    {
      id: 'c3',
      text: 'A major project deadline is in 3 days and the scope just doubled. You…',
      options: [
        { text: 'Immediately rally the team and redistribute work', scores: { lead: 2, comm: 2 } },
        { text: 'Stay calm, cut scope ruthlessly, focus on core deliverables', scores: { disc: 2, anal: 1 } },
        { text: 'Innovate — use the chaos to build something better, faster', scores: { crea: 2, adapt: 2 } },
        { text: 'Communicate clearly with stakeholders to reset expectations', scores: { comm: 2, lead: 1 } }
      ]
    },
    {
      id: 'c4',
      text: 'A colleague takes credit for your idea in a meeting. You…',
      options: [
        { text: 'Address it then and there, calmly and directly', scores: { lead: 2, extro: 1 } },
        { text: 'Bring it up privately with them after', scores: { intro: 1, comm: 1 } },
        { text: 'Let it go — ideas matter more than credit', scores: { adapt: 2, crea: 1 } },
        { text: 'Document ideas more carefully going forward', scores: { disc: 2, anal: 1 } }
      ]
    },
    {
      id: 'c5',
      text: 'Which of these sounds most like your career dream?',
      options: [
        { text: 'Leading a team that changes how people live', scores: { lead: 3 } },
        { text: 'Creating something — art, product, or writing — that lasts', scores: { crea: 3 } },
        { text: 'Building systems that run flawlessly at scale', scores: { disc: 2, anal: 2 } },
        { text: 'Connecting people and ideas across the world', scores: { comm: 3, extro: 1 } },
        { text: 'Solving deep problems through research and analysis', scores: { anal: 3, intro: 1 } }
      ]
    },
    {
      id: 'c6',
      text: 'After a long week, your ideal Friday evening is…',
      options: [
        { text: 'A rooftop party — you thrive refuelling around people', scores: { extro: 2, comm: 1 } },
        { text: 'A book, a quiet room, and no notifications', scores: { intro: 2, anal: 1 } },
        { text: 'Working on a personal project late into the night', scores: { crea: 2, disc: 1 } },
        { text: 'A dinner with close friends — quality > quantity', scores: { intro: 1, comm: 1, adapt: 1 } }
      ]
    },
    {
      id: 'c7',
      text: 'Someone gives you vague feedback: "It needs to feel more... alive." You…',
      options: [
        { text: 'Ask probing questions to nail down exactly what they mean', scores: { anal: 2, comm: 1 } },
        { text: 'Trust your gut and iterate creatively until it clicks', scores: { crea: 2, adapt: 1 } },
        { text: 'Get frustrated — specific criteria make better results', scores: { disc: 2 } },
        { text: 'Love the ambiguity — it's creative freedom', scores: { crea: 2, extro: 1 } }
      ],
      // Adaptive: if prior intro score is high, show deeper question
      adaptive: { traitCheck: 'crea', threshold: 3, nextId: 'c7a' }
    },
    {
      id: 'c7a',
      text: '(Deep dive) When you create something, what matters most to you?',
      isAdaptive: true,
      options: [
        { text: 'That it\'s genuinely original — nothing like it exists', scores: { crea: 3 } },
        { text: 'That it\'s useful and solves a real problem beautifully', scores: { crea: 1, disc: 2 } },
        { text: 'That it moves people emotionally', scores: { crea: 2, comm: 1 } },
        { text: 'That the process was rigorous and considered', scores: { anal: 2, disc: 1 } }
      ]
    },
    {
      id: 'c8',
      text: 'You're handed a team of 10 with complete autonomy. First instinct?',
      options: [
        { text: 'Set a clear vision and let people self-organize toward it', scores: { lead: 3, adapt: 1 } },
        { text: 'Map everyone\'s strengths and assign optimal roles', scores: { lead: 2, anal: 2 } },
        { text: 'Ask the team what they most want to build together', scores: { comm: 2, adapt: 2 } },
        { text: 'Establish a solid process and OKRs from day one', scores: { disc: 3 } }
      ]
    },
    {
      id: 'c9',
      text: 'Which describes how you make important decisions?',
      options: [
        { text: 'Exhaustive research → weigh pros and cons → decide', scores: { anal: 3, disc: 1 } },
        { text: 'Strong gut feeling, then I look for evidence to stress-test it', scores: { lead: 1, crea: 2 } },
        { text: 'I consult everyone involved before forming a view', scores: { comm: 2, adapt: 1 } },
        { text: 'I create a structured framework and run the decision through it', scores: { disc: 2, anal: 2 } }
      ]
    },
    {
      id: 'c10',
      text: 'Your superpower at work is…',
      options: [
        { text: 'Getting people energised and aligned behind a goal', scores: { lead: 2, comm: 2, extro: 1 } },
        { text: 'Spotting patterns and seeing what others miss', scores: { anal: 3, intro: 1 } },
        { text: 'Making something from nothing with limited resources', scores: { crea: 3 } },
        { text: 'Keeping everything on track when chaos hits', scores: { disc: 3 } },
        { text: 'Adapting instantly when the situation changes', scores: { adapt: 3 } }
      ]
    },
    {
      id: 'c11',
      text: 'A brilliant idea arrives at 2am. You…',
      options: [
        { text: 'Sit up and develop it until it\'s fully formed', scores: { crea: 2, intro: 1 } },
        { text: 'Voice-note it and fall back asleep — brain works better rested', scores: { disc: 2, anal: 1 } },
        { text: 'Text a friend to pressure-test it immediately', scores: { extro: 2, comm: 1 } },
        { text: 'Open a doc and map out the execution plan', scores: { lead: 2, disc: 1 } }
      ]
    },
    {
      id: 'c12',
      text: 'Your most feared outcome in any project is…',
      options: [
        { text: 'Shipping something mediocre because of rushed decisions', scores: { disc: 2, anal: 1 } },
        { text: 'A great idea dying because nobody rallied behind it', scores: { lead: 2, comm: 1 } },
        { text: 'Losing the creative spark under too much process', scores: { crea: 2, adapt: 1 } },
        { text: 'Poor communication breaking trust within the team', scores: { comm: 2, extro: 1 } }
      ]
    }
  ],

  character: [
    {
      id: 'ch1',
      text: 'You find an ancient map leading to a hidden city. What do you do first?',
      options: [
        { text: 'Study it obsessively — decode every symbol before moving', scores: { anal: 2, intro: 1 } },
        { text: 'Recruit a team of specialists and plan the expedition', scores: { lead: 2, comm: 1 } },
        { text: 'Grab your gear and head out — the adventure calls now', scores: { adapt: 2, extro: 1 } },
        { text: 'Document it carefully, then consult every expert you can find', scores: { disc: 2, anal: 1 } },
        { text: 'Use it to build a better world — share the discovery', scores: { crea: 2, comm: 2 } }
      ]
    },
    {
      id: 'ch2',
      text: 'In the story of your life, you are most naturally the…',
      options: [
        { text: 'Hero — striding toward the challenge', scores: { lead: 3, extro: 1 } },
        { text: 'Sage — the wise one others turn to', scores: { anal: 3, intro: 1 } },
        { text: 'Trickster — cunning, unpredictable, always three moves ahead', scores: { adapt: 2, crea: 2 } },
        { text: 'Creator — building worlds, objects, and ideas', scores: { crea: 3 } },
        { text: 'Caretaker — ensuring everyone around you flourishes', scores: { comm: 3, disc: 1 } }
      ]
    },
    {
      id: 'ch3',
      text: 'Your party is trapped. The exit requires solving a riddle. You…',
      options: [
        { text: 'Immediately start working through it logically and methodically', scores: { anal: 2, disc: 1 } },
        { text: 'Think laterally — the answer is probably unexpected', scores: { crea: 2, adapt: 1 } },
        { text: 'Rally the group — someone will spot what you can\'t', scores: { comm: 2, lead: 1 } },
        { text: 'Stay calm and focus — panic is the real enemy', scores: { disc: 2, intro: 1 } }
      ]
    },
    {
      id: 'ch4',
      text: 'When you imagine your greatest legacy, it looks like…',
      options: [
        { text: 'A movement — millions of lives changed by your leadership', scores: { lead: 3, extro: 1 } },
        { text: 'A masterwork — a book, building, or artwork that outlasts you', scores: { crea: 3 } },
        { text: 'A system — something that runs perfectly long after you\'re gone', scores: { disc: 3, anal: 1 } },
        { text: 'The people you mentored who went on to change the world', scores: { comm: 3 } }
      ]
    },
    {
      id: 'ch5',
      text: 'Your nemesis shows up. What\'s your approach?',
      options: [
        { text: 'Face them directly — strength and principle win', scores: { lead: 2, disc: 1 } },
        { text: 'Outmanoeuvre them using intellect and patience', scores: { anal: 2, intro: 1 } },
        { text: 'Find common ground — every adversary has a story', scores: { comm: 2, adapt: 1 } },
        { text: 'Use unexpected creativity to neutralise the conflict', scores: { crea: 2, adapt: 2 } }
      ]
    },
    {
      id: 'ch6',
      text: 'Which magical ability would you choose?',
      options: [
        { text: 'Mind-reading — understand everyone deeply', scores: { anal: 2, intro: 1, comm: 1 } },
        { text: 'Telekinesis — bend the physical world to your will', scores: { lead: 2, disc: 1 } },
        { text: 'Time manipulation — revisit, refine, perfect', scores: { disc: 2, anal: 1 } },
        { text: 'Shapeshifting — become whatever the moment requires', scores: { adapt: 3, crea: 1 } },
        { text: 'Conjuring — create anything from thin air', scores: { crea: 3 } }
      ]
    },
    {
      id: 'ch7',
      text: 'In a fantasy realm you are most likely to be the…',
      options: [
        { text: 'Warrior — fearless, first into battle', scores: { lead: 2, extro: 2 } },
        { text: 'Wizard — channelling ancient knowledge for powerful solutions', scores: { anal: 2, crea: 1 } },
        { text: 'Bard — inspiring others through story, song, and wit', scores: { comm: 3, crea: 1 } },
        { text: 'Strategist — moving pieces on the board from the shadows', scores: { anal: 2, disc: 2 } },
        { text: 'Rogue — improvising brilliantly in every situation', scores: { adapt: 3 } }
      ]
    },
    {
      id: 'ch8',
      text: 'The kingdom faces disaster. You step up because…',
      options: [
        { text: 'You have a plan and the skills to execute it', scores: { lead: 2, disc: 2 } },
        { text: 'Someone has to, and waiting for others is painful', scores: { lead: 3, extro: 1 } },
        { text: 'You see a creative solution nobody else has considered', scores: { crea: 3 } },
        { text: 'People trust you to hold the group together', scores: { comm: 2, adapt: 1 } }
      ]
    },
    {
      id: 'ch9',
      text: 'How do you approach learning something brand new?',
      options: [
        { text: 'Dive into the theory — understand the foundations first', scores: { anal: 2, disc: 1 } },
        { text: 'Find a teacher or mentor and absorb their experience', scores: { comm: 2, intro: 1 } },
        { text: 'Experiment relentlessly until it clicks through doing', scores: { adapt: 2, crea: 2 } },
        { text: 'Build a structured curriculum and follow it exactly', scores: { disc: 3 } }
      ]
    },
    {
      id: 'ch10',
      text: 'Others would describe you in a tough moment as…',
      options: [
        { text: 'Unshakeable — calm and decisive under pressure', scores: { lead: 2, disc: 2 } },
        { text: 'Quietly brilliant — you get to the solution without fuss', scores: { anal: 2, intro: 2 } },
        { text: 'Creatively surprising — you pivot in ways no one expected', scores: { crea: 2, adapt: 2 } },
        { text: 'The glue — keeping morale up and communication clear', scores: { comm: 3 } }
      ]
    },
    {
      id: 'ch11',
      text: 'Your deepest personal value is…',
      options: [
        { text: 'Truth — you cannot abide deception', scores: { anal: 2, disc: 1 } },
        { text: 'Freedom — structure stifles your best self', scores: { adapt: 2, crea: 1 } },
        { text: 'Loyalty — you\'d do anything for those in your circle', scores: { comm: 2, intro: 1 } },
        { text: 'Excellence — good enough never satisfies you', scores: { disc: 2, lead: 1 } },
        { text: 'Curiosity — the world is endlessly fascinating', scores: { anal: 2, crea: 1 } }
      ]
    },
    {
      id: 'ch12',
      text: 'At the end of the great quest, you want to have been…',
      options: [
        { text: 'The one who made the hardest decisions', scores: { lead: 3 } },
        { text: 'The one who solved what no one else could', scores: { anal: 2, crea: 2 } },
        { text: 'The one who held the team together when it mattered most', scores: { comm: 3 } },
        { text: 'The wildcard who changed the plan — and saved everything', scores: { adapt: 3, crea: 1 } }
      ]
    }
  ],

  relationship: [
    {
      id: 'r1',
      text: 'In a close relationship, you most need your partner to…',
      options: [
        { text: 'Give you space to think and be alone without concern', scores: { intro: 2, anal: 1 } },
        { text: 'Be adventurous — try new things and keep life exciting', scores: { adapt: 2, extro: 1 } },
        { text: 'Communicate openly and check in often', scores: { comm: 2, extro: 1 } },
        { text: 'Be reliable and consistent — your anchor', scores: { disc: 2, lead: 1 } },
        { text: 'Inspire your creativity and encourage your wild ideas', scores: { crea: 2, adapt: 1 } }
      ]
    },
    {
      id: 'r2',
      text: 'How do you typically show someone you care about them?',
      options: [
        { text: 'Quality time — fully present, no distractions', scores: { intro: 1, anal: 1, disc: 1 } },
        { text: 'Acts of service — fixing, building, arranging things for them', scores: { disc: 2, lead: 1 } },
        { text: 'Words — you say what you feel, often and clearly', scores: { comm: 3, extro: 1 } },
        { text: 'Thoughtful gifts or surprises — you notice what they love', scores: { crea: 2, anal: 1 } },
        { text: 'Physical closeness — presence says more than words', scores: { adapt: 1, extro: 1, comm: 1 } }
      ]
    },
    {
      id: 'r3',
      text: 'An argument is brewing. Your first instinct is to…',
      options: [
        { text: 'Address it head-on immediately — tension shouldn\'t linger', scores: { lead: 2, extro: 1 } },
        { text: 'Take time to think before responding — you want clarity', scores: { intro: 2, anal: 2 } },
        { text: 'Find a compromise — both people\'s feelings matter', scores: { comm: 2, adapt: 1 } },
        { text: 'Deflect with humour to reset the mood', scores: { adapt: 2, crea: 1 } }
      ]
    },
    {
      id: 'r4',
      text: 'Your ideal relationship energy is…',
      options: [
        { text: 'Two high-achievers pushing each other to be extraordinary', scores: { lead: 2, disc: 1 } },
        { text: 'Deep intellectual partnership — hours of fascinating conversation', scores: { anal: 2, intro: 2 } },
        { text: 'Playful and spontaneous — every day is an adventure', scores: { adapt: 2, crea: 2 } },
        { text: 'Warmly domestic — building a beautiful life together', scores: { disc: 2, comm: 1 } },
        { text: 'Creatively intertwined — you make art, music, or ideas together', scores: { crea: 3 } }
      ]
    },
    {
      id: 'r5',
      text: 'What do you bring most to a partnership?',
      options: [
        { text: 'Stability and follow-through — you do what you say', scores: { disc: 3 } },
        { text: 'Vision — you inspire them to see bigger possibilities', scores: { lead: 2, crea: 1 } },
        { text: 'Depth — you understand them better than they know themselves', scores: { anal: 2, intro: 2 } },
        { text: 'Joy and spontaneity — life is never boring with you', scores: { extro: 2, adapt: 1 } },
        { text: 'Emotional attunement — you sense what they need before they ask', scores: { comm: 3 } }
      ]
    },
    {
      id: 'r6',
      text: 'When you\'re stressed, you most want your person to…',
      options: [
        { text: 'Leave you alone to process — don\'t take it personally', scores: { intro: 2, anal: 1 } },
        { text: 'Distract you — suggest something fun or silly', scores: { adapt: 2, extro: 1 } },
        { text: 'Just listen without trying to fix anything', scores: { comm: 2 } },
        { text: 'Help you make a plan of action — solutions calm you', scores: { disc: 2, lead: 1 } }
      ]
    },
    {
      id: 'r7',
      text: 'Your biggest relationship fear is…',
      options: [
        { text: 'Being truly known — and then abandoned', scores: { intro: 2, comm: 1 } },
        { text: 'Being controlled or losing your independence', scores: { adapt: 2, crea: 1 } },
        { text: 'Drifting apart into comfortable but disconnected routine', scores: { extro: 1, comm: 2 } },
        { text: 'Wasting time with someone who doesn\'t match your ambitions', scores: { lead: 2, disc: 1 } },
        { text: 'Never finding someone who truly understands how you think', scores: { anal: 2, intro: 1 } }
      ]
    },
    {
      id: 'r8',
      text: 'On your ideal date night…',
      options: [
        { text: 'A gallery opening followed by a long walk and deep conversation', scores: { intro: 1, crea: 1, anal: 1 } },
        { text: 'Spontaneous road trip — destination decided in the car', scores: { adapt: 3 } },
        { text: 'An elaborate dinner you planned weeks in advance', scores: { disc: 2, lead: 1 } },
        { text: 'A party together — you love showing off your best person', scores: { extro: 2, comm: 1 } },
        { text: 'Building something together — cooking, crafts, a new project', scores: { crea: 2, disc: 1 } }
      ]
    },
    {
      id: 'r9',
      text: 'After a huge fight that\'s now resolved, you…',
      options: [
        { text: 'Debrief the whole thing — what caused it, how to prevent it', scores: { anal: 2, disc: 1 } },
        { text: 'Let go immediately — dwelling doesn\'t help anyone', scores: { adapt: 2, extro: 1 } },
        { text: 'Do something together to reconnect through action', scores: { comm: 1, crea: 1, adapt: 1 } },
        { text: 'Quietly rebuild trust through consistent small acts', scores: { disc: 2, intro: 1 } }
      ]
    },
    {
      id: 'r10',
      text: 'When it comes to long-term commitment, you believe…',
      options: [
        { text: 'You grow into love — it deepens with time and shared experience', scores: { disc: 2, intro: 1 } },
        { text: 'It should always feel like a choice, not a trap', scores: { adapt: 2, crea: 1 } },
        { text: 'The spark must be maintained deliberately — it won\'t sustain itself', scores: { lead: 1, disc: 1, comm: 1 } },
        { text: 'It\'s built on thousands of tiny moments of choosing each other', scores: { comm: 2, anal: 1 } }
      ]
    },
    {
      id: 'r11',
      text: 'Your love language hierarchy is closest to…',
      options: [
        { text: 'Words → Time → Acts (you thrive on verbal connection)', scores: { comm: 2, extro: 1 } },
        { text: 'Acts → Time → Touch (you show love, you don\'t always say it)', scores: { disc: 2, intro: 1 } },
        { text: 'Quality Time above all — presence is everything', scores: { intro: 1, anal: 1, disc: 1 } },
        { text: 'Surprises and spontaneous gestures — keep it fresh', scores: { crea: 2, adapt: 2 } }
      ]
    },
    {
      id: 'r12',
      text: 'In 20 years, you picture your relationship as…',
      options: [
        { text: 'A partnership of equals who\'ve achieved incredible things together', scores: { lead: 2, disc: 1 } },
        { text: 'Still surprising each other — still discovering new things together', scores: { adapt: 2, crea: 2 } },
        { text: 'A profound friendship deepened by decades of history', scores: { comm: 2, anal: 1 } },
        { text: 'A peaceful, beautiful life built exactly as you imagined', scores: { disc: 2, intro: 1 } }
      ]
    }
  ]
};

// ================================================
// PERSONALITY TYPES — PER MODE
// ================================================
const PERSONALITY_TYPES = {
  career: {
    Visionary: {
      emoji: '🔭',
      tagline: 'You see futures no one else has imagined yet.',
      description: 'You blend creative thinking with a genuine drive to change how the world works. You\'re not interested in maintaining the status quo — you want to reimagine it entirely. You thrive where complexity meets possibility, and your best work happens when given the freedom to connect unexpected dots.',
      strengths: ['Generating breakthrough ideas', 'Thinking in systems and metaphors', 'Inspiring others with your vision', 'Turning ambiguity into opportunity', 'Pushing boundaries others won\'t cross'],
      weaknesses: ['Can neglect execution for ideation', 'May struggle with routine tasks', 'Sometimes misread as impractical', 'Needs to develop follow-through', 'Can become restless under rigid structure'],
      careers: ['Product Visionary', 'Creative Director', 'Entrepreneur', 'R&D Lead', 'Futurist', 'Film Director'],
      hobbies: ['Speculative fiction writing', 'Concept art', 'Music production', 'World-building games', 'Independent research'],
      character: { name: 'Tony Stark', from: 'Iron Man / Avengers', why: 'Brilliant, boundary-defying, and utterly driven — you build tomorrow today, consequences be damned.' }
    },
    Architect: {
      emoji: '🏛️',
      tagline: 'You build the systems that make the world run.',
      description: 'Analytical, precise, and quietly formidable — you\'re the one who actually understands how everything fits together. You distrust shortcuts and love the rigour of building something properly. Your thinking is layered, thorough, and several moves ahead of everyone else in the room.',
      strengths: ['Deep analytical thinking', 'Spotting structural flaws before they surface', 'Long-range planning', 'Meticulous attention to detail', 'Calm under complexity'],
      weaknesses: ['Can overthink and delay decisions', 'May undervalue intuitive leaps', 'Tends toward perfectionism', 'Can seem detached in emotional situations', 'Struggles to delegate what you can do better yourself'],
      careers: ['Software Architect', 'Systems Engineer', 'Data Scientist', 'Financial Analyst', 'Research Scientist', 'Urban Planner'],
      hobbies: ['Chess & strategy games', 'Programming', 'Philosophy', 'Puzzle design', 'Amateur astronomy'],
      character: { name: 'Hermione Granger', from: 'Harry Potter', why: 'Relentlessly rigorous, deeply prepared — you\'ve read the book, worked the problem, and still double-checked the answer.' }
    },
    Commander: {
      emoji: '⚡',
      tagline: 'You don\'t wait for change — you make it happen.',
      description: 'You lead from the front, and people follow because they trust you. You\'re energised by responsibility, decisive under pressure, and unafraid to make hard calls. You understand that great outcomes require someone to actually step up — and that person is usually you.',
      strengths: ['Decisive action under pressure', 'Inspiring confidence in teams', 'Strategic thinking at speed', 'Holding people accountable', 'Getting results through people'],
      weaknesses: ['Can be impatient with process', 'May steamroll others\' perspectives', 'Tendency to overwork', 'Can underestimate emotional subtleties', 'Needs to listen more, talk less'],
      careers: ['Executive Leader', 'Startup Founder', 'Military Officer', 'Politician', 'Crisis Manager', 'Programme Director'],
      hobbies: ['Martial arts', 'Competitive sports', 'Public speaking', 'Historical biographies', 'Strategy games'],
      character: { name: 'Harvey Specter', from: 'Suits', why: 'Unstoppable in the room, allergic to losing — you play to win and you know exactly what that requires.' }
    },
    Connector: {
      emoji: '🌐',
      tagline: 'Your superpower is making people feel understood.',
      description: 'You are genuinely energised by others. You build rapport effortlessly, communicate with warmth and precision, and are the reason teams don\'t just function — they thrive. You read rooms intuitively and know how to say the thing that moves people forward.',
      strengths: ['Exceptional interpersonal intelligence', 'Facilitating hard conversations', 'Building trust rapidly', 'Cross-functional communication', 'Motivating people through turbulence'],
      weaknesses: ['Can take on others\' stress as your own', 'May avoid necessary conflict', 'Can over-invest in relationships that don\'t reciprocate', 'Sometimes says yes when no is better', 'Needs to protect your own energy'],
      careers: ['People Ops Leader', 'Therapist / Coach', 'Brand Strategist', 'Community Builder', 'Sales Director', 'Diplomat'],
      hobbies: ['Hosting dinners', 'Podcasting', 'Community volunteering', 'Improv theatre', 'Travel journalism'],
      character: { name: 'Leslie Knope', from: 'Parks & Recreation', why: 'Boundlessly warm, relentlessly people-first — you build bridges where others build walls.' }
    },
    Craftsman: {
      emoji: '🔧',
      tagline: 'Excellence isn\'t a standard — it\'s a habit.',
      description: 'You are the person things actually get done through. Where others talk, you execute. Where others estimate, you measure. Disciplined, reliable, and deeply skilled — your work has a quality of care that people notice even when they can\'t name it. Craft is your love language.',
      strengths: ['Exceptional execution and follow-through', 'Deep domain expertise', 'Reliability under pressure', 'Structured, systematic problem-solving', 'Maintaining quality at scale'],
      weaknesses: ['Can resist change to well-established processes', 'May undervalue "good enough, shipped"', 'Can miss strategic opportunities in the details', 'Risk of burnout from high standards', 'Needs to celebrate progress, not just completion'],
      careers: ['Engineering Lead', 'Product Manager', 'UX Designer', 'Operations Director', 'Surgeon', 'Master Chef'],
      hobbies: ['Woodworking', 'Cooking', 'Mechanical restoration', 'Competitive chess', 'Technical illustration'],
      character: { name: 'Walter White (early)', from: 'Breaking Bad', why: 'Precise, expert, and quietly formidable — you do the work with a standard most people never reach.' }
    },
    Explorer: {
      emoji: '🧭',
      tagline: 'You turn uncertainty into opportunity.',
      description: 'You are at your best when nothing is certain. Constraints bore you, routines exhaust you, and the unknown exhilarates you. You are adaptable almost to a fault — you can read a situation and reshape yourself to meet it in ways that leave others blinking. Your value is in the edge cases.',
      strengths: ['Thriving in ambiguity and chaos', 'Rapid learning and adaptation', 'Creative problem-solving on the fly', 'Broad cross-functional skill set', 'Bringing energy to stagnant situations'],
      weaknesses: ['Can lose focus when stability returns', 'May not finish what was started elsewhere', 'Can appear inconsistent to structured colleagues', 'Needs novelty to stay engaged', 'May underinvest in deep expertise'],
      careers: ['Venture Capitalist', 'Growth Lead', 'Journalist', 'Expedition Leader', 'Consultant', 'Innovation Strategist'],
      hobbies: ['Travel to obscure places', 'Improvised cooking', 'Adventure sports', 'Language learning', 'Startup ideation'],
      character: { name: 'Indiana Jones', from: 'Raiders of the Lost Ark', why: 'Resourceful, spontaneous, and impossibly capable — you excel precisely because the rules don\'t apply to you.' }
    }
  },
  character: {
    TheOracle: {
      emoji: '🔮',
      tagline: 'Wisdom is your weapon. Insight is your gift.',
      description: 'You see what others miss. Your mind is a precision instrument that observes, connects, and deduces before others have even framed the question. You prefer the library to the arena, but when you emerge, the room changes. You carry the rare gift of perspective.',
      strengths: ['Pattern recognition', 'Strategic foresight', 'Unshakeable inner composure', 'Depth of knowledge', 'Turning complexity into clarity'],
      weaknesses: ['Can withhold knowledge too long', 'Appears cold or distant', 'May underestimate emotion\'s role in decisions', 'Reluctant to act without sufficient data', 'Sometimes the loneliest person in the room'],
      careers: ['Philosopher', 'AI Researcher', 'Cryptographer', 'Academic', 'Intelligence Analyst', 'Strategic Advisor'],
      hobbies: ['Go / Chess', 'Deep reading', 'Cryptic crosswords', 'Mathematics', 'Solo hiking'],
      character: { name: 'Sherlock Holmes', from: 'BBC Sherlock', why: 'Two moves ahead of everyone else, including themselves. Brilliance that burns cold.' }
    },
    TheCatalyst: {
      emoji: '⚗️',
      tagline: 'You make the impossible look inevitable.',
      description: 'You are the spark that changes a room\'s chemistry. Charismatic, driven, and unapologetically bold — you have a gift for making people believe and for making things actually happen. The future excites you; the present is just a staging area.',
      strengths: ['Infectious energy and conviction', 'Turning resistance into momentum', 'Fast decisive action', 'Bold storytelling and persuasion', 'Making others feel capable of the impossible'],
      weaknesses: ['Impatience with process', 'Can leave trails of unfinished projects', 'Burns bridges when frustrated', 'Overconfidence in your own instincts', 'May not listen when listening matters most'],
      careers: ['Founder / CEO', 'Activist Leader', 'Film Director', 'Political Leader', 'Brand Builder'],
      hobbies: ['Public speaking', 'Documentary filmmaking', 'Adventure travel', 'Competitive debate', 'Stand-up comedy'],
      character: { name: 'Steve Jobs', from: 'History', why: 'Ruthlessly convinced you\'re right — and often are. Reality distortion field fully engaged.' }
    },
    TheMystic: {
      emoji: '🌙',
      tagline: 'Your inner world is richer than most people\'s outer ones.',
      description: 'You live at the intersection of feeling and meaning. You are drawn to what lies beneath the surface — in art, in people, in ideas. You are profoundly creative, occasionally misunderstood, and always singular. The world tends to catch up to how you see things.',
      strengths: ['Deep empathy and sensitivity', 'Original creative vision', 'Connecting to universal human truths', 'Long-range imaginative thinking', 'Making the ineffable feel tangible'],
      weaknesses: ['Can withdraw when overwhelmed', 'Idealism may clash with reality', 'May struggle with mundane practicalities', 'Prone to melancholy', 'Sometimes difficult to read or reach'],
      careers: ['Author', 'Film-maker', 'Musician', 'Therapist', 'Philosopher', 'Visual Artist'],
      hobbies: ['Writing', 'Music composition', 'Solitary walks', 'Mythology and folklore', 'Collecting strange beautiful things'],
      character: { name: 'Luna Lovegood', from: 'Harry Potter', why: 'Strange, deep, and completely herself — you see truths others dismiss as impossibilities.' }
    },
    TheChampion: {
      emoji: '🛡️',
      tagline: 'You protect. You provide. You prevail.',
      description: 'You are defined by your loyalty and your strength. When things fall apart, you hold. When people need someone to step up, you do. You don\'t seek glory — but you earn it. Your values are not negotiable, and your word is your contract.',
      strengths: ['Unshakeable reliability', 'Moral clarity in complex situations', 'Physical and psychological resilience', 'Deep loyalty to those you love', 'Natural authority without arrogance'],
      weaknesses: ['Carrying too much alone', 'Difficulty accepting help', 'Stubbornness when challenged', 'May suppress your own needs', 'Struggles to rest when others still need you'],
      careers: ['Military Officer', 'Emergency Responder', 'Surgeon', 'Coach', 'Social Worker', 'Physical Trainer'],
      hobbies: ['Martial arts', 'Endurance sports', 'Mentoring', 'Wilderness survival', 'Weightlifting'],
      character: { name: 'Samwise Gamgee', from: 'Lord of the Rings', why: 'The unbreakable heart behind the whole journey. Not the hero — something better.' }
    },
    TheWildcard: {
      emoji: '🃏',
      tagline: 'Unpredictable. Brilliant. Unforgettable.',
      description: 'You cannot be categorised, and that\'s the point. You are many things at once — playful and profound, reckless and precise. You have an extraordinary ability to reframe, surprise, and destabilise comfortable assumptions. People don\'t always know what to make of you — which is exactly how you like it.',
      strengths: ['Radical creative improvisation', 'Reading people with frightening accuracy', 'Thriving in chaotic environments', 'Seeing through pretension instantly', 'Making the unexpected work'],
      weaknesses: ['Difficulty with long-term commitment to one path', 'Can be misread as unreliable', 'May use wit to deflect real vulnerability', 'Gets bored of mastery once achieved', 'Can leave others dizzy trying to follow your pivots'],
      careers: ['Creative Director', 'Comedian', 'Investigative Journalist', 'Trader', 'Improv Performer', 'Entrepreneur'],
      hobbies: ['Stand-up comedy', 'Improv', 'Magic', 'Extreme sport', 'Creative writing with no genre'],
      character: { name: 'The Joker (Nolan)', from: 'The Dark Knight', why: 'Pure, dangerous, misunderstood creativity. An agent of chaos who actually has a philosophy.' }
    },
    TheLegend: {
      emoji: '👑',
      tagline: 'Built for the moments that define histories.',
      description: 'There are people who are present at history, and there are people who make it. You are the latter. You carry the rare combination of vision, will, and magnetism that turns individuals into movements and moments into eras. You feel most alive when the stakes are highest.',
      strengths: ['Moving people through conviction and presence', 'Staying the course when others falter', 'Creating mythic moments and memories', 'Holding a group together through crisis', 'Making the right call when it costs something real'],
      weaknesses: ['Can mistake your version of events for the truth', 'The weight of expectation can be crushing', 'May have sacrificed more than they\'ve admitted for the path', 'Difficulty being ordinary', 'Loneliness at the top is real'],
      careers: ['Head of State', 'Supreme Court Justice', 'World-class Athlete', 'Nobel laureate', 'Global Activist'],
      hobbies: ['Long-form biography reading', 'Oratory / Debate', 'Strategic board games', 'Mentoring extraordinary individuals', 'Sailing / Grand expedition'],
      character: { name: 'Atticus Finch', from: 'To Kill a Mockingbird', why: 'Unyielding in the face of a world that asks you to compromise. The benchmark for what moral courage actually looks like.' }
    }
  },
  relationship: {
    TheDeepDiver: {
      emoji: '🌊',
      tagline: 'You love with your whole, enormous mind.',
      description: 'You don\'t do surface-level. In relationships, you want to understand your partner completely — their history, their thinking, their contradictions. You are deeply loyal and profoundly attentive, but you need a partner who meets your hunger for depth. Smalltalk is not your language.',
      strengths: ['Exceptional emotional and intellectual depth', 'Absolute loyalty once trust is earned', 'Remembering the things that matter', 'Creating space for real vulnerability', 'Long-range commitment'],
      weaknesses: ['Slow to open up initially', 'Can appear emotionally unavailable', 'Over-analyses conflict rather than feeling through it', 'May neglect lighter, playful connection', 'High bar for intimacy can isolate you'],
      careers: ['Psychologist', 'Author', 'Philosopher', 'Researcher', 'Therapist'],
      hobbies: ['Long, wandering conversations', 'Philosophical reading', 'Solo journaling', 'Slow travel', 'Intimate dinner parties'],
      character: { name: 'Mr Darcy', from: 'Pride and Prejudice', why: 'Quietly devoted, profoundly misunderstood — you love completely but you show it on your own terms.' }
    },
    TheFreeSpirit: {
      emoji: '🦋',
      tagline: 'Love should feel like an adventure, every single day.',
      description: 'You bring electricity to relationships. Life with you is interesting, surprising, and alive. You need a partner who gives you freedom without feeling threatened by it — someone who understands that your independence isn\'t distance, it\'s how you stay whole.',
      strengths: ['Keeping the relationship fresh and exciting', 'Non-possessive, trusting love', 'Incredible in the early stages — magnetic', 'Helping partners grow and explore', 'Refusing to let routine kill the spark'],
      weaknesses: ['Commitment can trigger avoidance', 'May not always be emotionally available during hard stretches', 'Can prioritise novelty over depth', 'Conflict resolution requires more patience', 'Sometimes the adventure masks a fear of stillness'],
      careers: ['Travel Writer', 'Photographer', 'Creative Entrepreneur', 'Musician', 'Life Coach'],
      hobbies: ['Spontaneous travel', 'New cuisines and restaurants', 'Music festivals', 'Learning instruments', 'Skydiving / Surfing'],
      character: { name: 'Manic Pixie archetype / Ramona Flowers', from: 'Scott Pilgrim', why: 'Irresistibly interesting, perpetually evolving — you change people for the better just by passing through their life.' }
    },
    TheAnchor: {
      emoji: '⚓',
      tagline: 'You are the person they didn\'t know they needed.',
      description: 'You build safe harbours. Your love is consistent, dependable, and constructed over time through a thousand reliable acts. You don\'t promise what you can\'t deliver — but what you do promise, you keep. Relationships with you feel like coming home.',
      strengths: ['Consistency that builds profound trust', 'Showing up completely in hard times', 'Creating a warm, stable shared life', 'Being the rock others orbit', 'Long-term investment in the relationship'],
      weaknesses: ['Can fall into routine that feels like emotional flatlining', 'May suppress own needs to keep peace', 'Vulnerability doesn\'t come easily', 'Can mistake loyalty for never challenging the relationship', 'Fear of change may prolong what should end'],
      careers: ['Family Doctor', 'Teacher', 'Social Worker', 'Architect', 'Financial Planner'],
      hobbies: ['Cooking together', 'Building or renovating', 'Gardening', 'Family traditions', 'Long-form TV watching'],
      character: { name: 'Jim Halpert', from: 'The Office', why: 'Quietly, completely devoted — you make love look easy because you actually put in the work.' }
    },
    TheFlame: {
      emoji: '🔥',
      tagline: 'Passion is your primary language.',
      description: 'Your relationships are vivid, intense, and transformative. You love passionately and expect the same in return. You bring your full self to partnership — and you need a partner who doesn\'t flinch from that. Lukewarm is your kryptonite.',
      strengths: ['Passionate, full-body investment in the relationship', 'Creating unforgettable shared experiences', 'Absolute honesty — you won\'t pretend', 'Championing your partner\'s ambitions fiercely', 'Making your partner feel fully seen and desired'],
      weaknesses: ['Conflict can escalate faster than you intend', 'High expectations of reciprocal intensity', 'Can exhaust more reserved partners', 'Jealousy or possessiveness can surface', 'Struggles with the quieter phases of love'],
      careers: ['Actor / Performer', 'Politician', 'Activist', 'Sports Coach', 'Executive'],
      hobbies: ['Dancing', 'Intense sport', 'Debate', 'Art-making', 'Cooking elaborate feasts'],
      character: { name: 'Elizabeth Bennet', from: 'Pride and Prejudice', why: 'Sharp, feeling everything, refusing to settle — you love with as much wit as heart.' }
    },
    TheSage: {
      emoji: '🍃',
      tagline: 'Love, to you, is a practice of continuous understanding.',
      description: 'You approach relationships with the same thoughtfulness you bring to everything. You believe love is built in layers, through curiosity and attention. You are the partner who still asks questions after a decade together, because you know there\'s always more to understand.',
      strengths: ['Incredible patience and attentiveness', 'Growing alongside your partner intentionally', 'Resolving conflict through understanding, not winning', 'Appreciating your partner\'s complexity', 'Being genuinely present in conversation'],
      weaknesses: ['Can intellectualise emotions rather than feel them', 'Slow to enter relationships — high bar for entry', 'May seem detached when processing a lot', 'Needs partner with similar capacity for reflection', 'Can appear low-energy to more spontaneous partners'],
      careers: ['Counsellor', 'Professor', 'Librarian', 'Yoga teacher', 'Nature guide'],
      hobbies: ['Philosophy of love and ethics', 'Long walks', 'Writing letters', 'Reading biographies', 'Meditation'],
      character: { name: 'Anne of Green Gables', from: 'L.M. Montgomery', why: 'Romantically thoughtful, fully alive to beauty — you see the extraordinary in the ordinary moments of love.' }
    },
    TheArchitect: {
      emoji: '🏠',
      tagline: 'You don\'t fall into love — you build it.',
      description: 'You approach relationships with the same care and intelligence you bring to anything worth building. You believe love is a project — one that requires clear communication, intentional investment, and a shared vision. You are reliable, considered, and deeply committed to the people who earn your trust.',
      strengths: ['Creating a lasting, intentional partnership', 'Clear communication about needs', 'Building something mutually valuable', 'Reliability and follow-through', 'Planning a beautiful shared future'],
      weaknesses: ['Can over-engineer the relationship', 'Spontaneity doesn\'t come naturally', 'Vulnerability may lag behind the structure', 'High standards can create pressure', 'Needs to let love surprise them sometimes'],
      careers: ['Project Manager', 'Architect', 'Entrepreneur', 'Financial Advisor', 'Lawyer'],
      hobbies: ['Home design', 'Joint financial planning', 'Travelling with detailed itineraries', 'Structured self-improvement', 'Joint business ventures'],
      character: { name: 'Viola (Twelfth Night)', from: 'Shakespeare', why: 'Strategic heart — you lay the groundwork carefully, then commit completely when the foundation is right.' }
    }
  }
};

// Scoring → Type mapping per mode
const SCORING_MAPS = {
  career: [
    { type: 'Visionary',  primary: 'crea',  secondary: 'adapt' },
    { type: 'Architect',  primary: 'anal',  secondary: 'disc'  },
    { type: 'Commander',  primary: 'lead',  secondary: 'extro' },
    { type: 'Connector',  primary: 'comm',  secondary: 'extro' },
    { type: 'Craftsman',  primary: 'disc',  secondary: 'anal'  },
    { type: 'Explorer',   primary: 'adapt', secondary: 'crea'  }
  ],
  character: [
    { type: 'TheOracle',    primary: 'anal',  secondary: 'intro' },
    { type: 'TheCatalyst',  primary: 'lead',  secondary: 'extro' },
    { type: 'TheMystic',    primary: 'crea',  secondary: 'intro' },
    { type: 'TheChampion',  primary: 'disc',  secondary: 'lead'  },
    { type: 'TheWildcard',  primary: 'adapt', secondary: 'crea'  },
    { type: 'TheLegend',    primary: 'lead',  secondary: 'comm'  }
  ],
  relationship: [
    { type: 'TheDeepDiver',  primary: 'anal',  secondary: 'intro' },
    { type: 'TheFreeSpirit', primary: 'adapt', secondary: 'extro' },
    { type: 'TheAnchor',     primary: 'disc',  secondary: 'comm'  },
    { type: 'TheFlame',      primary: 'extro', secondary: 'lead'  },
    { type: 'TheSage',       primary: 'comm',  secondary: 'anal'  },
    { type: 'TheArchitect',  primary: 'disc',  secondary: 'lead'  }
  ]
};

// Trait labels for radar
const TRAIT_LABELS = {
  lead: 'Leadership',
  crea: 'Creativity',
  disc: 'Discipline',
  comm: 'Communication',
  adapt: 'Adaptability'
};

// ================================================
// APP STATE
// ================================================
let state = {
  mode: 'career',
  questions: [],
  currentIndex: 0,
  answers: {},   // questionId → optionIndex
  scores: {},
  result: null,
  timer: null,
  timeLeft: 30,
  theme: localStorage.getItem('psyche-theme') || 'dark'
};

// ================================================
// INIT
// ================================================
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(state.theme);
  checkHistory();
  bindWelcomeEvents();
  bindQuizEvents();
  bindResultEvents();
});

// ================================================
// THEME
// ================================================
function applyTheme(t) {
  state.theme = t;
  document.body.setAttribute('data-theme', t);
  localStorage.setItem('psyche-theme', t);
  const icons = document.querySelectorAll('.toggle-icon, #theme-toggle-2');
  icons.forEach(el => { if(el) el.textContent = t === 'dark' ? '☀️' : '🌙'; });
}

function bindThemeToggle(id) {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener('click', () => applyTheme(state.theme === 'dark' ? 'light' : 'dark'));
}

// ================================================
// WELCOME SCREEN
// ================================================
function bindWelcomeEvents() {
  bindThemeToggle('theme-toggle');
  bindThemeToggle('theme-toggle-2');

  document.querySelectorAll('.mode-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.mode = tab.dataset.mode;
    });
  });

  document.getElementById('start-btn').addEventListener('click', startQuiz);

  document.getElementById('history-btn').addEventListener('click', () => {
    const panel = document.getElementById('history-panel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  });

  document.getElementById('clear-history-btn').addEventListener('click', () => {
    localStorage.removeItem('psyche-history');
    checkHistory();
    showToast('History cleared');
  });
}

function checkHistory() {
  const history = getHistory();
  const btn = document.getElementById('history-btn');
  if (history.length > 0) {
    btn.style.display = 'inline-flex';
    renderHistory(history);
  } else {
    btn.style.display = 'none';
    document.getElementById('history-panel').style.display = 'none';
  }
}

function getHistory() {
  try { return JSON.parse(localStorage.getItem('psyche-history') || '[]'); } catch { return []; }
}

function saveToHistory(entry) {
  const history = getHistory();
  history.unshift(entry);
  if (history.length > 10) history.pop();
  localStorage.setItem('psyche-history', JSON.stringify(history));
}

function renderHistory(history) {
  const list = document.getElementById('history-list');
  list.innerHTML = history.map(h => `
    <div class="history-item">
      <span class="h-type">${h.type}</span>
      <span class="h-mode">${h.mode}</span>
      <span class="h-date">${h.date}</span>
    </div>
  `).join('');
}

// ================================================
// QUIZ LOGIC
// ================================================
function startQuiz() {
  const raw = ALL_QUESTIONS[state.mode];
  // Filter adaptive questions out initially; insert inline when triggered
  state.questions = raw.filter(q => !q.isAdaptive);
  state.currentIndex = 0;
  state.answers = {};
  state.scores = { lead:0, crea:0, disc:0, comm:0, adapt:0, anal:0, intro:0, extro:0 };
  showScreen('question-screen');
  renderQuestion();
}

function buildQuestionList() {
  // Rebuild with adaptive injected
  const base = ALL_QUESTIONS[state.mode].filter(q => !q.isAdaptive);
  const result = [];
  for (let i = 0; i < base.length; i++) {
    result.push(base[i]);
    if (base[i].adaptive) {
      const { traitCheck, threshold, nextId } = base[i].adaptive;
      if ((state.scores[traitCheck] || 0) >= threshold) {
        const adaptQ = ALL_QUESTIONS[state.mode].find(q => q.id === nextId);
        if (adaptQ && !result.find(r => r.id === nextId)) {
          result.splice(result.indexOf(base[i]) + 1, 0, adaptQ);
        }
      }
    }
  }
  return result;
}

function renderQuestion(direction = 'forward') {
  const card = document.getElementById('question-card');
  card.classList.add(direction === 'forward' ? 'flip-out' : 'flip-out');

  setTimeout(() => {
    state.questions = buildQuestionList();
    const q = state.questions[state.currentIndex];
    if (!q) return;

    document.getElementById('q-counter').textContent = `${state.currentIndex + 1} / ${state.questions.length}`;
    document.getElementById('q-badge').textContent = `Q${state.currentIndex + 1}${q.isAdaptive ? ' ★' : ''}`;
    document.getElementById('question-text').textContent = q.text;

    const fill = ((state.currentIndex) / state.questions.length) * 100;
    document.getElementById('progress-bar-fill').style.width = `${fill}%`;

    // Options
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    const savedIdx = state.answers[q.id];

    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn' + (savedIdx === i ? ' selected' : '');
      btn.setAttribute('aria-label', opt.text);
      btn.innerHTML = `
        <span class="option-letter">${String.fromCharCode(65 + i)}</span>
        <span class="option-text">${opt.text}</span>
      `;
      btn.addEventListener('click', () => selectOption(q.id, i, btn));
      btn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectOption(q.id, i, btn); } });
      container.appendChild(btn);
    });

    // Prev button
    document.getElementById('prev-btn').disabled = state.currentIndex === 0;

    // Update next button label
    const nextBtn = document.getElementById('next-btn');
    nextBtn.textContent = state.currentIndex === state.questions.length - 1 ? 'Review →' : 'Next →';

    card.classList.remove('flip-out', 'flip-in');
    void card.offsetWidth; // reflow
    card.classList.add('flip-in');
    setTimeout(() => card.classList.remove('flip-in'), 300);

    startTimer();
  }, 180);
}

function selectOption(qId, idx, clickedBtn) {
  state.answers[qId] = idx;
  document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  clickedBtn.classList.add('selected');
  // Apply scores immediately for adaptive logic
  updateScoresFromAnswer(qId, idx);
}

function updateScoresFromAnswer(qId, idx) {
  const q = state.questions.find(q => q.id === qId) || 
    ALL_QUESTIONS[state.mode].find(q => q.id === qId);
  if (!q) return;
  const option = q.options[idx];
  if (!option) return;
  // Reset and recompute all scores from scratch
  recalculateAllScores();
}

function recalculateAllScores() {
  const fresh = { lead:0, crea:0, disc:0, comm:0, adapt:0, anal:0, intro:0, extro:0 };
  for (const [qId, idx] of Object.entries(state.answers)) {
    const q = ALL_QUESTIONS[state.mode].find(q => q.id === qId);
    if (!q) continue;
    const option = q.options[idx];
    if (!option) continue;
    for (const [trait, val] of Object.entries(option.scores || {})) {
      fresh[trait] = (fresh[trait] || 0) + val;
    }
  }
  state.scores = fresh;
}

function bindQuizEvents() {
  document.getElementById('next-btn').addEventListener('click', handleNext);
  document.getElementById('prev-btn').addEventListener('click', handlePrev);
  document.getElementById('review-btn').addEventListener('click', showReview);
  document.getElementById('back-to-welcome').addEventListener('click', () => {
    stopTimer();
    showScreen('welcome-screen');
  });

  document.getElementById('back-to-quiz-btn').addEventListener('click', () => {
    showScreen('question-screen');
    renderQuestion();
  });

  document.getElementById('submit-btn').addEventListener('click', submitQuiz);
}

function handleNext() {
  state.questions = buildQuestionList();
  const q = state.questions[state.currentIndex];
  if (state.answers[q.id] === undefined) {
    showToast('Please pick an option to continue ✋');
    shakeCard();
    return;
  }
  if (state.currentIndex >= state.questions.length - 1) {
    showReview();
    return;
  }
  state.currentIndex++;
  renderQuestion('forward');
}

function handlePrev() {
  if (state.currentIndex === 0) return;
  state.currentIndex--;
  renderQuestion('backward');
}

function shakeCard() {
  const card = document.getElementById('question-card');
  card.style.animation = 'none';
  void card.offsetWidth;
  card.style.animation = 'shake 0.4s ease';
  if (!document.getElementById('shake-kf')) {
    const style = document.createElement('style');
    style.id = 'shake-kf';
    style.textContent = `@keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 60%{transform:translateX(8px)} }`;
    document.head.appendChild(style);
  }
  setTimeout(() => { card.style.animation = ''; }, 400);
}

// ================================================
// TIMER
// ================================================
function startTimer() {
  stopTimer();
  state.timeLeft = 30;
  updateTimerDisplay();
  state.timer = setInterval(() => {
    state.timeLeft--;
    updateTimerDisplay();
    if (state.timeLeft <= 0) {
      stopTimer();
      autoAdvance();
    }
  }, 1000);
}

function stopTimer() {
  if (state.timer) { clearInterval(state.timer); state.timer = null; }
}

function updateTimerDisplay() {
  const el = document.getElementById('timer-display');
  if (!el) return;
  el.textContent = `0:${String(state.timeLeft).padStart(2, '0')}`;
  el.classList.toggle('urgent', state.timeLeft <= 8);
}

function autoAdvance() {
  // Neutral score — just skip
  state.currentIndex++;
  state.questions = buildQuestionList();
  if (state.currentIndex < state.questions.length) {
    renderQuestion('forward');
  } else {
    showReview();
  }
}

// ================================================
// REVIEW SCREEN
// ================================================
function showReview() {
  stopTimer();
  state.questions = buildQuestionList();
  const list = document.getElementById('review-list');
  list.innerHTML = state.questions.map((q, i) => {
    const ansIdx = state.answers[q.id];
    const ansText = ansIdx !== undefined ? q.options[ansIdx].text : null;
    return `
      <div class="review-item">
        <div class="ri-q">Question ${i + 1}${q.isAdaptive ? ' ★ Adaptive' : ''}</div>
        <div class="ri-text">${q.text}</div>
        ${ansText
          ? `<span class="ri-answer">✓ ${ansText}</span>`
          : `<span class="ri-unanswered">⚠️ Not answered</span>`
        }
      </div>
    `;
  }).join('');
  showScreen('review-screen');
}

// ================================================
// CALCULATE RESULT
// ================================================
function submitQuiz() {
  recalculateAllScores();
  const map = SCORING_MAPS[state.mode];
  let best = null, bestScore = -1;
  for (const entry of map) {
    const score = (state.scores[entry.primary] || 0) * 2 + (state.scores[entry.secondary] || 0);
    if (score > bestScore) { bestScore = score; best = entry.type; }
  }
  state.result = best;
  showScreen('result-screen');
  renderResult();
  launchConfetti();

  // Save to history
  saveToHistory({
    type: best,
    mode: state.mode,
    date: new Date().toLocaleDateString()
  });
  checkHistory();
}

// ================================================
// RESULT SCREEN
// ================================================
function renderResult() {
  const type = state.result;
  const data = PERSONALITY_TYPES[state.mode][type];
  if (!data) return;

  document.getElementById('result-emoji').textContent = data.emoji;
  document.getElementById('result-mode-tag').textContent =
    state.mode === 'career' ? 'Career Archetype' :
    state.mode === 'character' ? 'Character Archetype' : 'Relationship Style';
  document.getElementById('result-type').textContent =
    type.replace(/^The/, 'The ');
  document.getElementById('result-tagline').textContent = data.tagline;
  document.getElementById('result-description').textContent = data.description;

  const sEl = document.getElementById('result-strengths');
  sEl.innerHTML = data.strengths.map(s => `<li>${s}</li>`).join('');

  const wEl = document.getElementById('result-weaknesses');
  wEl.innerHTML = data.weaknesses.map(w => `<li>${w}</li>`).join('');

  const cEl = document.getElementById('result-careers');
  cEl.innerHTML = data.careers.map(c => `<span class="tag">${c}</span>`).join('');

  const hEl = document.getElementById('result-hobbies');
  hEl.innerHTML = data.hobbies.map(h => `<span class="tag">${h}</span>`).join('');

  const ch = data.character;
  document.getElementById('result-character').innerHTML = `
    <div class="char-name">${ch.name}</div>
    <div class="char-from">${ch.from}</div>
    <div class="char-why">${ch.why}</div>
  `;

  setTimeout(() => drawRadarChart(), 200);
}

function bindResultEvents() {
  document.getElementById('restart-btn').addEventListener('click', () => {
    showScreen('welcome-screen');
    checkHistory();
  });

  document.getElementById('share-btn').addEventListener('click', () => {
    const popup = document.getElementById('share-popup');
    popup.style.display = 'flex';
    const type = state.result;
    const data = PERSONALITY_TYPES[state.mode][type];
    const text = encodeURIComponent(`I just took the PSYCHE personality test and I'm "${type.replace(/^The/, 'The ')}" — ${data?.tagline || ''} Try it yourself!`);
    const url = encodeURIComponent('https://psyche-test.app');
    document.getElementById('twitter-share').href = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    document.getElementById('facebook-share').href = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
  });

  document.getElementById('close-share').addEventListener('click', () => {
    document.getElementById('share-popup').style.display = 'none';
  });

  document.getElementById('copy-btn').addEventListener('click', () => {
    const type = state.result;
    const data = PERSONALITY_TYPES[state.mode][type];
    const text = `PSYCHE Personality Test\n\nMy type: ${type.replace(/^The/, 'The ')}\n"${data?.tagline}"\n\n${data?.description?.substring(0, 150)}...\n\nMy fictional twin: ${data?.character?.name} (${data?.character?.from})\n\nTake the test yourself!`;
    navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard! 📋')).catch(() => showToast('Copy failed — try manually'));
  });
}

// ================================================
// RADAR CHART (Pure Canvas)
// ================================================
function drawRadarChart() {
  const canvas = document.getElementById('radar-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const radius = Math.min(W, H) / 2 - 44;

  ctx.clearRect(0, 0, W, H);

  const traits = Object.keys(TRAIT_LABELS);
  const n = traits.length;
  const maxScore = 10;
  const isDark = state.theme === 'dark';

  const gridColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const labelColor = isDark ? '#9d9a95' : '#6b6560';
  const fillColor = isDark ? 'rgba(232,201,122,0.15)' : 'rgba(184,134,10,0.12)';
  const strokeColor = isDark ? 'rgba(232,201,122,0.8)' : 'rgba(184,134,10,0.9)';
  const dotColor = isDark ? '#e8c97a' : '#b8860a';

  function angleOf(i) { return (Math.PI * 2 * i / n) - Math.PI / 2; }
  function pointAt(i, r) {
    return { x: cx + r * Math.cos(angleOf(i)), y: cy + r * Math.sin(angleOf(i)) };
  }

  // Grid rings
  for (let ring = 1; ring <= 5; ring++) {
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const p = pointAt(i, radius * ring / 5);
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Spokes
  for (let i = 0; i < n; i++) {
    const p = pointAt(i, radius);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Data polygon
  const scores = traits.map(t => Math.min((state.scores[t] || 0), maxScore));
  const maxFound = Math.max(...scores, 2);

  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const val = scores[i] / maxFound;
    const p = pointAt(i, radius * val * 0.9 + radius * 0.1);
    i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
  }
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Dots
  for (let i = 0; i < n; i++) {
    const val = scores[i] / maxFound;
    const p = pointAt(i, radius * val * 0.9 + radius * 0.1);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = dotColor;
    ctx.fill();
  }

  // Labels
  ctx.fillStyle = labelColor;
  ctx.font = `500 11px 'DM Sans', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < n; i++) {
    const lp = pointAt(i, radius + 26);
    ctx.fillText(TRAIT_LABELS[traits[i]], lp.x, lp.y);
  }
}

// ================================================
// CONFETTI
// ================================================
function launchConfetti() {
  const container = document.getElementById('confetti-container');
  container.innerHTML = '';
  const colors = ['#e8c97a', '#f0a05a', '#c97ae8', '#7ae8b8', '#e87a7a', '#7ab8e8'];
  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.cssText = `
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      width: ${6 + Math.random() * 8}px;
      height: ${6 + Math.random() * 8}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation-duration: ${2 + Math.random() * 3}s;
      animation-delay: ${Math.random() * 1.5}s;
      opacity: 0.9;
    `;
    container.appendChild(piece);
  }
  setTimeout(() => { container.innerHTML = ''; }, 6000);
}

// ================================================
// SCREEN SWITCHING
// ================================================
function showScreen(id) {
  stopTimer();
  const current = document.querySelector('.screen.active');
  const next = document.getElementById(id);

  if (current) {
    current.classList.remove('active');
    current.style.display = 'none';
  }

  if (next) {
    next.style.display = 'flex';
    void next.offsetWidth; // reflow for animation
    next.classList.add('active');
  }

  window.scrollTo(0, 0);
}

// ================================================
// TOAST
// ================================================
function showToast(msg, duration = 2500) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}
