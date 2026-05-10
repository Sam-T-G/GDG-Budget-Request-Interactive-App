export type ExpenseRow = {
  label: string;
  amount: number;
  color: GoogleColor;
};

export type GoogleColor = "blue" | "red" | "yellow" | "green";

export type LineItem = {
  id: string;
  title: string;
  subtitle: string;
  total: number;
  attendance: string;
  location: string;
  eventType: string;
  status: string;
  overview: string;
  outcome: string;
  expenses: ExpenseRow[];
  accent: GoogleColor;
};

export const LINE_ITEMS: LineItem[] = [
  {
    id: "speakers",
    title: "Google Guest Speakers & Workshops",
    subtitle: "Industry-led learning, on-campus",
    total: 2000,
    attendance: "50+ students",
    location: "RCC BLCIS A-104",
    eventType: "Campus Event · New Expense, Recurring",
    status: "Recurring program",
    overview:
      "Bring Google engineers and certified speakers directly to RCC to run hands-on workshops and certification prep. Students earn industry credentials without leaving campus.",
    outcome:
      "Attendees leave with a personalized professional development roadmap and concrete strategies for building a standout digital presence — backed by Google certifications.",
    expenses: [
      { label: "Transportation", amount: 500, color: "blue" },
      { label: "Lodging", amount: 500, color: "red" },
      { label: "Meals", amount: 600, color: "yellow" },
      { label: "Marketing & Swag", amount: 200, color: "green" },
      { label: "Technology", amount: 100, color: "blue" },
      { label: "Supplies", amount: 100, color: "red" },
    ],
    accent: "blue",
  },
  {
    id: "trips",
    title: "College & Google Tours",
    subtitle: "Silicon Valley field experience",
    total: 7500,
    attendance: "10 students",
    location: "Off-campus · California",
    eventType: "Field Trip · Existing Expense, Recurring",
    status: "Recurring program",
    overview:
      "An immersive Silicon Valley trip: private tours of the Googleplex and visits to Stanford and SJSU. Students experience the work culture of global tech leaders firsthand.",
    outcome:
      "Participants build a first-hand understanding of industry standards, expand their professional vision beyond the classroom, and gain networking and transfer inspiration.",
    expenses: [
      { label: "Travel", amount: 3500, color: "red" },
      { label: "Lodging", amount: 1400, color: "yellow" },
      { label: "Transportation", amount: 1100, color: "green" },
      { label: "Meals", amount: 1500, color: "blue" },
    ],
    accent: "red",
  },
  {
    id: "hackathon",
    title: "Google Southern California Hackathon",
    subtitle: "24-hour build sprint, on-campus",
    total: 2500,
    attendance: "100+ participants",
    location: "RCC · On-campus",
    eventType: "Skills Competition · Existing Expense, Recurring",
    status: "Flagship event",
    overview:
      "A 24-hour collaborative sprint where students from RCC and across Southern California build software using Google technologies (Flutter, Firebase, Gemini AI).",
    outcome:
      "Functional projects for portfolios, hands-on mastery of Google tooling, and direct connections with industry mentors and recruiters.",
    expenses: [
      { label: "Meals", amount: 2000, color: "yellow" },
      { label: "Technology", amount: 500, color: "green" },
    ],
    accent: "green",
  },
];

export const TOTAL_REQUEST = LINE_ITEMS.reduce((sum, item) => sum + item.total, 0);

export const CLUB_FACTS = {
  name: "Google Developer Group on Campus at Riverside City College",
  shortName: "GDG @ RCC",
  primaryContact: "Sam Gerungan",
  primaryEmail: "sgerungan3@student.rccd.edu",
  secondaryContact: "Keisha Coleen Wagas",
  secondaryEmail: "kwagas1@student.rccd.edu",
  meetingLocation: "BLCIS, A-103",
  activeMembers: 23,
  graduatingSpring: 4,
  transferringFourYear: 4,
  annualEvents: "20+",
  onCampusPercent: 90,
  attendanceRccStudents: 95,
  attendanceFacultyStaff: 5,
  attendanceTracking: "Bevy — Google's official platform, with live-stream + recording access",
  fundraiserPercent: 0,
  trustBalance: 0,
  priorAsrccFunding: false,
  fiscalYear: "FY 2026 / 2027",
  hearingWindow: "May 11–13, 2026 · 9 AM – 4 PM",
};

export const MISSION_PITCH = `GDG on Campus at RCC is a professional development engine. Tech and the startup model are the vessel — what we actually build is self-confidence, soft skills, and the qualities that translate to every career. Our members hail from biology, business, humanities, engineering, computer science, and beyond.`;

export const VESSEL_STATEMENT = `We focus on professional development — building self-confidence, soft skills, and the universal qualities that matter in any career. Tech and the startup model are the vessel; the skills travel everywhere.`;

export const DISCIPLINES: { name: string; color: "blue" | "red" | "yellow" | "green" }[] = [
  { name: "Biology", color: "green" },
  { name: "Humanities", color: "red" },
  { name: "Business", color: "yellow" },
  { name: "Engineering", color: "blue" },
  { name: "Computer Science", color: "blue" },
  { name: "Communications", color: "red" },
];

export const UNIVERSAL_SKILLS: string[] = [
  "Self-confidence",
  "Public speaking",
  "Leadership",
  "Collaboration",
  "Networking",
  "Project management",
  "Critical thinking",
  "Resilience",
];

export type LogoSlot = {
  name: string;
  file: string;
  short: string;
  accent: GoogleColor;
};

export const ACCOMPLISHMENTS = {
  berkeley: {
    headlineCount: 3,
    destination: "UC Berkeley",
    program: "Computer Science",
    transferRate: "2%",
    transferRateDetail:
      "One of the most impacted majors at any UC — transfer admit rate hovers around two percent.",
    eecs: {
      count: 1,
      label: "Electrical Engineering & Computer Sciences",
      claim: "#2 in the nation — on par with Stanford, second only to MIT.",
    },
    schoolLogo: {
      name: "UC Berkeley",
      file: "uc-berkeley.svg",
      short: "Berkeley",
      accent: "blue",
    } as LogoSlot,
    broaderAdmits: {
      eyebrow: "And the broader admit map",
      lede: "Berkeley is the headline. The pattern is wider.",
      detail:
        "The three Berkeley seats are confirmed commits. Beyond them, GDG members earned acceptances at UCLA, USC, UCSD, and UC Irvine — many into target majors with sub-10% admit rates. A community-college pipeline, holding its own against the most selective programs in the state.",
      schools: [
        { name: "UCLA", file: "ucla.svg", short: "UCLA", accent: "blue" },
        { name: "USC", file: "usc.svg", short: "USC", accent: "red" },
        { name: "UCSD", file: "ucsd.svg", short: "UCSD", accent: "blue" },
        { name: "UC Irvine", file: "uc-irvine.svg", short: "UCI", accent: "yellow" },
      ] as LogoSlot[],
    },
  },
  citrushack: {
    place: "1st",
    placeLabel: "overall",
    eventName: "Citrushack",
    eventTagline: "An internal GDG team — fully RCC — swept first place.",
    detail:
      "A community-college team out-built squads from UCLA, UC Irvine, and UC Riverside in a 24-hour sprint.",
    photo: "photos/citrushack-team.jpg",
    photoAlt:
      "GDG @ RCC team mid-build at Citrushack — laptops open, breadboards and components spread across the table.",
    photoCredit: "Major League Hacking",
    schoolsBeaten: [
      { name: "UCLA", file: "ucla.svg", short: "UCLA", accent: "blue" },
      { name: "UC Irvine", file: "uc-irvine.svg", short: "UCI", accent: "yellow" },
      { name: "UC Riverside", file: "uc-riverside.svg", short: "UCR", accent: "blue" },
    ] as LogoSlot[],
  },
  industry: {
    headline: "Offers & interview loops",
    detail:
      "Members are landing internship interviews and offers at industry-leading tech companies.",
    companies: [
      { name: "TikTok", file: "tiktok.svg", short: "TikTok", accent: "red" },
      { name: "Google", file: "google.svg", short: "Google", accent: "blue" },
      { name: "Amazon", file: "amazon.svg", short: "amazon", accent: "yellow" },
    ] as LogoSlot[],
  },
};

export const QA_ITEMS: { question: string; answer: string }[] = [
  {
    question: "Why should ASRCC fund a first-year club at this level?",
    answer:
      "Every dollar lands on infrastructure that already exists. Google provides the speakers, the platform (Bevy), the certifications, and the cloud credits at no cost. ASRCC funds the room, the meals, and the travel that bring 23 active members and 100+ hackathon participants into that pipeline. The leverage is high.",
  },
  {
    question: "How do you measure impact?",
    answer:
      "Every event runs through Bevy, Google's attendance and live-stream platform. We track sign-ups, check-ins, and live-stream views per event. Currently 90% of our 20+ annual events are on-campus, drawing members across six+ disciplines — humanities, biology, business, engineering, communications, and computer science.",
  },
  {
    question: "How do you acknowledge ASRCC?",
    answer:
      "Verbal acknowledgement at the open and close of every event, ASRCC logo placement on flyers and social graphics, and explicit credit on the GDG Bevy event pages — which are indexed by Google's developer community globally.",
  },
  {
    question: "Why does the Silicon Valley trip cost $7,500 for 10 students?",
    answer:
      "It's the highest-leverage event on the slate per student. The cost covers travel, lodging, ground transport, and meals for a multi-day Googleplex / Stanford / SJSU visit. These ten students return as recruiters, mentors, and transfer applicants — multiplying the impact across the chapter.",
  },
  {
    question: "What happens if you receive partial funding?",
    answer:
      "We prioritize in this order: (1) Hackathon — broadest reach at $2,500 for 100+ students, (2) Speakers & Workshops — recurring on-campus value at $2,000 for 50+ students, (3) Silicon Valley trip — highest individual impact at $7,500 for 10 students. Anything not funded by ASRCC goes to the Senate request in August.",
  },
];
