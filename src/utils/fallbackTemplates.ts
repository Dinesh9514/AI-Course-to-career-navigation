import { CareerRoadmap, SkillGapAnalysis, ProjectSuggestion, PortfolioData } from "../types";

export function getOfflineRoadmap(courseName: string): CareerRoadmap {
  const normalized = courseName.toLowerCase();
  
  let role = "Specialist";
  let skills = ["Analytical Reasoning", "Problem Solving"];
  let growth = "Continuous industrial modernization and system architectural design leadership.";

  if (normalized.includes("data") || normalized.includes("machine") || normalized.includes("ml")) {
    role = "Data Scientist";
    skills = ["Python", "SQL", "Pandas", "Scikit-Learn", "Machine Learning"];
    growth = "Evolution into Principal Data Scientist or Lead AI Architect, defining corporate data intelligence frameworks.";
  } else if (normalized.includes("cyber") || normalized.includes("security")) {
    role = "Cybersecurity Engineer";
    skills = ["Networking", "Linux", "Penetration Testing", "Cryptography", "Security Auditing"];
    growth = "Transitioning to Chief Information Security Officer (CISO) and directing global digital trust.";
  } else if (normalized.includes("cloud") || normalized.includes("aws") || normalized.includes("devops")) {
    role = "Cloud Architect";
    skills = ["AWS", "Docker", "Kubernetes", "Linux", "Terraform"];
    growth = "Principal Cloud Infrastructure Architect, managing hyperscale multi-cloud clusters.";
  } else if (normalized.includes("web") || normalized.includes("development") || normalized.includes("react")) {
    role = "Full Stack Engineer";
    skills = ["React", "TypeScript", "Node.js", "Express", "Tailwind CSS"];
    growth = "Growth into Principal Engineer or VP of Engineering, leading global tech stacks and product structures.";
  } else if (normalized.includes("marketing") || normalized.includes("digital")) {
    role = "Digital Marketing Strategist";
    skills = ["SEO", "Google Analytics", "Content Strategy", "AdWords", "Copywriting"];
    growth = "Chief Marketing Officer (CMO), scaling digital brand penetration and user acquisition channels.";
  }

  return {
    courseName,
    careerGrowthProjection: growth,
    roadmap: [
      {
        id: "step-1",
        step: 1,
        title: `Master ${courseName} Fundamentals`,
        description: `Acquire primary core models, syntax foundations, and industrial standards for ${courseName}.`,
        type: "Course",
        skills: [skills[0] || "Foundations", "Best Practices"],
        duration: "4 - 6 Weeks",
        resources: [
          { name: "Coursera: Professional Specialization", url: "https://coursera.org" },
          { name: "freeCodeCamp Academy", url: "https://freecodecamp.org" }
        ]
      },
      {
        id: "step-2",
        step: 2,
        title: "Build Capital Project Portfolio",
        description: "Apply foundations by creating 3 robust, full-featured projects displaying architecture, module patterns, and clear problem resolutions.",
        type: "Project",
        skills: [...skills.slice(0, 3)],
        duration: "3 - 4 Weeks",
        resources: [
          { name: "GitHub Starter Guide", url: "https://github.com" },
          { name: "Project Best Practices", url: "https://youtube.com" }
        ]
      },
      {
        id: "step-3",
        step: 3,
        title: "Obtain Premium Technical Certifications",
        description: "Validate academic credentials with internationally recognized certifications to pass HR automated screenings.",
        type: "Certification",
        skills: ["System Architecture", "Professional Competence"],
        duration: "2 - 4 Weeks",
        resources: [
          { name: "Microsoft Learn / AWS Academy", url: "https://learn.microsoft.com" },
          { name: "Google Career Certificates", url: "https://grow.google" }
        ]
      },
      {
        id: "step-4",
        step: 4,
        title: "Secure matching Industry Internship",
        description: "Acquire enterprise experience, workflow understanding (Agile/Scrum), and active reference contacts.",
        type: "Internship",
        skills: ["Collaboration", "Git Workflows", "Production Design"],
        duration: "3 - 6 Months",
        resources: [
          { name: "LinkedIn Internships Portal", url: "https://linkedin.com/jobs" },
          { name: "Adzuna Finder API", url: "https://adzuna.com" }
        ]
      },
      {
        id: "step-5",
        step: 5,
        title: `Associate ${role} Position`,
        description: "Gain entry-level full-time employment, taking complete ownership of core application modules or pipelines.",
        type: "Job Role",
        skills: [...skills],
        duration: "1 - 2 Years"
      },
      {
        id: "step-6",
        step: 6,
        title: `Senior ${role} Specialist`,
        description: "Direct technical decisions, supervise junior developers, and coordinate complex architectural structures.",
        type: "Senior Position",
        skills: ["Technical Leadership", "System Performance", "Mentorship"],
        duration: "2 - 4 Years"
      },
      {
        id: "step-7",
        step: 7,
        title: "Principal Architect & Technology Strategist",
        description: "Guide global product direction, make high-impact technical choices, and lead modern engineering organizations.",
        type: "Future Growth",
        skills: ["Product Strategy", "Hyperscale Computing", "Business Acumen"],
        duration: "5+ Years"
      }
    ]
  };
}

export function getOfflineSkillGap(courseName: string, userSkills: string[]): SkillGapAnalysis {
  const normalized = courseName.toLowerCase();
  let courseSkills: string[] = ["Foundations"];
  let internshipSkills: string[] = ["Production Deployment"];

  if (normalized.includes("data") || normalized.includes("machine") || normalized.includes("ml")) {
    courseSkills = ["Python", "SQL", "Pandas", "Matplotlib"];
    internshipSkills = ["Python", "SQL", "Pandas", "Scikit-Learn", "PyTorch", "Docker"];
  } else if (normalized.includes("cyber") || normalized.includes("security")) {
    courseSkills = ["Networking Foundations", "Linux Basics"];
    internshipSkills = ["Linux Systems", "Wireshark", "Metasploit", "Penetration Testing", "Security Firewalls"];
  } else if (normalized.includes("cloud") || normalized.includes("aws")) {
    courseSkills = ["Linux Administration", "Web Servers"];
    internshipSkills = ["AWS Services", "Docker", "Kubernetes", "Terraform CI/CD", "Bash Scripting"];
  } else if (normalized.includes("web") || normalized.includes("development") || normalized.includes("react")) {
    courseSkills = ["HTML", "CSS", "JavaScript", "React Foundations"];
    internshipSkills = ["React", "TypeScript", "Node.js", "Express", "Tailwind CSS", "Git", "REST APIs"];
  }

  const missing = internshipSkills.filter(
    (skill) => !userSkills.some((us) => us.toLowerCase() === skill.toLowerCase())
  );

  const missingItems = missing.map((skill, index) => {
    const priority: "High" | "Medium" | "Low" = index === 0 ? "High" : index === 1 ? "Medium" : "Low";
    const difficulty: "Beginner" | "Intermediate" | "Advanced" = index % 3 === 0 ? "Beginner" : index % 3 === 1 ? "Intermediate" : "Advanced";
    
    return {
      skill,
      priority,
      difficulty,
      estimatedTime: priority === "High" ? "10 - 14 Days" : "5 - 7 Days",
      learningRoadmap: [
        `Understand theoretical principles of ${skill}.`,
        `Complete hand-on small sandbox exercises.`,
        `Integrate ${skill} into a functional GitHub project repository.`
      ],
      resources: [
        { name: `${skill} Official Docs`, url: "https://google.com", platform: "Documentation" },
        { name: `Learn ${skill} on YouTube`, url: "https://youtube.com", platform: "YouTube" }
      ]
    };
  });

  const matchedCount = internshipSkills.length - missing.length;
  const careerReadinessScore = Math.max(10, Math.min(95, Math.round((matchedCount / internshipSkills.length) * 100)));

  return {
    courseSkills,
    internshipSkills,
    missingSkills: missingItems.length > 0 ? missingItems : [
      {
        skill: "CI/CD Deployment Pipelines",
        priority: "Medium" as const,
        difficulty: "Intermediate" as const,
        estimatedTime: "5 Days",
        learningRoadmap: ["Configure GitHub Actions", "Deploy app automatically to Cloud Run"],
        resources: [{ name: "GitHub Actions Tutorial", url: "https://github.com", platform: "GitHub Docs" }]
      }
    ],
    careerReadinessScore
  };
}

export function getOfflineProjects(courseName: string): ProjectSuggestion[] {
  const normalized = courseName.toLowerCase();
  let baseTech = ["HTML", "CSS", "TypeScript"];
  let coreField = "Systems Engineering";

  if (normalized.includes("data") || normalized.includes("machine") || normalized.includes("ml")) {
    baseTech = ["Python", "Pandas", "Scikit-Learn", "Streamlit"];
    coreField = "Data Intelligence";
  } else if (normalized.includes("cyber") || normalized.includes("security")) {
    baseTech = ["Python", "Linux Bash", "Wireshark API", "Nmap"];
    coreField = "Cybersecurity";
  } else if (normalized.includes("cloud") || normalized.includes("aws")) {
    baseTech = ["AWS", "Docker", "Terraform", "GitHub Actions"];
    coreField = "Cloud & DevOps";
  } else if (normalized.includes("web") || normalized.includes("development") || normalized.includes("react")) {
    baseTech = ["React", "TypeScript", "Tailwind CSS", "Node.js", "Express"];
    coreField = "Web Systems";
  }

  return [
    {
      id: "proj-beg",
      title: `Beginner: Personal ${coreField} Sandbox`,
      level: "Beginner",
      description: `A lightweight, clean application designed to demonstrate syntax competence, simple data structures, and foundational principles in ${courseName}.`,
      problemStatement: "New learners need simple, reliable sandboxes to validate and verify theoretical principles hands-on.",
      objectives: ["Create neat functional commands", "Maintain clean local state", "Display helpful status layouts"],
      technologies: [baseTech[0] || "TypeScript", baseTech[1] || "CSS", "Git"],
      dataset: "Mock Local JSON Dataset of study metrics",
      architecture: "Client-Side SPA Architecture",
      modules: [
        { name: "Input Module", description: "Collects sandbox input configurations safely" },
        { name: "Execution Engine", description: "Computes simple logic algorithms" }
      ],
      futureScope: "Integration with external cloud APIs for real-time validation feeds.",
      githubFolderStructure: `├── index.html\n├── src/\n│   ├── main.js\n│   └── styles.css\n└── package.json`,
      estimatedTime: "5 - 7 Hours",
      resumeValue: `Shows fundamental understanding of ${courseName} syntax and structured command operations.`,
      interviewQuestions: [
        "How did you implement error handling when local inputs were malformed?",
        "Explain the performance complexities of your execution module."
      ]
    },
    {
      id: "proj-int",
      title: `Intermediate: Interactive ${coreField} Hub`,
      level: "Intermediate",
      description: "A secure, fully functional dashboard demonstrating API integration, complex state synchronization, and dynamic data rendering.",
      problemStatement: "Bridging the gap between static logic and dynamic network systems is essential for industrial engineering.",
      objectives: ["Fetch third-party data asynchronously", "Implement beautiful charts and analytics timelines", "Create filters and multi-select sorting algorithms"],
      technologies: [baseTech[0] || "React", baseTech[1] || "Tailwind CSS", baseTech[2] || "TypeScript", "Axios"],
      dataset: "Public REST API Service feeds (mocked fallback support)",
      architecture: "Model-View-Controller Client architecture with centralized data stores",
      modules: [
        { name: "Network Broker", description: "Safely executes REST requests and maintains rate limits" },
        { name: "Analytics Panel", description: "Renders data distributions using elegant visual components" }
      ],
      futureScope: "Incorporate client-side search indexing to enable quick sub-second query feedback.",
      githubFolderStructure: `├── src/\n│   ├── components/\n│   │   ├── Dashboard.tsx\n│   │   └── Chart.tsx\n│   ├── utils/\n│   │   └── api.ts\n│   └── App.tsx\n├── vite.config.ts\n└── package.json`,
      estimatedTime: "15 - 20 Hours",
      resumeValue: "Displays competence in state management, responsive UI layout creation, and synchronous data communications.",
      interviewQuestions: [
        "How did you resolve race conditions when rapid search inputs fired multiple API queries?",
        "What strategies were used to make the dashboard responsive on mobile touch screens?"
      ]
    },
    {
      id: "proj-adv",
      title: `Advanced: Scalable ${coreField} Platform with AI`,
      level: "Advanced",
      description: "An enterprise-grade full-stack portal leveraging server-side LLMs, secure JWT auth systems, and persistent database storage engines.",
      problemStatement: "Organizations need robust, responsive platforms that synthesize raw content into intelligent recommendations securely.",
      objectives: ["Establish secure custom RESTful backends", "Integrate server-side LLM processing with robust prompts", "Enable local/cloud database persistent tracking"],
      technologies: [...baseTech, "Express", "Node.js", "Gemini API", "Database Store"],
      dataset: "Centralized relational database tracking profile metrics",
      architecture: "Full-Stack Server-Client Decoupled Architecture, secured by JSON Web Tokens",
      modules: [
        { name: "Auth Authority", description: "Handles secure registrations, login verifications, and sessions" },
        { name: "GenAI Orchestrator", description: "Manages backend prompts, system instructions, and JSON schemas safely" },
        { name: "Data Persistence Handler", description: "Synchronizes user state securely with DB transaction rules" }
      ],
      futureScope: "Introduce multi-user workspaces and real-time WebSockets collaboration rooms.",
      githubFolderStructure: `├── client/\n│   ├── src/\n│   │   └── components/\n├── server/\n│   ├── server.ts\n│   ├── db.json\n│   └── services/\n│       └── gemini.ts\n├── package.json\n└── tsconfig.json`,
      estimatedTime: "40 - 55 Hours",
      resumeValue: "Demonstrates ability to construct professional, secure, full-stack AI-integrated application networks suitable for high-scale tech teams.",
      interviewQuestions: [
        "Explain how you secured secret API keys from leaks onto the client/browser bundle.",
        "How does the database state recover if a server-side runtime error occurs mid-transaction?"
      ]
    }
  ];
}

export function getOfflinePortfolio(
  name: string,
  email: string,
  targetRole: string,
  skills: string[],
  projects: string[],
  internships: string[],
  certifications: string[]
): PortfolioData {
  const skList = skills.length > 0 ? skills : ["React", "TypeScript", "Node.js", "Tailwind CSS"];
  const prList = projects.length > 0 ? projects : ["AI Career Roadmap Generator", "Scalable Enterprise Dashboard"];
  const internList = internships.length > 0 ? internships : ["Software Engineering Intern at Stripe"];
  const certList = certifications.length > 0 ? certifications : ["Google Advanced Data Analytics", "AWS Certified Cloud Practitioner"];

  return {
    resume: {
      fullName: name,
      email,
      phone: "+1 (555) 019-2834",
      linkedin: `linkedin.com/in/${name.toLowerCase().replace(/\s+/g, "")}`,
      github: `github.com/${name.toLowerCase().replace(/\s+/g, "")}`,
      education: [
        { institution: "University of Tech Science", degree: "Bachelor of Science, Computer Science", year: "2024 - 2028" }
      ],
      experience: [
        {
          company: "Enterprise Software Hub",
          role: targetRole || "Software Developer",
          duration: "2025 - Present",
          details: [
            `Built responsive user interfaces incorporating modern technology paradigms including ${skList.slice(0, 3).join(", ")}.`,
            "Optimized front-end rendering performance reducing core-web-vitals load times by 32%.",
            `Engineered ${prList[0] || "custom analytics models"} enabling data-driven insights.`
          ]
        },
        {
          company: "Tech Systems Ltd",
          role: "Junior Associate Intern",
          duration: "Summer 2025",
          details: [
            `Collaborated on developer teams to deploy web models utilizing ${skList[1] || "TypeScript"}.`,
            "Created unit tests increasing overall codebase coverage thresholds by 15%."
          ]
        }
      ]
    },
    portfolioWebsite: {
      heroTitle: `Hi, I am ${name} — Aspiring ${targetRole || "Tech Professional"}`,
      aboutMe: `I am an energetic technologist with a solid academic foundation and practical project expertise. My competencies center on building highly responsive systems, analyzing skill gaps, and integrating intelligent features like ${skList.slice(0, 3).join(", ")}.`,
      featuredProjects: prList.map((p) => ({
        title: p,
        desc: "A fully developed, production-ready system constructed during my study path.",
        tech: skList.slice(0, 4)
      }))
    },
    linkedinSummary: `💡 Energetic, technical student pursuing a Career as a ${targetRole || "Software Engineer"}. Experienced in designing custom application architectures, structuring full-stack systems, and analyzing data metrics. Specialized skills include: ${skList.join(" • ")}. Looking to connect with fellow builders and recruit teams!`,
    githubReadme: `# Hi, I am ${name}! 👋\n\n### Aspiring ${targetRole || "Software Engineer"}\n\n- 🚀 Passionate about building full-stack systems and integrating artificial intelligence.\n- 🛠️ Currently mastering: **${skList.slice(0, 5).join(", ")}**\n- 📫 Contact me via: **${email}**\n\n### Core Projects\n${prList.map((p) => `- **${p}**: A fully functional, responsive system.`).join("\n")}\n\n### Active Certifications\n${certList.map((c) => `- 🎓 ${c}`).join("\n")}`,
    skills: skList,
    projects: prList,
    internships: internList,
    certifications: certList,
    suggestions: {
      resumeImprovements: [
        "Include more quantifiable metrics for your projects: express your accomplishments in percentages, load speed enhancements, or database query optimizations.",
        "Ensure your contact details (LinkedIn and GitHub URLs) are prominently listed at the top and are completely professional.",
        "Add a clear, short summary at the beginning outlining your immediate target career path and core technical stack."
      ],
      portfolioImprovements: [
        "Create a live hosted link for your featured projects, so recruiters can test them immediately in one click without cloning.",
        "Add high-quality GIFs or screenshots in your GitHub README to visually showcase the application's user interface.",
        "Write a detailed 'Challenges Faced' section in your projects to explain your technical decision-making and problem-solving skills."
      ],
      dos: [
        "Use active verb starters like 'Engineered', 'Optimized', and 'Architected' instead of passive phrases like 'Responsible for' or 'Worked on'.",
        "Keep your resume strictly to a clean, well-structured, single-page layout if you have under 3 years of experience.",
        "Keep your GitHub pinned repositories highly polished with clear documentation."
      ],
      donts: [
        "Do not list basic skills like Microsoft Word, HTML, or Web Searching on a high-level technical software engineer resume.",
        "Avoid using progress bars or percentage indicators for skills (e.g., 'JavaScript: 80%') as they are arbitrary and confusing.",
        "Avoid generic summary statements that don't highlight your unique engineering achievements."
      ]
    }
  };
}

export function getOfflineChat(message: string): string {
  const q = message.toLowerCase();
  if (q.includes("interview") || q.includes("prep") || q.includes("questions")) {
    return `### 💡 High-Yield Tech Interview Strategies\n\nWhen preparing for technical recruitment rounds, focus heavily on structured response frameworks:\n\n1. **STAR Method for Behavioral:** Situation, Task, Action, Result. Highlight quantifiably positive outcomes (e.g., "reduced latency by 20%").\n2. **React/Frontend Fundamentals:** Understand component life-cycles, the virtual DOM reconciliation, state closure pitfalls, and performance optimizations (memoization, lazy loading).\n3. **Backend & Architecture:** Be ready to describe system design, database indexing, REST vs GraphQL, and how you secure API secrets.\n\nWould you like a sample question about coding closures or REST design?`;
  }
  if (q.includes("resume") || q.includes("review") || q.includes("portfolio")) {
    return `### 📄 Resume & Portfolio Optimization Tips\n\nTo capture recruiter attention, structure your details with high-impact, actionable language:\n\n- **Lead with Outcomes:** Instead of "Wrote React code," use "Engineered modular React architecture, reducing codebase complexity and decreasing dashboard load times by 18%."\n- **List Quantifiable Metrics:** Use numbers. Percentages, hours saved, database size, and scale give immediate credibility.\n- **Keep Github Clean:** Pin your top 2-3 projects. Include beautiful README.md files detailing installation steps, architecture diagrams, and problem statements.\n\nI can generate a professional Resume, LinkedIn Summary, and GitHub README for you in our **Portfolio** builder tab!`;
  }
  if (q.includes("project") || q.includes("idea")) {
    return `### 🛠️ High-Impact Project Suggestions\n\nFor an outstanding portfolio, build projects that address real-world business problems rather than generic tutorial templates:\n\n1. **AI-Driven Customer Operations Portal:** Implements real-time text summaries of inquiries with automated replies.\n2. **Dynamic Systems Resource Analyzer:** Tracks local CPU/Memory parameters or mock metrics with custom Recharts visualizations.\n3. **Collaborative Task Workspace:** Multi-user shared boards utilizing local mock state or Firestore integrations.\n\nUse our **AI Project Generator** tab to automatically detail step-by-step github directories and sample code frameworks for these levels!`;
  }
  if (q.includes("study") || q.includes("plan") || q.includes("roadmap")) {
    return `### 📅 Accelerate Your Study Pathway\n\nTo rapidly bridge the gap between course study and active career employment, structure your calendar:\n\n- **Weeks 1-2 (Foundations):** Complete fundamental course tutorials and build 4-5 simple sandbox exercises.\n- **Weeks 3-4 (Portfolio):** Create 2 complex intermediate projects. Push code daily to GitHub to establish a clean commit streak.\n- **Weeks 5-6 (Certifications):** Clear standard certifications to satisfy HR automated filters.\n- **Weeks 7+ (Applications):** Apply for matching internship roles, practice technical mock questions, and refine your portfolio.`;
  }
  return `I can absolutely help you with that! As your AI Career Navigator, I am designed to assist you with:\n\n- **Resume Reviews** & Professional Portfolio optimization\n- **Technical Interview Prep** (mock questions and tips)\n- **Project Ideas** and step-by-step GitHub folder setups\n- **Study Plans** and course recommendations\n\nPlease let me know which area you would like to explore or specify a career topic!`;
}
