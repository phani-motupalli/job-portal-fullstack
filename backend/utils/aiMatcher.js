// Utility for Skill Matching, ATS Scanning, and Smart Interview Questions

const COMMON_TECH_SKILLS = [
  "React", "Node.js", "Express", "MongoDB", "JavaScript", "TypeScript",
  "HTML", "CSS", "Tailwind CSS", "Bootstrap", "Redux", "Next.js",
  "Python", "Django", "Flask", "Java", "Spring Boot", "C++", "C#",
  "SQL", "PostgreSQL", "MySQL", "Redis", "GraphQL", "REST API",
  "AWS", "Azure", "Docker", "Kubernetes", "Git", "GitHub", "CI/CD",
  "Linux", "Agile", "Scrum", "Figma", "UI/UX", "Jest", "Mocha"
];

const ACTION_VERBS = [
  "built", "developed", "implemented", "architected", "engineered",
  "optimized", "spearheaded", "designed", "created", "deployed",
  "managed", "led", "enhanced", "reduced", "increased", "maintained"
];

// Extract tech skills from any text
function extractSkills(text = "") {
  if (!text) return [];
  const found = new Set();
  const lower = text.toLowerCase();

  COMMON_TECH_SKILLS.forEach((skill) => {
    // Regex boundary check for skill
    const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`(^|[^a-zA-Z0-9#+])${escaped}([^a-zA-Z0-9#+]|$)`, "i");
    if (regex.test(text)) {
      found.add(skill);
    }
  });

  return Array.from(found);
}

// Calculate Match Score between candidate profile & job requirements
function calculateMatchScore(candidateSkills = [], jobSkills = [], jobDescription = "") {
  let required = jobSkills.length ? [...jobSkills] : extractSkills(jobDescription);
  if (!required.length) {
    required = ["Communication", "Problem Solving", "Teamwork"];
  }

  const candidateLower = candidateSkills.map((s) => s.toLowerCase().trim());
  const matched = [];
  const missing = [];

  required.forEach((req) => {
    const isMatched = candidateLower.some(
      (cs) => cs === req.toLowerCase().trim() || cs.includes(req.toLowerCase().trim()) || req.toLowerCase().includes(cs)
    );
    if (isMatched) {
      matched.push(req);
    } else {
      missing.push(req);
    }
  });

  const rawPercent = required.length ? Math.round((matched.length / required.length) * 100) : 75;
  // Base floor for general profile relevance if some skills match
  const matchScore = Math.min(100, Math.max(15, rawPercent));

  let tip = "";
  if (matchScore >= 80) {
    tip = "🔥 Outstanding match! Your skill set closely aligns with this role's tech stack.";
  } else if (matchScore >= 50) {
    tip = `💡 Solid foundation! Learning ${missing.slice(0, 2).join(" & ")} could boost your chances significantly.`;
  } else {
    tip = `🚀 Great learning opportunity! Consider building a project using ${missing.slice(0, 3).join(", ")}.`;
  }

  return {
    matchScore,
    matchedSkills: matched,
    missingSkills: missing,
    upskillTip: tip,
  };
}

// ATS Resume Scanner
function scanATS(jobDescription = "", jobTitle = "", resumeText = "") {
  if (!resumeText || resumeText.trim().length < 20) {
    return {
      atsScore: 25,
      matchedKeywords: [],
      missingKeywords: extractSkills(jobDescription),
      actionVerbsCount: 0,
      readability: "Needs More Content",
      recommendations: [
        "Your resume text is too short. Paste a full resume summary including projects and skills.",
        "Include specific tools and technologies mentioned in the job description."
      ],
    };
  }

  const jobSkills = extractSkills(jobDescription + " " + jobTitle);
  const resumeSkills = extractSkills(resumeText);
  const resumeLower = resumeText.toLowerCase();

  const matchedKeywords = [];
  const missingKeywords = [];

  jobSkills.forEach((skill) => {
    if (resumeLower.includes(skill.toLowerCase())) {
      matchedKeywords.push(skill);
    } else {
      missingKeywords.push(skill);
    }
  });

  // Check Action Verbs
  let actionVerbsFound = 0;
  ACTION_VERBS.forEach((verb) => {
    if (resumeLower.includes(verb)) {
      actionVerbsFound++;
    }
  });

  // Keyword Score (max 60)
  const skillRatio = jobSkills.length ? matchedKeywords.length / jobSkills.length : 0.8;
  const keywordScore = Math.round(skillRatio * 60);

  // Action Verbs Score (max 20)
  const verbScore = Math.min(20, actionVerbsFound * 4);

  // Length & Content Depth Score (max 20)
  const words = resumeText.trim().split(/\s+/).length;
  let lengthScore = 10;
  if (words > 100 && words < 800) lengthScore = 20;
  else if (words >= 800) lengthScore = 15;

  const totalScore = Math.min(99, Math.max(20, keywordScore + verbScore + lengthScore));

  const recommendations = [];
  if (missingKeywords.length > 0) {
    recommendations.push(
      `Add missing target keywords: ${missingKeywords.slice(0, 5).join(", ")} directly into your experience or skills section.`
    );
  }
  if (actionVerbsFound < 3) {
    recommendations.push(
      "Use stronger impact action verbs such as 'architected', 'optimized', 'implemented', or 'engineered' to describe your accomplishments."
    );
  }
  if (!resumeLower.includes("%") && !resumeLower.includes("increase") && !resumeLower.includes("reduced")) {
    recommendations.push(
      "Quantify your results with metrics (e.g. 'Improved page load speed by 35%' or 'Managed a database of 10,000+ records')."
    );
  }
  if (recommendations.length === 0) {
    recommendations.push("Your resume matches ATS standards exceptionally well! Tailor your cover pitch to stand out further.");
  }

  return {
    atsScore: totalScore,
    matchedKeywords,
    missingKeywords,
    actionVerbsCount: actionVerbsFound,
    wordCount: words,
    readability: words > 150 ? "High" : "Moderate",
    recommendations,
  };
}

// Generate Default Interview Questions based on job title & skills
function generateInterviewQuestions(title = "", skills = []) {
  const t = title.toLowerCase();
  const questions = [];

  if (t.includes("react") || skills.some(s => s.toLowerCase().includes("react"))) {
    questions.push({
      question: "How does React's Virtual DOM work and how does reconciliation optimize rendering?",
      answerGuide: "React creates an in-memory Virtual DOM tree. When state changes, a new tree is created and diffed (reconciliation) using heuristic O(n) algorithms, applying batch updates to the real DOM.",
      category: "Technical"
    });
    questions.push({
      question: "When would you choose useMemo and useCallback, and what are the performance trade-offs?",
      answerGuide: "useMemo caches calculated values while useCallback caches function references to prevent unnecessary child re-renders. Overusing them adds overhead, so use only for heavy calculations or memoized children.",
      category: "Technical"
    });
  }

  if (t.includes("node") || t.includes("backend") || skills.some(s => s.toLowerCase().includes("node") || s.toLowerCase().includes("express"))) {
    questions.push({
      question: "Explain the Node.js Event Loop phases and how asynchronous I/O is handled.",
      answerGuide: "The event loop has distinct phases: Timers (setTimeout), Pending Callbacks, Poll (I/O operations), Check (setImmediate), and Close callbacks, supported by libuv thread pool.",
      category: "Technical"
    });
    questions.push({
      question: "How do you protect REST API endpoints against common vulnerabilities (SQL/NoSQL injection, CORS, rate limits)?",
      answerGuide: "Use parameterized queries/Mongoose schema sanitization, helmet middleware, strict CORS origins, express-rate-limit, and JWT verification with short expiration and refresh tokens.",
      category: "Security"
    });
  }

  if (t.includes("full") || t.includes("developer") || t.includes("engineer")) {
    questions.push({
      question: "Describe how you design a scalable state management architecture for a MERN application.",
      answerGuide: "Separate server state (React Query/SWR or fetch caching) from UI state (Context API/Zustand/Redux). Keep state local where possible to prevent broad cascading re-renders.",
      category: "System Design"
    });
  }

  // Always include Behavioral & Situational
  questions.push({
    question: "Tell me about a challenging bug or performance bottleneck you resolved recently. How did you diagnose it?",
    answerGuide: "Use the STAR framework (Situation, Task, Action, Result). Highlight profiling tools used (Chrome DevTools, network tab, logs), debugging methodology, and quantifiable outcome.",
    category: "Behavioral"
  });

  questions.push({
    question: "How do you handle tight deadlines when project scope begins to creep?",
    answerGuide: "Proactively communicate with stakeholders, prioritize core MVP deliverables via MoSCoW framework, document trade-offs, and maintain test coverage rather than writing sloppy code.",
    category: "Behavioral"
  });

  return questions;
}

module.exports = {
  extractSkills,
  calculateMatchScore,
  scanATS,
  generateInterviewQuestions,
};
