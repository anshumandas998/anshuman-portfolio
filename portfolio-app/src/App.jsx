import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";

// Counter Animation Component
function AnimatedCounter({ from = 0, to, duration = 2, suffix = "" }) {
  const [count, setCount] = useState(from);
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    let start = from;
    const end = parseFloat(to);
    const totalFrames = Math.round(duration * 60);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Ease out cubic
      const current = start + (end - start) * (1 - Math.pow(1 - progress, 3));
      
      if (frame >= totalFrames) {
        setCount(end);
        clearInterval(counter);
      } else {
        setCount(Number.isInteger(end) ? Math.floor(current) : parseFloat(current.toFixed(1)));
      }
    }, 1000 / 60);

    return () => clearInterval(counter);
  }, [inView, from, to, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

// Interactive Tilt Card Component
function TiltCard({ children, className = "" }) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotateX((-y / rect.height) * 15);
    setRotateY((x / rect.width) * 15);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 250, damping: 25 }}
      style={{ transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Portfolio() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [workFilter, setWorkFilter] = useState("all");
  const [activeResumeTab, setActiveResumeTab] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Scroll Progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Dynamic Typewriter Roles
  const roles = [
    "Generative AI Specialist",
    "Agentic AI Engineer",
    "Full-Stack Architect",
    "National Hackathon Winner 🏆",
    "Testing & QA Enthusiast",
    "Founder @ Learnexia"
  ];

  useEffect(() => {
    const roleInterval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2800);
    return () => clearInterval(roleInterval);
  }, [roles.length]);

  // Back to top visibility listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ambient mouse position tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Contact Form State with Web3Forms
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "Full-Stack Web Development",
    message: ""
  });
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setMobileMenuOpen(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: "", message: "" });

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "db2d43ed-392f-4e4f-bd74-21258875901a",
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          message: formData.message,
          subject: `Portfolio Inquiry from ${formData.firstName} (${formData.service})`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setFormStatus({
          type: "success",
          message: "🎉 Message sent successfully! I will get back to you within 24 hours.",
        });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          service: "Full-Stack Web Development",
          message: ""
        });
      } else {
        setFormStatus({
          type: "error",
          message: result.message || "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormStatus({
        type: "error",
        message: "Network error. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Services Data
  const services = [
    {
      num: "01",
      title: "Generative AI & Agentic Workflows",
      desc: "Architecting autonomous AI agents, multi-agent swarms, LLM orchestration, custom RAG search pipelines, and seamless OpenAI/Claude API integrations.",
      features: ["Autonomous AI Agents", "LangChain & RAG Pipelines", "OpenAI & Claude APIs", "Prompt Engineering & Evaluation"]
    },
    {
      num: "02",
      title: "Full-Stack Web Engineering",
      desc: "Architecting responsive, ultra-fast web applications using modern React 19, Next.js, Java, and Node.js with scalable microservices.",
      features: ["React 19 & Next.js 15", "REST & GraphQL APIs", "Performance Tuning", "Scalable Architecture"]
    },
    {
      num: "03",
      title: "Backend & Cloud Architecture",
      desc: "Building rock-solid RESTful and GraphQL APIs, optimized database schemas (MongoDB, MySQL, PostgreSQL), and secure authentication pipelines.",
      features: ["Java Enterprise & Node.js", "MongoDB & PostgreSQL", "OAuth & JWT Security", "Docker & CI/CD Pipelines"]
    },
    {
      num: "04",
      title: "Automated Testing & QA",
      desc: "Writing comprehensive unit, integration, and end-to-end test suites ensuring zero regressions and high reliability across production releases.",
      features: ["Unit & Integration Testing", "Jest & Cypress E2E", "API Contract Testing", "Automated QA Pipelines"]
    },
  ];

  // Projects Data (All 11 GitHub Repositories with Realtime UI Screenshots)
  const projects = [
    {
      id: "tiger-conservation",
      title: "Tiger Conservation AI",
      category: "aiml",
      categoryLabel: "AI & Wildlife Tech",
      subtitle: "Computer Vision & Poaching Detection Platform",
      description: "An intelligent AI and computer vision solution for tiger conservation, camera trap analysis, habitat monitoring, and anti-poaching threat alerting systems.",
      tech: ["Python", "Computer Vision", "Machine Learning", "FastAPI", "React"],
      link: "https://github.com/anshumandas998/tiger-conservation",
      github: "https://github.com/anshumandas998/tiger-conservation",
      icon: "🐅",
      image: "/projects/tiger-conservation.jpg",
      accent: "#2563eb",
      previewGradient: "from-blue-600/20 via-blue-50 to-white",
      metrics: "Real-time AI detection & threat dispatch"
    },
    {
      id: "ai-trip-planner",
      title: "AI Trip Planner",
      category: "aiml",
      categoryLabel: "AI & Travel Tech",
      subtitle: "Personalized Smart Travel Itinerary Generator",
      description: "An intelligent travel planning platform that dynamically generates personalized day-by-day itineraries, attraction guides, and budgeting with LLM intelligence.",
      tech: ["React", "Python", "FastAPI", "OpenAI API", "Tailwind CSS"],
      link: "https://github.com/anshumandas998/Ai-Trip-Planner",
      github: "https://github.com/anshumandas998/Ai-Trip-Planner",
      icon: "✈️",
      image: "/projects/ai-trip-planner.jpg",
      accent: "#3b82f6",
      previewGradient: "from-indigo-600/20 via-blue-50 to-white",
      metrics: "Automated dynamic itinerary planning"
    },
    {
      id: "mystorage",
      title: "MyStorage Cloud Drive",
      category: "fullstack",
      categoryLabel: "Cloud & Storage",
      subtitle: "Secure Personal Cloud File Management System",
      description: "A modern cloud storage application allowing users to upload, preview, organize, download, and share files with granular access permissions and encrypted storage.",
      tech: ["React", "Node.js", "Express", "MongoDB", "Cloud Storage"],
      link: "https://github.com/anshumandas998/mystorage",
      github: "https://github.com/anshumandas998/mystorage",
      icon: "☁️",
      image: "/projects/mystorage.jpg",
      accent: "#0284c7",
      previewGradient: "from-sky-600/20 via-blue-50 to-white",
      metrics: "Chunked upload & secure sharing links"
    },
    {
      id: "pharma-company",
      title: "Pharma Company Portal",
      category: "fullstack",
      categoryLabel: "Healthcare & Pharma",
      subtitle: "Pharmaceutical Inventory & Distribution System",
      description: "Enterprise healthcare portal managing pharmaceutical product catalogs, medicine batches, supply chain inquiries, and vendor communication.",
      tech: ["React", "Java", "Spring Boot", "MySQL", "REST APIs"],
      link: "https://github.com/anshumandas998/pharma-company",
      github: "https://github.com/anshumandas998/pharma-company",
      icon: "💊",
      image: "/projects/pharma-company.jpg",
      accent: "#059669",
      previewGradient: "from-emerald-600/20 via-teal-50 to-white",
      metrics: "End-to-end medicine catalog & batch tracking"
    },
    {
      id: "parking-hub",
      title: "Parking Hub",
      category: "fullstack",
      categoryLabel: "IoT & Smart City",
      subtitle: "Real-Time Slot Reservation System",
      description: "Smart parking management solution enabling drivers to discover available parking spots, make real-time reservations, and manage slot occupancies with live maps.",
      tech: ["React", "Java", "REST APIs", "MySQL", "Tailwind CSS"],
      link: "https://github.com/anshumandas998/Parking-Hub",
      github: "https://github.com/anshumandas998/Parking-Hub",
      icon: "🅿️",
      image: "/projects/parking-hub.jpg",
      accent: "#2563eb",
      previewGradient: "from-blue-600/20 via-blue-50 to-white",
      metrics: "Live spot tracking & instant slot booking"
    },
    {
      id: "alumni-connections",
      title: "Alumni Connections",
      category: "fullstack",
      categoryLabel: "Social & Mentorship",
      subtitle: "University Alumni Networking Portal",
      description: "An engaging community platform connecting university graduates with current students for career mentorship, job referrals, events, and discussions.",
      tech: ["React", "Node.js", "Express", "MongoDB", "Socket.io"],
      link: "https://github.com/anshumandas998/Alumni-Connections",
      github: "https://github.com/anshumandas998/Alumni-Connections",
      icon: "🎓",
      image: "/projects/alumni-connections.jpg",
      accent: "#4f46e5",
      previewGradient: "from-indigo-600/20 via-blue-50 to-white",
      metrics: "Mentorship matching & community threads"
    },
    {
      id: "auto-trade-hub",
      title: "Auto Trade Hub",
      category: "apps",
      categoryLabel: "Marketplace & E-Commerce",
      subtitle: "Vehicle Buying, Selling & Trading Marketplace",
      description: "Feature-packed automotive marketplace connecting buyers and verified sellers with instant filtering, fair-market valuations, test drive scheduling, and listings.",
      tech: ["React", "Express.js", "Node.js", "Tailwind CSS", "MongoDB"],
      link: "https://github.com/anshumandas998/auto-trade-hub",
      github: "https://github.com/anshumandas998/auto-trade-hub",
      icon: "🚗",
      image: "/projects/auto-trade-hub.jpg",
      accent: "#2563eb",
      previewGradient: "from-blue-600/20 via-indigo-50 to-white",
      metrics: "Multi-filter vehicle query engine"
    },
    {
      id: "tambola-game",
      title: "Tambola Multiplayer Game",
      category: "apps",
      categoryLabel: "Interactive Gaming",
      subtitle: "Real-Time Multiplayer Housie Game",
      description: "Interactive real-time multiplayer Tambola (Housie / Bingo) with automatic ticket generation, number calling audio, claims verification, and live scoreboards.",
      tech: ["JavaScript", "React", "HTML5 Canvas", "WebSockets", "CSS3"],
      link: "https://github.com/anshumandas998/Tambola-game",
      github: "https://github.com/anshumandas998/Tambola-game",
      icon: "🎲",
      image: "/projects/tambola-game.jpg",
      accent: "#e11d48",
      previewGradient: "from-rose-600/20 via-pink-50 to-white",
      metrics: "Real-time ticket generation & rule verification"
    },
    {
      id: "calori-calculator",
      title: "Calorie Calculator",
      category: "apps",
      categoryLabel: "Health & Fitness",
      subtitle: "Daily Nutrition, Macro & BMR Calculator",
      description: "A responsive fitness utility to calculate BMR, TDEE, macro distributions, daily food calories, and body recomposition targets with interactive charts.",
      tech: ["React", "JavaScript", "Chart.js", "Tailwind CSS"],
      link: "https://github.com/anshumandas998/Calori-Calculator",
      github: "https://github.com/anshumandas998/Calori-Calculator",
      icon: "🥗",
      image: "/projects/calori-calculator.jpg",
      accent: "#0d9488",
      previewGradient: "from-teal-600/20 via-emerald-50 to-white",
      metrics: "Accurate BMR/TDEE & macronutrient targets"
    },
    {
      id: "anshuman-portfolio",
      title: "Anshuman Portfolio",
      category: "fullstack",
      categoryLabel: "Portfolio & UI Design",
      subtitle: "Modern White & Blue Interactive Developer Portfolio",
      description: "Modern, animated, high-performance developer portfolio built with React 19, Tailwind CSS, and Framer Motion featuring smooth 3D tilt effects and Web3Forms.",
      tech: ["React 19", "Vite", "Tailwind CSS", "Framer Motion"],
      link: "https://github.com/anshumandas998/anshuman-portfolio",
      github: "https://github.com/anshumandas998/anshuman-portfolio",
      icon: "⚡",
      image: "/projects/anshuman-portfolio.jpg",
      accent: "#2563eb",
      previewGradient: "from-blue-600/20 via-blue-50 to-white",
      metrics: "100% Responsive, 60fps Framer Motion"
    },
    {
      id: "learnexia",
      title: "Learnexia EdTech Platform",
      category: "fullstack",
      categoryLabel: "Founder & EdTech",
      subtitle: "Practical Technology Learning Platform",
      description: "Comprehensive edtech startup platform delivering practical developer courses, industry-grade projects, and student learning programs.",
      tech: ["React", "Node.js", "MongoDB", "Tailwind CSS", "JWT"],
      link: "https://www.learnexia.in/",
      github: "https://github.com/anshumandas998",
      icon: "🌟",
      image: "/projects/learnexia.jpg",
      accent: "#2563eb",
      previewGradient: "from-blue-600/20 via-blue-50 to-white",
      metrics: "Live at learnexia.in"
    }
  ];

  const filteredProjects = workFilter === "all" 
    ? projects 
    : projects.filter(p => p.category === workFilter);

  // Experience & Achievements Data
  const experiences = [
    {
      period: "2024",
      title: "WINNER - NATIONAL LEVEL HACKATHON 🏆",
      company: "AITM College",
      type: "award",
      desc: "Secured 1st Place at the prestigious National Level Hackathon hosted at AITM College among 100+ competing teams, building an innovative, full-stack software solution recognized for outstanding architecture, UX, and execution."
    },
    {
      period: "2024 - Present",
      title: "FOUNDER & CEO",
      company: "Learnexia",
      type: "work",
      desc: "Leading core vision, product architecture, curriculum engineering, and digital growth to empower thousands of students with practical tech skills."
    },
    {
      period: "2023 - 2024",
      title: "FULL STACK WEB DEVELOPER",
      company: "Independent Projects & Freelance",
      type: "work",
      desc: "Engineered scalable web applications, real-time parking platforms, and AI-assisted tools using React, Java, and modern REST APIs."
    },
    {
      period: "2023 - Present",
      title: "OPEN SOURCE CONTRIBUTOR",
      company: "GitHub Community",
      type: "work",
      desc: "Actively building developer utilities, modern React components, and contributing to open-source software ecosystems."
    },
    {
      period: "2022 - 2023",
      title: "CYBERSECURITY & DEV ENTHUSIAST",
      company: "Security Research",
      type: "work",
      desc: "Investigating web application vulnerabilities, secure authentication protocols, and best practices for resilient cloud architectures."
    }
  ];

  // Education Data
  const educations = [
    {
      period: "2023 - 2027",
      title: "B-TECH IN COMPUTER SCIENCE & ENG.",
      company: "GIET University, Gunupur",
      type: "edu",
      desc: "Specializing in Data Structures, Algorithms, Full-Stack Software Engineering, Machine Learning, and Cloud Architecture."
    },
    {
      period: "2021 - 2023",
      title: "12TH SCIENCE (HIGHER SECONDARY)",
      company: "Jhadeswar Science Residential Higher Secondary School",
      type: "edu",
      desc: "Graduated with strong foundations in Physics, Chemistry, and Advanced Mathematics in Balasore, Odisha."
    },
    {
      period: "2020 - 2021",
      title: "HIGH SCHOOL CERTIFICATE (10TH)",
      company: "KB Nodal High School, Tapandia",
      type: "edu",
      desc: "Completed secondary education with top academic excellence and leadership in science & tech initiatives."
    },
    {
      period: "2023 - 2024",
      title: "ADVANCED CERTIFICATIONS",
      company: "Web Development & AI Programs",
      type: "edu",
      desc: "Completed industry-grade certifications in React, Java Enterprise Development, and Machine Learning pipelines."
    }
  ];

  // Skills Data with Percentages & Custom Icons
  const skills = [
    {
      name: "React.js",
      percent: "92%",
      level: 92,
      category: "frontend",
      icon: (
        <svg className="w-10 h-10 text-[#0284c7]" viewBox="0 0 115.3 100" fill="currentColor">
          <path d="M57.65 65.25c11.05 0 20-6.83 20-15.25s-8.95-15.25-20-15.25-20 6.83-20 15.25 8.95 15.25 20 15.25z" />
          <path d="M57.65 0C25.8 0 0 22.39 0 50s25.8 50 57.65 50c31.86 0 57.65-22.39 57.65-50S89.51 0 57.65 0zm0 92.5C30.22 92.5 8 73.47 8 50S30.22 7.5 57.65 7.5c27.44 0 49.65 19.03 49.65 42.5S85.09 92.5 57.65 92.5z" opacity="0.2" />
          <path d="M99.5 28.5c-4.4-7.6-13.6-11.8-24.9-11.8-7.8 0-16.3 2.1-24.3 6-12.8-6.3-26.6-8.7-38.6-6.6C4.8 17.4-1.3 25.4.3 35.8c1.3 8.3 7.8 17.5 17.5 24.8-1.5 5.5-2.2 11.2-2.2 16.9 0 10.9 2.8 18.6 8.3 22.9 4.4 3.4 9.9 4.8 16 3.8 11.9-2.1 24.4-10.7 34.6-23.7 8 3.8 16.2 5.8 23.8 5.8 11.3 0 20.5-4.2 24.9-11.8 5.6-9.7 3.3-24.5-5.7-39-3.8-6.1-8.5-12-13.9-17zm-4.3 34c-3.1 5.3-9.7 8.3-18.4 8.3-6.4 0-13.6-1.7-20.7-5-1.5-.7-3.1-1.5-4.7-2.3 8.9-11.9 16.2-24.8 21.2-37.3 4.2 4.4 7.8 9.3 10.7 14.3 6.9 11.4 8.7 22.3 5.5 27.8z" />
        </svg>
      )
    },
    {
      name: "Generative AI",
      percent: "92%",
      level: 92,
      category: "aiml",
      icon: (
        <svg className="w-10 h-10 text-[#2563eb]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      )
    },
    {
      name: "Agentic AI",
      percent: "88%",
      level: 88,
      category: "aiml",
      icon: (
        <svg className="w-10 h-10 text-[#4f46e5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <rect x="3" y="11" width="18" height="10" rx="3" />
          <circle cx="9" cy="16" r="1.5" fill="currentColor" />
          <circle cx="15" cy="16" r="1.5" fill="currentColor" />
          <path d="M12 2v4M8 6h8M12 11V8" strokeLinecap="round" />
          <circle cx="12" cy="2" r="1" fill="currentColor" />
        </svg>
      )
    },
    {
      name: "Testing & QA",
      percent: "90%",
      level: 90,
      category: "backend",
      icon: (
        <svg className="w-10 h-10 text-[#059669]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      )
    },
    {
      name: "JavaScript",
      percent: "95%",
      level: 95,
      category: "frontend",
      icon: (
        <svg className="w-10 h-10 text-[#d97706]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 0h24v24H0V0z" fill="none"/>
          <path d="M3 3h18v18H3V3zm13.7 13.9c.7 0 1.2-.2 1.6-.6.4-.4.6-.9.6-1.6 0-.8-.3-1.4-.8-1.8-.5-.4-1.3-.8-2.3-1.1-.9-.3-1.6-.6-2.1-.9-.5-.3-.9-.7-1.2-1.1-.3-.4-.4-.9-.4-1.5 0-.8.3-1.5.9-2 .6-.5 1.4-.8 2.4-.8 1 0 1.7.3 2.3.8.5.5.8 1.2.8 2h-1.9c0-.4-.1-.7-.4-.9-.3-.2-.6-.3-1-.3-.4 0-.7.1-.9.3-.2.2-.3.5-.3.8 0 .3.1.5.3.7.2.2.6.4 1.1.6 1 .3 1.8.7 2.4 1 .6.3 1 .8 1.3 1.3.3.5.5 1.1.5 1.8 0 .9-.3 1.7-1 2.3-.7.6-1.6.9-2.8.9-1.1 0-2-.3-2.7-.9-.7-.6-1-1.4-1-2.4h2c0 .6.2 1 .5 1.3.3.3.8.5 1.4.5zm-6.2.1H8.6V9.8h1.9v7.2z"/>
        </svg>
      )
    },
    {
      name: "Python & ML",
      percent: "90%",
      level: 90,
      category: "aiml",
      icon: (
        <svg className="w-10 h-10 text-[#2563eb]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.9 2c-5.2 0-4.9 2.3-4.9 2.3l.01 2.4h5v.7H4.9S2 7.1 2 12.3s2.5 5 2.5 5h1.5v-2.5s-.1-2.9 2.9-2.9h5s2.8.1 2.8-2.8V4.8s.4-2.8-4.8-2.8zm-2.7 1.6c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm2.9 18.4c5.2 0 4.9-2.3 4.9-2.3l-.01-2.4h-5v-.7h7.1s2.9.3 2.9-4.9-2.5-5-2.5-5h-1.5v2.5s.1 2.9-2.9 2.9h-5s-2.8-.1-2.8 2.8v4.3s-.4 2.8 4.8 2.8zm2.7-1.6c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"/>
        </svg>
      )
    },
    {
      name: "Java",
      percent: "85%",
      level: 85,
      category: "backend",
      icon: (
        <svg className="w-10 h-10 text-[#ea580c]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.1 18.7s-.6.5.4.6c1.3.2 2.6.2 4.2-.2 0 0 .5.3.9.5-3.3 1.5-7.3.3-5.5-.9zm-1-2.4s-.6.6.4.7c1.7.3 3.5.3 5.7-.2 0 0 .3.4.6.5-4.3 1.6-9.1.5-6.7-1zm6.9-3.7c1.3 1.5-.3 2.9-.3 2.9s2.4-1.2 1.3-2.7c-1-1.4-2-2.1-4.2-3.1-1.7-.8-1.1-1.9-1.1-1.9s.4.5 1.2.7c1.8.5 4.3 1.6 3.1 4.1zm-4.3 3.6s-2.8.7-5.5-.1c0 0-.4.5.4.6 2.3.4 5.3.3 7.8-.3-.6-.3-1.8-.3-2.7-.2zm8.1 4.5c-.7.6-3.7 1.1-6.7 1.1-4.3 0-8.9-.9-9.8-2.6 0 0-.4.8 1.1 1.4 2.2.8 5.6 1 8.8.9 3.6-.1 7.1-.8 7.9-1.9 0 0 .2-.4-.4-.5-.4.6-.9.9-.9.9z"/>
        </svg>
      )
    },
    {
      name: "Next.js",
      percent: "88%",
      level: 88,
      category: "frontend",
      icon: (
        <svg className="w-10 h-10 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.635 17.514l-6.242-8.156v8.156H9.5V6.486h1.893l6.242 8.163V6.486h1.893v11.028h-1.893z"/>
        </svg>
      )
    },
    {
      name: "Tailwind CSS",
      percent: "94%",
      level: 94,
      category: "frontend",
      icon: (
        <svg className="w-10 h-10 text-[#0284c7]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/>
        </svg>
      )
    },
    {
      name: "Node / Express",
      percent: "86%",
      level: 86,
      category: "backend",
      icon: (
        <svg className="w-10 h-10 text-[#16a34a]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7.8v11.4L12 25l10-5.8V7.8L12 2zm-1 19.3l-7-4.1V9.5l7 4.1v7.7zm2 0v-7.7l7-4.1v7.7l-7 4.1zm7-13l-7 4.1-7-4.1 7-4.1 7 4.1z"/>
        </svg>
      )
    },
    {
      name: "MongoDB",
      percent: "84%",
      level: 84,
      category: "backend",
      icon: (
        <svg className="w-10 h-10 text-[#15803d]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.193 9.555c-1.277-4.89-4.707-7.05-4.877-7.153a.747.747 0 0 0-.632 0C11.514 2.505 8.084 4.665 6.807 9.555c-1.493 5.72 1.34 9.873 4.877 12.35v.003c.1.07.214.107.316.107.102 0 .216-.037.316-.107v-.003c3.537-2.477 6.37-6.63 4.877-12.35zM12 20.354C9.206 18.23 7.02 14.86 8.243 10.17c.96-3.674 3.33-5.594 3.757-5.918.427.324 2.797 2.244 3.757 5.918 1.223 4.69-.963 8.06-3.757 10.184z"/>
        </svg>
      )
    },
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Priyanshu Verma",
      role: "Student & Developer at Learnexia",
      avatar: "👨‍💻",
      quote: "Anshuman's vision behind Learnexia and his web development expertise helped me master full-stack concepts in record time. His attention to detail in code and UI is top notch.",
    },
    {
      name: "Subham Mohanty",
      role: "Tech Lead & Collaborator",
      avatar: "🚀",
      quote: "Working with Anshuman on multiple hackathons and web applications has been phenomenal. He delivers robust, scalable full-stack code with an eye for modern design.",
    },
  ];

  // Blogs Data
  const blogs = [
    {
      date: "Feb 14, 2026",
      tag: "Full-Stack Dev",
      title: "Building High-Performance Web Apps with React 19 & Tailwind",
      desc: "Key architectural patterns and performance tips for modern interactive web applications.",
      readTime: "5 min read"
    },
    {
      date: "Jan 28, 2026",
      tag: "AI & Machine Learning",
      title: "Integrating Machine Learning Models into Live Web Platforms",
      desc: "A hands-on approach to connecting Python prediction pipelines with real-time web frontends.",
      readTime: "7 min read"
    },
    {
      date: "Jan 10, 2026",
      tag: "Web Security",
      title: "Securing Modern Web Apps: Essential Practices for 2026",
      desc: "How to protect APIs, manage secure tokens, and defend against contemporary vulnerability vectors.",
      readTime: "4 min read"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden">
      
      {/* Scroll Progress Bar at the top */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-400 origin-left z-50 shadow-[0_0_12px_rgba(37,99,235,0.8)]"
        style={{ scaleX }}
      />

      {/* Ambient Interactive Radial Mouse Glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300 hidden md:block"
        style={{
          background: `radial-gradient(650px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(37, 99, 235, 0.06), transparent 80%)`,
        }}
      />

      {/* Ambient Static Glows in Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[140px] animate-pulse-glow"></div>
        <div className="absolute top-[35%] -right-40 w-[550px] h-[550px] bg-indigo-400/10 rounded-full blur-[150px] animate-float"></div>
        <div className="absolute bottom-20 left-1/3 w-[600px] h-[600px] bg-sky-400/10 rounded-full blur-[160px] animate-pulse-glow"></div>
      </div>

      {/* Header / Navbar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          
          {/* Brand Logo + Name */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => scrollToSection("home")}
              className="flex items-center gap-3 group focus:outline-none text-left"
            >
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 p-[2px] shadow-[0_0_20px_rgba(37,99,235,0.35)] group-hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] transition duration-300">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-bold text-lg text-blue-600 font-mono tracking-tighter">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">AD</span>
                </div>
              </div>
              
              <div>
                <span className="block text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                  Anshuman Das
                </span>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-blue-600">
                  Full-Stack & AI
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            {[
              { name: "Services", id: "services" },
              { name: "Works", id: "works" },
              { name: "Resume", id: "resume" },
              { name: "Skills", id: "skills" },
              { name: "Testimonials", id: "testimonials" },
              { name: "Contact", id: "contact" },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className="text-slate-600 hover:text-blue-600 transition-colors relative py-1 focus:outline-none group font-semibold"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </nav>

          {/* Right Action: Hire Me! Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => scrollToSection("contact")}
              className="hidden sm:inline-flex shimmer-btn items-center justify-center px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-[0_0_20px_rgba(37,99,235,0.35)] hover:shadow-[0_0_30px_rgba(37,99,235,0.55)] hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Hire Me!
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-blue-600 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-72 bg-white border-l border-slate-200 z-50 p-6 pt-24 flex flex-col justify-between lg:hidden shadow-2xl"
            >
              <div className="flex flex-col gap-5">
                {[
                  { name: "Services", id: "services" },
                  { name: "Works", id: "works" },
                  { name: "Resume", id: "resume" },
                  { name: "Skills", id: "skills" },
                  { name: "Testimonials", id: "testimonials" },
                  { name: "Contact", id: "contact" },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.id)}
                    className="text-left text-lg font-semibold text-slate-700 hover:text-blue-600 transition-colors py-2 border-b border-slate-100"
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => scrollToSection("contact")}
                  className="w-full py-3 rounded-full text-center font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md"
                >
                  Hire Me!
                </button>
                <p className="text-xs text-center font-bold text-slate-700">Anshuman Das</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Sections */}
      <main className="relative z-10">
        
        {/* ========================================================
            HERO SECTION
            ======================================================== */}
        <section id="home" className="pt-32 sm:pt-40 md:pt-48 pb-20 max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              {/* Availability & Hackathon Badge */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  <span className="text-xs font-semibold tracking-wide text-slate-700">
                    Available for new projects & roles
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 shadow-sm">
                  <span className="text-sm">🏆</span>
                  <span className="text-xs font-bold">
                    National Hackathon Winner @ AITM
                  </span>
                </div>
              </div>

              <div className="block">
                <span className="text-xl sm:text-2xl font-bold text-slate-600 tracking-wide">
                  I am <span className="text-slate-900 font-extrabold">Anshuman Das</span>
                </span>
              </div>

              {/* Dynamic Animated Heading */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold text-slate-900 leading-tight tracking-tight min-h-[70px] sm:min-h-[90px] md:min-h-[110px]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={roles[currentRoleIndex]}
                    initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                    transition={{ duration: 0.5 }}
                    className="inline-block bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent"
                  >
                    {roles[currentRoleIndex]}
                  </motion.span>
                </AnimatePresence>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                I break down complex user experience problems to create integrity-focused, scalable solutions. Winner of the <strong className="text-slate-900 font-bold">National Level Hackathon at AITM College</strong> and Founder of{" "}
                <a
                  href="https://www.learnexia.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  Learnexia ↗
                </a>.
              </p>

              {/* Action Buttons & Socials */}
              <div className="pt-4 flex flex-wrap items-center gap-5">
                <a
                  href="/resume.pdf"
                  download="Anshuman_Das_Resume.pdf"
                  className="shimmer-btn inline-flex items-center gap-3 px-8 py-3.5 rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold text-sm transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95 bg-white"
                >
                  <span>Download CV</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>

                {/* Social Icon Pills with spring scale */}
                <div className="flex items-center gap-3">
                  {[
                    {
                      href: "https://github.com/anshumandas998",
                      label: "GitHub",
                      icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                      )
                    },
                    {
                      href: "https://www.linkedin.com/in/anshuman-das-95846828a/",
                      label: "LinkedIn",
                      icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      )
                    },
                    {
                      href: "https://x.com/AnshumanDa89069",
                      label: "Twitter/X",
                      icon: (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      )
                    }
                  ].map((s) => (
                    <motion.a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-11 h-11 rounded-full border border-slate-200 bg-white flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 shadow-sm hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                      aria-label={s.label}
                    >
                      {s.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Hero Right Avatar Frame with 3D Tilt & Floating Badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 flex justify-center lg:justify-end relative"
            >
              <div className="relative group">
                
                {/* Floating Tech Badges around photo */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -left-6 z-20 px-3.5 py-2 rounded-2xl bg-white/95 border border-blue-200 backdrop-blur-md shadow-xl flex items-center gap-2.5"
                >
                  <span className="text-xl">🏆</span>
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-wider text-blue-600 font-bold">1st Place</p>
                    <p className="text-xs font-bold text-slate-900 leading-tight">AITM Hackathon</p>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-6 -right-4 z-20 px-3.5 py-2 rounded-2xl bg-white/95 border border-blue-200 backdrop-blur-md shadow-xl flex items-center gap-2"
                >
                  <span className="text-xl">🚀</span>
                  <span className="text-xs font-bold text-slate-900">Full-Stack Pro</span>
                </motion.div>

                {/* Blue Neon Aura behind Photo */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-[38px] opacity-35 blur-2xl group-hover:opacity-60 transition duration-500 animate-pulse-glow"></div>

                {/* Angled / Tilted Photo Container */}
                <TiltCard className="relative w-64 h-72 sm:w-80 sm:h-96 rounded-[32px] overflow-hidden border-4 border-white bg-white rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-2xl">
                  <img
                    src="/profile.jpg"
                    alt="Anshuman Das"
                    className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition duration-500 scale-105 group-hover:scale-100"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=800&q=80";
                    }}
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent"></div>
                </TiltCard>
              </div>
            </motion.div>

          </div>

          {/* Stats Bar with Counting Animations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-20 pt-10 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { to: 2, suffix: "+", label: "Years of Experience" },
              { to: 15, suffix: "+", label: "Projects Completed" },
              { to: 1.5, suffix: "K+", label: "Happy Users / Commits" },
              { to: 10, suffix: "+", label: "Technologies Mastered" }
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05 }}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-300"
              >
                <div className="text-4xl sm:text-5xl font-extrabold text-blue-600 tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  <AnimatedCounter from={0} to={stat.to} suffix={stat.suffix} duration={2} />
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ========================================================
            INFINITE SCROLLING MARQUEE EFFECT SECTION
            ======================================================== */}
        <section className="py-10 my-4 relative overflow-hidden bg-gradient-to-r from-blue-50/60 via-white to-blue-50/60 border-y border-blue-100 shadow-sm">
          
          {/* Subtle Ambient Glow Behind Marquee */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.06),transparent_70%)]"></div>

          {/* Marquee Row 1: Key Competencies & Highlights (Left to Right) */}
          <div className="marquee-mask mb-4 overflow-hidden py-1">
            <div className="animate-marquee flex items-center gap-8 text-sm sm:text-base font-extrabold tracking-wider text-slate-800">
              {[...Array(2)].map((_, groupIdx) => (
                <div key={groupIdx} className="flex items-center gap-8 shrink-0">
                  <span className="flex items-center gap-2 text-slate-900">
                    <span className="text-blue-600">✦</span> FULL-STACK ARCHITECTURE
                  </span>
                  <span className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    <span className="text-blue-600">✦</span> GENERATIVE AI & LLMS
                  </span>
                  <span className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                    <span className="text-blue-600">✦</span> AGENTIC AI SYSTEMS
                  </span>
                  <span className="flex items-center gap-2 text-emerald-600">
                    <span className="text-emerald-500">✦</span> AUTOMATED TESTING & QA
                  </span>
                  <span className="flex items-center gap-2 text-amber-600 font-bold">
                    <span className="text-amber-500">🏆</span> NATIONAL HACKATHON WINNER @ AITM
                  </span>
                  <span className="flex items-center gap-2 text-slate-900">
                    <span className="text-blue-600">✦</span> REACT 19 & NEXT.JS
                  </span>
                  <span className="flex items-center gap-2 text-blue-600">
                    <span className="text-blue-600">✦</span> FOUNDER @ LEARNEXIA
                  </span>
                  <span className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
                    <span className="text-blue-600">✦</span> FASTAPI & PYTHON PIPELINES
                  </span>
                  <span className="flex items-center gap-2 text-slate-900">
                    <span className="text-blue-600">✦</span> JAVA & ENTERPRISE BACKENDS
                  </span>
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="text-blue-600">✦</span> UI/UX DESIGN & BRANDING
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Marquee Row 2: Tech Stack Badges (Right to Left) */}
          <div className="marquee-mask overflow-hidden py-1">
            <div className="animate-marquee-reverse flex items-center gap-4 text-xs font-bold text-slate-700">
              {[...Array(2)].map((_, groupIdx) => (
                <div key={groupIdx} className="flex items-center gap-4 shrink-0">
                  {[
                    { label: "Generative AI", icon: "✨", border: "border-blue-200" },
                    { label: "Agentic AI", icon: "🤖", border: "border-indigo-200" },
                    { label: "Testing & QA", icon: "🛡️", border: "border-emerald-200" },
                    { label: "React 19", icon: "⚛️", border: "border-sky-200" },
                    { label: "Python & ML", icon: "🐍", border: "border-blue-200" },
                    { label: "Java Enterprise", icon: "☕", border: "border-orange-200" },
                    { label: "Next.js 15", icon: "▲", border: "border-slate-200" },
                    { label: "Tailwind CSS", icon: "⚡", border: "border-sky-200" },
                    { label: "FastAPI", icon: "🚀", border: "border-teal-200" },
                    { label: "MongoDB", icon: "🍃", border: "border-emerald-200" },
                    { label: "MySQL & SQL", icon: "📊", border: "border-blue-200" },
                    { label: "Figma UI/UX", icon: "🎨", border: "border-indigo-200" },
                    { label: "Docker & Cloud", icon: "🐳", border: "border-blue-200" },
                    { label: "WebSockets", icon: "🔌", border: "border-indigo-200" },
                    { label: "Git & CI/CD", icon: "📦", border: "border-red-200" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border ${item.border} shadow-sm hover:border-blue-500 hover:shadow-md hover:scale-105 transition-all cursor-default`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span className="text-slate-800">{item.label}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* ========================================================
            SERVICES SECTION ("My Quality Services")
            ======================================================== */}
        <section id="services" className="py-24 max-w-7xl mx-auto px-6 sm:px-8 relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
                What I Offer
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mt-3">
                My Quality Services
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-4 leading-relaxed">
                Transforming complex engineering challenges into elegant, highly performant software products that scale.
              </p>
            </motion.div>
          </div>

          {/* Interactive Accordion Cards */}
          <div className="space-y-4 max-w-4xl mx-auto">
            {services.map((srv, index) => {
              const isOpen = activeService === index;
              return (
                <motion.div
                  key={srv.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setActiveService(isOpen ? -1 : index)}
                  className={`cursor-pointer rounded-3xl border transition-all duration-300 p-6 sm:p-8 ${
                    isOpen
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-xl shadow-blue-500/20"
                      : "bg-white border-slate-200/80 hover:border-blue-400 hover:shadow-md text-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 sm:gap-6">
                      <span className={`text-xl sm:text-2xl font-extrabold ${isOpen ? "text-blue-200" : "text-blue-600"}`}>
                        {srv.num}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                        {srv.title}
                      </h3>
                    </div>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center border transition-transform duration-300 ${
                      isOpen ? "border-white/40 bg-white/10 text-white rotate-45" : "border-slate-300 bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                    }`}>
                      +
                    </div>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 pt-4 border-t border-white/20 flex flex-wrap gap-2"
                      >
                        <p className="w-full text-sm sm:text-base text-blue-50 mb-3 leading-relaxed">
                          {srv.desc}
                        </p>
                        {srv.features.map((feat) => (
                          <span
                            key={feat}
                            className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm border border-white/30"
                          >
                            ✓ {feat}
                          </span>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ========================================================
            RECENT WORKS SECTION
            ======================================================== */}
        <section id="works" className="py-24 max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
                Portfolio Showcase
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mt-3">
                My Recent Works
              </h2>
            </motion.div>
            
            {/* Filter Tabs with animated pill layoutId */}
            <div className="mt-8 inline-flex items-center p-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
              {[
                { id: "all", label: "All" },
                { id: "fullstack", label: "Full-Stack" },
                { id: "apps", label: "Apps" },
                { id: "aiml", label: "AI & ML" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setWorkFilter(tab.id)}
                  className="relative px-5 sm:px-7 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-300 focus:outline-none"
                >
                  {workFilter === tab.id && (
                    <motion.div
                      layoutId="activeFilterPill"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                    />
                  )}
                  <span className={`relative z-10 ${workFilter === tab.id ? "text-white" : "text-slate-600 hover:text-blue-600 font-semibold"}`}>
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2x2 Grid of Works */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                onClick={() => setSelectedProject(project)}
                className="group cursor-pointer relative rounded-3xl bg-white border border-slate-200/80 hover:border-blue-500 overflow-hidden transition-all duration-500 hover:shadow-[0_15px_40px_rgba(37,99,235,0.15)] flex flex-col justify-between"
              >
                {/* Project Realtime Photo Preview Box */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100">
                  
                  {/* Realtime UI Photo */}
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover object-top transform group-hover:scale-108 transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />

                  {/* Top Bar inside card */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/95 text-blue-700 border border-blue-200 backdrop-blur-md shadow-md">
                      {project.categoryLabel}
                    </span>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-10 h-10 rounded-full bg-white/95 border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 shadow-md group-hover:scale-110"
                      aria-label="Open Project"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19L19 5M19 5H9M19 5V15" />
                      </svg>
                    </a>
                  </div>

                  {/* Bottom Metric Pill on Image */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-10">
                    <span className="text-[11px] font-bold text-slate-900 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-200 shadow-md">
                      {project.icon} {project.metrics}
                    </span>
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-6 sm:p-8 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>
                    <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      View Details →
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Project Quick View Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
              >
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center border border-slate-200 z-20"
                >
                  ✕
                </button>

                {/* Realtime Image in Modal */}
                <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-slate-200 mb-6 relative">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute bottom-3 left-3 text-3xl bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-md">{selectedProject.icon}</div>
                </div>

                <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {selectedProject.categoryLabel}
                </span>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                  {selectedProject.title}
                </h3>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  {selectedProject.description}
                </p>

                <div className="mt-6 pt-4 border-t border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Technologies Used</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech.map((t) => (
                      <span key={t} className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm hover:scale-105 transition shadow-[0_0_20px_rgba(37,99,235,0.35)]"
                  >
                    Launch Live Project ↗
                  </a>
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-full border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition"
                  >
                    View Source Code
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================
            RESUME & QUALIFICATIONS SECTION
            ======================================================== */}
        <section id="resume" className="py-24 max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
                Career Roadmap
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mt-3">
                Experience & Education
              </h2>
            </motion.div>

            {/* Filter Tabs for Resume */}
            <div className="mt-8 inline-flex items-center p-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
              {[
                { id: "all", label: "All Timeline" },
                { id: "experience", label: "Experience & Awards" },
                { id: "education", label: "Education & Degrees" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveResumeTab(tab.id)}
                  className="relative px-5 sm:px-7 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-300 focus:outline-none"
                >
                  {activeResumeTab === tab.id && (
                    <motion.div
                      layoutId="activeResumePill"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                    />
                  )}
                  <span className={`relative z-10 ${activeResumeTab === tab.id ? "text-white" : "text-slate-600 hover:text-blue-600 font-semibold"}`}>
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2-Column Responsive Timeline */}
          <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
            
            {/* Left Column: Experience */}
            {(activeResumeTab === "all" || activeResumeTab === "experience") && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl text-blue-600">💼</span>
                  <h3 className="text-2xl font-bold text-slate-900">Experience & Highlights</h3>
                </div>

                {experiences.map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                    className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 shadow-sm hover:shadow-md ${
                      exp.type === "award"
                        ? "bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/80 border-blue-300 hover:border-blue-500"
                        : "bg-white border-slate-200/80 hover:border-blue-400"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        exp.type === "award"
                          ? "bg-blue-600 text-white font-extrabold shadow-sm"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}>
                        {exp.period}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">{exp.company}</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-2">
                      {exp.title}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {exp.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Right Column: Education */}
            {(activeResumeTab === "all" || activeResumeTab === "education") && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl text-indigo-600">🎓</span>
                  <h3 className="text-2xl font-bold text-slate-900">Education & Qualifications</h3>
                </div>

                {educations.map((edu, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 hover:border-indigo-400 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {edu.period}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">{edu.company}</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-2">
                      {edu.title}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {edu.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}

          </div>
        </section>

        {/* ========================================================
            SKILLS SECTION ("My Skills")
            ======================================================== */}
        <section id="skills" className="py-24 max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
                Technical Prowess
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mt-3">
                My Skills
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-4 leading-relaxed">
                Core technologies and engineering proficiencies I leverage to build robust, modern digital solutions.
              </p>
            </motion.div>
          </div>

          {/* Grid of Animated Skill Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.05 }}
                className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-500 hover:bg-blue-50/40 transition-all duration-300 shadow-sm hover:shadow-[0_12px_35px_rgba(37,99,235,0.15)]"
              >
                <div className="w-14 h-14 flex items-center justify-center mb-4 transition-transform group-hover:scale-125 duration-300">
                  {skill.icon}
                </div>
                <div className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {skill.percent}
                </div>
                <div className="text-xs font-semibold text-slate-600 mt-1 text-center">
                  {skill.name}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ========================================================
            CLIENT STORIES (TESTIMONIALS)
            ======================================================== */}
        <section id="testimonials" className="py-24 max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
                Endorsements
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mt-3">
                My Client's Stories
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-4 leading-relaxed">
                Empowering teams and students to excel with modern digital platforms and scalable software.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-8 rounded-3xl bg-white border border-slate-200/80 relative flex flex-col justify-between hover:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="text-4xl mb-4 text-blue-600">“</div>
                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic">
                    {t.quote}
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-6 pt-6 border-t border-slate-100">
                  <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-2xl shadow-inner">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-bold text-base">{t.name}</h4>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ========================================================
            BLOG & INSIGHTS SECTION
            ======================================================== */}
        <section id="blog" className="py-24 max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
                Articles & Thoughts
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mt-3">
                Recent Blogs
              </h2>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {blogs.map((b, i) => (
              <motion.article
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 hover:border-blue-500 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-[0_15px_35px_rgba(37,99,235,0.12)] group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">{b.tag}</span>
                    <span>{b.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-3 group-hover:text-blue-600 transition-colors leading-snug">
                    {b.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                    {b.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{b.date}</span>
                  <span className="font-bold text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Read Article →
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* ========================================================
            CONTACT SECTION
            ======================================================== */}
        <section id="contact" className="py-24 max-w-7xl mx-auto px-6 sm:px-8">
          <div className="rounded-[40px] bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/90 border border-blue-200 p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-xl">
            
            {/* Ambient Background Glow in Form Box */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid lg:grid-cols-12 gap-12 relative z-10">
              
              {/* Left Column: Heading & Contact Info */}
              <div className="lg:col-span-5 space-y-8 text-left">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
                    Get In Touch
                  </span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mt-3 leading-tight">
                    Let's work <br />
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">together!</span>
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 mt-4 leading-relaxed">
                    I design and code beautifully simple things and I love what I do. Just simple like that!
                  </p>
                </div>

                {/* Direct Contact Cards */}
                <div className="space-y-4">
                  {[
                    {
                      label: "Phone / WhatsApp",
                      value: "+91 9556699769",
                      href: "tel:+919556699769",
                      icon: (
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      )
                    },
                    {
                      label: "Email Address",
                      value: "anshumand108@gmail.com",
                      href: "mailto:anshumand108@gmail.com",
                      icon: (
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      )
                    },
                    {
                      label: "Location",
                      value: "Odisha, India",
                      href: "#",
                      icon: (
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )
                    }
                  ].map((info) => (
                    <a
                      key={info.label}
                      href={info.href}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-500 hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {info.icon}
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-semibold">{info.label}</p>
                        <p className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {info.value}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Right Column: Web3Forms Contact Form */}
              <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {formStatus.message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-2xl text-sm font-semibold ${
                        formStatus.type === "success"
                          ? "bg-emerald-50 border border-emerald-300 text-emerald-800"
                          : "bg-rose-50 border border-rose-300 text-rose-800"
                      }`}
                    >
                      {formStatus.message}
                    </motion.div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 0000000000"
                        className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Service Needed
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
                    >
                      <option value="Full-Stack Web Development">Full-Stack Web Development</option>
                      <option value="Generative & Agentic AI">Generative & Agentic AI Solutions</option>
                      <option value="Backend & Cloud Architecture">Backend & Cloud Architecture</option>
                      <option value="Automated Testing & QA">Automated Testing & QA</option>
                      <option value="Other Project Inquiry">Other Project Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project, timeline, and goals..."
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm tracking-wide uppercase hover:from-blue-700 hover:to-indigo-700 shadow-[0_0_25px_rgba(37,99,235,0.4)] hover:shadow-[0_0_35px_rgba(37,99,235,0.6)] hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <span className="text-base">🚀</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 bg-white text-slate-600 text-center relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white font-mono">
              AD
            </div>
            <span className="font-bold text-slate-900">Anshuman Das</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-500">
            © {new Date().getFullYear()} Anshuman Das. All rights reserved. Designed & Built with React 19 & Tailwind CSS.
          </p>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <button onClick={() => scrollToSection("home")} className="hover:text-blue-600 transition-colors">Home</button>
            <button onClick={() => scrollToSection("services")} className="hover:text-blue-600 transition-colors">Services</button>
            <button onClick={() => scrollToSection("works")} className="hover:text-blue-600 transition-colors">Works</button>
            <button onClick={() => scrollToSection("contact")} className="hover:text-blue-600 transition-colors">Contact</button>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => scrollToSection("home")}
            className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:shadow-[0_0_30px_rgba(37,99,235,0.8)] hover:scale-110 active:scale-95 transition-all"
            aria-label="Back to top"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
