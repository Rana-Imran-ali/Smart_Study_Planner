import React, { useState, useEffect } from 'react';
import './App.css';

// Predefined Mock Data for Testimonials
const TESTIMONIALS = [
  {
    name: "Alex Rivera",
    role: "Computer Science Major, Stanford",
    quote: "Smart Study Planner completely changed how I manage my semesters. I went from being overwhelmed to scoring straight A's, and I actually have free time on weekends now!",
    rating: 5,
    avatar: "AR"
  },
  {
    name: "Elena Rostova",
    role: "Pre-Med Student, Oxford",
    quote: "The AI-driven schedule builder adapts instantly when my lab hours change. The active recall sessions keep me on track without burnouts. Absolutely essential for students!",
    rating: 5,
    avatar: "ER"
  },
  {
    name: "Marcus K.",
    role: "High School Senior, NY",
    quote: "I used to cram everything the night before. This planner broke down my exam prep into small, achievable steps. Got accepted to my dream college!",
    rating: 5,
    avatar: "MK"
  }
];

// Predefined FAQs
const FAQS = [
  {
    q: "How does the AI smart schedule builder work?",
    a: "Our algorithm takes your exam dates, current syllabi, and daily free hours, then automatically divides the material into optimized study blocks. If you fall behind, it recalculates your path without making you feel guilty."
  },
  {
    q: "Can I sync this with Google Calendar or Apple Calendar?",
    a: "Yes! You can link your calendar accounts with one click. Smart Study Planner imports your classes and events and places study sessions neatly in your available free time."
  },
  {
    q: "What is Active Recall Mode?",
    a: "It is a study technique backed by neuroscience. Instead of just re-reading notes, the planner schedules mock tests, prompt questions, and flashcards at scientifically calculated intervals to maximize retention."
  },
  {
    q: "Is there a mobile app?",
    a: "Yes, our app is fully responsive on mobile web browser, and we also offer iOS and Android companion apps that support offline study, widget tracking, and focus notifications."
  }
];

function App() {
  // Load initial login state from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('ss_isLoggedIn') === 'true';
  });
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem('ss_userEmail') || '';
  });
  
  // Navigation Routing state ('landing' | 'login' | 'register' | 'dashboard')
  const [view, setView] = useState(() => {
    const loggedIn = localStorage.getItem('ss_isLoggedIn') === 'true';
    return loggedIn ? 'dashboard' : 'landing';
  });

  // Dashboard state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [studyStreak, setStudyStreak] = useState(7);
  const [averageFocusScore, setAverageFocusScore] = useState(94);
  const [totalStudyTime, setTotalStudyTime] = useState(18.5);
  const [timerMode, setTimerMode] = useState('study');
  const [ambientSound, setAmbientSound] = useState('none');
  const [taskFilter, setTaskFilter] = useState('all');
  
  // Task search, filter, and sort state
  const [taskSearchQuery, setTaskSearchQuery] = useState('');
  const [taskCategoryFilter, setTaskCategoryFilter] = useState('all');
  const [taskPriorityFilter, setTaskPriorityFilter] = useState('all');
  const [taskSortBy, setTaskSortBy] = useState('dueDate');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  
  // Login form state
  const [isSignUp, setIsSignUp] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Global Theme state
  const [theme, setTheme] = useState('dark');

  // Pomodoro state
  const [pomodoroSeconds, setPomodoroSeconds] = useState(1500); // 25 mins
  const [pomodoroRunning, setPomodoroRunning] = useState(false);

  // Interactive Planner state
  const [subject, setSubject] = useState('Computer Science');
  const [duration, setDuration] = useState('120'); // in minutes
  const [mode, setMode] = useState('active-recall');
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [plannerLoading, setPlannerLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // FAQ Accordion state
  const [activeFaq, setActiveFaq] = useState(null);

  // Calendar state
  const [events, setEvents] = useState([
    { id: 1, title: 'CS Logic Gates Study', date: '2026-07-08', time: '09:00' },
    { id: 2, title: 'Organic Chem Quiz Review', date: '2026-07-10', time: '14:30' },
    { id: 3, title: 'Calculus Homework Due', date: '2026-07-14', time: '23:59' },
    { id: 4, title: 'Literature Essay Writing', date: '2026-07-16', time: '11:00' }
  ]);
  const [selectedDate, setSelectedDate] = useState('2026-07-07');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('09:00');

  // Goals state
  const [goals, setGoals] = useState([
    { id: 1, text: 'Complete CS Logic Gates Prep', progress: 80, category: 'Computer Science' },
    { id: 2, text: 'Study 20 Hours this week', progress: 65, category: 'General' },
    { id: 3, text: 'Finish Chemistry Pathway drawings', progress: 25, category: 'Chemistry' },
    { id: 4, text: 'Draft Literature Critical Review', progress: 0, category: 'Literature' }
  ]);
  const [newGoalText, setNewGoalText] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('General');

  // Notes state
  const [notes, setNotes] = useState([
    { id: 1, title: 'CS Logic Gates Notes', content: 'XOR logic: inputs must be different. NAND and NOR gates are universal gates. Review Boolean algebra proofs before exams.', category: 'Computer Science', date: 'Jul 6, 2026' },
    { id: 2, title: 'Organic Chemistry Pathways', content: 'Esterification: Acid + Alcohol -> Ester + Water. Hydrolysis is reverse. Speed up reaction using acid catalyst (e.g. H2SO4).', category: 'Chemistry', date: 'Jul 5, 2026' }
  ]);
  const [activeNoteId, setActiveNoteId] = useState(1);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState('General');

  // AI Assistant state
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello! I am your AI Study Coach. How can I help you master your classes today? Try asking me how to organize your day or explain a study technique.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Welcome back! You have 3 tasks due today.', time: 'Just now', read: false },
    { id: 2, text: 'Chemistry homework is past due date.', time: '2 hours ago', read: false },
    { id: 3, text: 'Export completed: study session synced to calendar.', time: '3 hours ago', read: true },
    { id: 4, text: 'Daily study streak unlocked: 7 days in a row! 🔥', time: '1 day ago', read: true }
  ]);

  // Profile state
  const [profileName, setProfileName] = useState('Alex Rivera');
  const [profileEmail, setProfileEmail] = useState(() => localStorage.getItem('ss_userEmail') || 'alex@stanford.edu');
  const [profileWeeklyTarget, setProfileWeeklyTarget] = useState('20');
  const [profileStudyMode, setProfileStudyMode] = useState('active-recall');

  // Registration page state
  const [formConfirmPassword, setFormConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  // Task list loaded from localStorage or default
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('ss_tasks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migrate legacy tasks that don't have priority, dueDate, status, description, or estimatedTime
        return parsed.map(t => ({
          ...t,
          priority: t.priority || 'medium',
          dueDate: t.dueDate || new Date().toISOString().split('T')[0],
          status: t.status || (t.done ? 'completed' : 'todo'),
          description: t.description || '',
          estimatedTime: t.estimatedTime || '30'
        }));
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { id: 1, text: "Read Chapter 4 (Logic Gates)", done: true, category: "Computer Science", priority: "high", dueDate: new Date().toISOString().split('T')[0], status: "completed", description: "Read pages 120-145 and take notes on XOR gates.", estimatedTime: "45" },
      { id: 2, text: "Write binary tree code proof", done: false, category: "Computer Science", priority: "high", dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], status: "in_progress", description: "Implement recursive deletion and construct complexity proof.", estimatedTime: "90" },
      { id: 3, text: "Complete 15m review flashcards", done: false, category: "General", priority: "low", dueDate: new Date(Date.now() + 432000000).toISOString().split('T')[0], status: "todo", description: "Test spaced repetition deck on general knowledge.", estimatedTime: "15" },
      { id: 4, text: "Study organic chemistry pathways", done: false, category: "Chemistry", priority: "medium", dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], status: "todo", description: "Draw pathway diagram for esterification and hydrolysis.", estimatedTime: "60" }
    ];
  });

  // Recent activity logs loaded from localStorage or default
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('ss_activities');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { id: 1, text: "Completed a 25-minute Pomodoro study block", time: "2 hours ago", type: "focus" },
      { id: 2, text: "Generated a 2-hour Active Recall plan for Computer Science", time: "3 hours ago", type: "planner" },
      { id: 3, text: "Completed 'Read Chapter 4 (Logic Gates)' task", time: "4 hours ago", type: "task" }
    ];
  });

  // Synchronize theme attribute on body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Synchronize login state with localStorage
  useEffect(() => {
    localStorage.setItem('ss_isLoggedIn', isLoggedIn);
    localStorage.setItem('ss_userEmail', userEmail);
    if (isLoggedIn && view !== 'dashboard') {
      setView('dashboard');
    }
  }, [isLoggedIn, userEmail]);

  // Synchronize tasks with localStorage
  useEffect(() => {
    localStorage.setItem('ss_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Synchronize activities with localStorage
  useEffect(() => {
    localStorage.setItem('ss_activities', JSON.stringify(activities));
  }, [activities]);

  // Pomodoro timer countdown logic
  useEffect(() => {
    let interval = null;
    if (pomodoroRunning && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroSeconds === 0) {
      setPomodoroRunning(false);
      alert(`Great job focusing! Take a short break.`);
      addActivity(`Completed a ${timerMode === 'study' ? '25m Study' : timerMode === 'short' ? '5m Break' : '15m Break'} focus session`, 'focus');
      if (timerMode === 'study') {
        setTotalStudyTime(prev => prev + 0.4); // Add 25 mins = ~0.4 hrs
        setStudyStreak(prev => prev + 1);
      }
      setPomodoroSeconds(timerMode === 'study' ? 1500 : timerMode === 'short' ? 300 : 900);
    }
    return () => clearInterval(interval);
  }, [pomodoroRunning, pomodoroSeconds, timerMode]);

  // Add activity log helper
  const addActivity = (text, type = 'general') => {
    const newAct = {
      id: Date.now(),
      text,
      time: "Just now",
      type
    };
    setActivities(prev => [newAct, ...prev.slice(0, 9)]);
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const newDone = !t.done;
        const newStatus = newDone ? 'completed' : 'todo';
        addActivity(newDone ? `Completed task "${t.text}" 🎉` : `Marked task "${t.text}" as pending`, 'task');
        return { ...t, done: newDone, status: newStatus };
      }
      return t;
    }));
  };

  const cycleTaskStatus = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        let newStatus = 'todo';
        if (t.status === 'todo') newStatus = 'in_progress';
        else if (t.status === 'in_progress') newStatus = 'completed';
        
        const newDone = newStatus === 'completed';
        addActivity(`Updated task "${t.text}" status to ${newStatus === 'in_progress' ? 'In Progress ⏳' : newStatus === 'completed' ? 'Completed 🎉' : 'To Do 📋'}`, 'task');
        return { ...t, status: newStatus, done: newDone };
      }
      return t;
    }));
  };

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Login/SignUp Submit Handler
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    // Validations
    if (isSignUp && !formName.trim()) {
      setFormError('Please enter your name.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (formPassword.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    setAuthLoading(true);

    // Mock API call
    setTimeout(() => {
      setAuthLoading(false);
      setIsLoggedIn(true);
      setUserEmail(formEmail);
      setFormSuccess(isSignUp ? '✨ Account created successfully!' : '🎉 Logged in successfully!');
      
      // Auto redirect to dashboard page after 1s
      setTimeout(() => {
        setView('dashboard');
        // Clear fields
        setFormName('');
        setFormEmail('');
        setFormPassword('');
        setFormSuccess('');
      }, 1200);

    }, 1200);
  };

  // Mock Social Login handler
  const handleSocialLogin = (provider) => {
    setAuthLoading(true);
    setFormError('');
    setTimeout(() => {
      setAuthLoading(false);
      setIsLoggedIn(true);
      setUserEmail(`student.recall@${provider}.edu`);
      setView('dashboard');
    }, 1000);
  };

  // Handle Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    localStorage.removeItem('ss_isLoggedIn');
    localStorage.removeItem('ss_userEmail');
    setView('landing');
  };

  // Password strength scorer (0-5)
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 8)  score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const levels = [
      { label: 'Too Short',    color: '#EF4444' },
      { label: 'Weak',         color: '#F97316' },
      { label: 'Fair',         color: '#F59E0B' },
      { label: 'Good',         color: '#3B82F6' },
      { label: 'Strong',       color: '#10B981' },
      { label: 'Very Strong',  color: '#8B5CF6' },
    ];
    return { score, ...levels[Math.min(score, 5)] };
  };

  // Registration form submit handler
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');

    if (!formName.trim()) {
      setRegisterError('Please enter your full name.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formEmail)) {
      setRegisterError('Please enter a valid email address.');
      return;
    }
    if (formPassword.length < 8) {
      setRegisterError('Password must be at least 8 characters.');
      return;
    }
    if (formPassword !== formConfirmPassword) {
      setRegisterError('Passwords do not match. Please re-enter.');
      return;
    }
    if (!termsAccepted) {
      setRegisterError('Please accept the Terms of Service to continue.');
      return;
    }

    setRegisterLoading(true);
    setTimeout(() => {
      setRegisterLoading(false);
      setIsLoggedIn(true);
      setUserEmail(formEmail);
      setRegisterSuccess('🎉 Account created! Welcome to SmartStudy!');
      setTimeout(() => {
        setView('dashboard');
        setFormName('');
        setFormEmail('');
        setFormPassword('');
        setFormConfirmPassword('');
        setTermsAccepted(false);
        setRegisterSuccess('');
      }, 1400);
    }, 1500);
  };

  // Logic to dynamically generate a customized schedule
  const handleGeneratePlan = (e) => {
    e.preventDefault();
    setPlannerLoading(true);
    setSuccessMsg('');
    
    setTimeout(() => {
      const minsTotal = parseInt(duration, 10);
      let planSteps = [];

      if (mode === 'deep-focus') {
        const studyBlock = minsTotal - 15;
        planSteps = [
          { phase: "Setup", time: "10 mins", title: "Goal Setting & Focus Setup", type: "setup", desc: "Identify 3 crucial subtopics, block browser extensions, and set up your study desk." },
          { phase: "Deep Focus", time: `${studyBlock} mins`, title: `Sustained Study Block on ${subject}`, type: "focus", desc: "Focus strictly on conceptual understanding. Use active summarization. No phone access." },
          { phase: "Review", time: "5 mins", title: "Knowledge Retrieval", type: "review", desc: "Close materials and write a 2-minute summary of everything you just learned from memory." }
        ];
      } else if (mode === 'active-recall') {
        const splitTime = Math.floor((minsTotal - 10) / 2);
        planSteps = [
          { phase: "Concept Kickoff", time: "10 mins", title: `Reviewing Key ${subject} Formulae`, type: "setup", desc: "Refresh memory on main definitions, concepts, or formulas." },
          { phase: "Active Recall", time: `${splitTime} mins`, title: "Self-Testing & Flashcards", type: "recall", desc: "Test yourself with active recall flashcards. Write down answers before flipping the cards." },
          { phase: "Problem Solving", time: `${splitTime} mins`, title: "High-Difficulty Practice Problems", type: "focus", desc: "Solve practice problems. Focus heavily on concepts you got wrong in step 2." }
        ];
      } else if (mode === 'cram-mode') {
        const totalCycles = Math.floor(minsTotal / 30);
        for (let i = 0; i < totalCycles; i++) {
          planSteps.push({
            phase: `Topic ${i + 1}`,
            time: "25 mins",
            title: `Rapid Review: Sub-topic ${i + 1}`,
            type: "focus",
            desc: "Fast-paced reading. Note down keywords. Build instant mental associations."
          });
          if (i < totalCycles - 1) {
            planSteps.push({
              phase: "Power Break",
              time: "5 mins",
              title: "Hydrate & Stretch",
              type: "break",
              desc: "Get up, stretch, drink water. Do not look at social media."
            });
          }
        }
      } else { // spaced-repetition
        const sectionTime = Math.floor(minsTotal / 3);
        planSteps = [
          { phase: "First Review", time: `${sectionTime} mins`, title: `Past Week ${subject} Review`, type: "review", desc: "Go over concepts learned last week. Highlight gaps in your summary sheets." },
          { phase: "Active Recall", time: `${sectionTime} mins`, title: "Blind Writing Practice", type: "recall", desc: "Write everything you remember from today's target topic. Compare with notes to discover blindspots." },
          { phase: "Next Prep", time: `${sectionTime} mins`, title: "Previewing Future Material", type: "setup", desc: "Lightly read headers, intro paragraphs, and charts for next week's lecture to build anchor points." }
        ];
      }

      setGeneratedPlan({
        subject,
        duration: minsTotal,
        modeName: mode === 'deep-focus' ? 'Deep Focus' : mode === 'active-recall' ? 'Active Recall' : mode === 'cram-mode' ? 'Cram Mode' : 'Spaced Repetition',
        steps: planSteps
      });
      setPlannerLoading(false);

      // Scroll smoothly to output
      setTimeout(() => {
        const outputEl = document.getElementById('planner-output');
        if (outputEl) {
          outputEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);

    }, 800); // Simulated delay for premium feel
  };

  const handleExport = () => {
    setSuccessMsg('🎉 Schedule synced directly to your calendar!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // ================= DASHBOARD ACTIONS & HELPER FUNCTIONS =================
  
  const handleQuickAddTask = (e) => {
    e.preventDefault();
    const text = e.target.elements.quickTaskText.value.trim();
    if (!text) return;
    
    const newTask = {
      id: Date.now(),
      text,
      done: false,
      category: "General",
      priority: "medium",
      dueDate: new Date().toISOString().split('T')[0],
      status: "todo",
      description: "",
      estimatedTime: "30"
    };

    setTasks(prev => [...prev, newTask]);
    addActivity(`Created task "${text}"`, 'task');
    e.target.reset();
  };

  const handleAddNewTask = (e) => {
    e.preventDefault();
    const text = e.target.elements.taskText.value.trim();
    const category = e.target.elements.taskCategory.value;
    const priority = e.target.elements.taskPriority.value || 'medium';
    const dueDate = e.target.elements.taskDueDate.value || new Date().toISOString().split('T')[0];
    const description = e.target.elements.taskDescription.value.trim() || '';
    const estimatedTime = e.target.elements.taskEstimatedTime.value || '30';
    if (!text) return;

    const newTask = {
      id: Date.now(),
      text,
      done: false,
      category,
      priority,
      dueDate,
      status: "todo",
      description,
      estimatedTime
    };

    setTasks(prev => [...prev, newTask]);
    addActivity(`Created task "${text}" (${priority} priority) due ${dueDate}`, 'task');
    e.target.reset();
    setIsTaskModalOpen(false);
  };

  const handleDeleteTask = (id, text) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    addActivity(`Deleted task "${text}"`, 'task');
  };

  const handleSwitchTimerMode = (newMode) => {
    setPomodoroRunning(false);
    setTimerMode(newMode);
    if (newMode === 'study') {
      setPomodoroSeconds(1500);
    } else if (newMode === 'short') {
      setPomodoroSeconds(300);
    } else if (newMode === 'long') {
      setPomodoroSeconds(900);
    }
  };

  // ================= DASHBOARD TAB RENDERERS =================

  const renderOverviewTab = () => {
    const completedTasksCount = tasks.filter(t => t.done).length;
    const totalTasksCount = tasks.length;
    const completionRate = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

    const chartData = [
      { day: 'Mon', hours: 2.5 },
      { day: 'Tue', hours: 3.8 },
      { day: 'Wed', hours: 1.2 },
      { day: 'Thu', hours: 4.5 },
      { day: 'Fri', hours: 3.0 },
      { day: 'Sat', hours: 2.0 },
      { day: 'Sun', hours: 1.5 }
    ];

    return (
      <div className="overview-tab-layout">
        {/* STATS GRID */}
        <div className="stats-cards-grid">
          <div className="db-stat-card">
            <div className="stat-card-icon time">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-card-info">
              <h3>{totalStudyTime} hrs</h3>
              <p>Total Study Time</p>
            </div>
            <span className="stat-card-trend positive">+12% this wk</span>
          </div>

          <div className="db-stat-card">
            <div className="stat-card-icon tasks">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="stat-card-info">
              <h3>{completedTasksCount}/{totalTasksCount}</h3>
              <p>Tasks Completed ({completionRate}%)</p>
            </div>
            <span className="stat-card-trend positive">80% efficiency</span>
          </div>

          <div className="db-stat-card">
            <div className="stat-card-icon focus">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="stat-card-info">
              <h3>{averageFocusScore}/100</h3>
              <p>Average Focus Score</p>
            </div>
            <span className="stat-card-trend positive">Top 5% student</span>
          </div>

          <div className="db-stat-card">
            <div className="stat-card-icon mode">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="stat-card-info">
              <h3>{mode === 'active-recall' ? 'Active Recall' : mode === 'deep-focus' ? 'Deep Focus' : mode === 'cram-mode' ? 'Cram Mode' : 'Spaced Repetition'}</h3>
              <p>Current Study Mode</p>
            </div>
            <span className="stat-card-trend text-glow">Optimized</span>
          </div>
        </div>

        {/* MID GRID: WEEKLY GRAPH + QUICK ACTIONS */}
        <div className="overview-mid-grid">
          {/* Progress Chart card */}
          <div className="db-widget chart-widget-card">
            <div className="widget-header">
              <h3>Weekly Progress</h3>
              <span className="widget-subtitle">Study duration (hours)</span>
            </div>
            <div className="chart-bar-container">
              {chartData.map((data, idx) => {
                const heightPercent = `${Math.min((data.hours / 6) * 100, 100)}%`;
                return (
                  <div key={idx} className="chart-bar-column">
                    <div className="chart-bar-hover-val">{data.hours}h</div>
                    <div className="chart-bar-fill-track">
                      <div className="chart-bar-active-fill" style={{ height: heightPercent }}></div>
                    </div>
                    <span className="chart-bar-label">{data.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions card */}
          <div className="db-widget quick-actions-widget">
            <h3>Quick Actions</h3>
            <p>Accelerate your workflow with one click.</p>
            <div className="quick-actions-grid">
              <button className="quick-action-btn focus-action" onClick={() => { setActiveTab('focus'); setPomodoroRunning(true); }}>
                <span className="action-icon">⏱️</span>
                <span>Start Focus Session</span>
              </button>
              <button className="quick-action-btn plan-action" onClick={() => setActiveTab('planner')}>
                <span className="action-icon">🧠</span>
                <span>New AI Plan</span>
              </button>
              <button className="quick-action-btn task-action" onClick={() => setActiveTab('tasks')}>
                <span className="action-icon">📝</span>
                <span>Create Study Task</span>
              </button>
              <button className="quick-action-btn clean-action" onClick={() => setTasks(prev => prev.filter(t => !t.done))}>
                <span className="action-icon">🧹</span>
                <span>Clear Done Tasks</span>
              </button>
            </div>
          </div>
        </div>

        {/* LOWER GRID: RECENT ACTIVITY + UPCOMING TASKS */}
        <div className="overview-lower-grid">
          {/* Recent Activity Log */}
          <div className="db-widget recent-activity-card">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              {activities.length === 0 ? (
                <p className="no-activity">No recent activities logged yet.</p>
              ) : (
                activities.map((act) => (
                  <div key={act.id} className="activity-item">
                    <span className="activity-icon-bullet">
                      {act.type === 'focus' ? '⏱️' : act.type === 'planner' ? '🧠' : act.type === 'task' ? '📝' : '⚡'}
                    </span>
                    <div className="activity-body">
                      <p>{act.text}</p>
                      <span className="activity-time">{act.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming tasks quick widget */}
          <div className="db-widget quick-tasks-card">
            <div className="widget-header">
              <h3>Upcoming Tasks Checklist</h3>
              <button className="btn-text-link" onClick={() => setActiveTab('tasks')}>View all</button>
            </div>
            
            <div className="quick-tasks-list">
              {tasks.filter(t => !t.done).length === 0 ? (
                <div className="all-tasks-completed">
                  <span>🎉</span>
                  <p>All caught up! No pending tasks.</p>
                </div>
              ) : (
                tasks.filter(t => !t.done).slice(0, 3).map((task) => (
                  <div key={task.id} className="quick-task-item" onClick={() => toggleTask(task.id)}>
                    <div className="custom-checkbox">
                      {task.done && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span className="task-text-content">{task.text}</span>
                    {task.category && <span className="task-tag-badge">{task.category}</span>}
                  </div>
                ))
              )}
            </div>

            {/* Quick add input row */}
            <form onSubmit={handleQuickAddTask} className="quick-add-task-form">
              <input 
                type="text" 
                name="quickTaskText"
                placeholder="Quick add: Read organic chem notes..." 
                required
                className="login-input quick-task-input"
              />
              <button type="submit" className="btn-primary-gradient quick-add-btn">+</button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const renderPlannerTab = () => {
    return (
      <div className="planner-tab-layout">
        <div className="planner-intro">
          <h2>AI Study Schedule Generator</h2>
          <p>Optimize your study sessions with custom timelines generated using neuroscience-backed learning slots.</p>
        </div>
        <div className="demo-widget-layout">
          {/* Re-use form card */}
          <div className="demo-form-card">
            <h3>Configure Your Session</h3>
            <form onSubmit={(e) => {
              handleGeneratePlan(e);
              addActivity(`Generated a ${duration} min ${mode} plan for ${subject}`, 'planner');
            }}>
              <div className="form-group">
                <label htmlFor="subject-select">Subject Category</label>
                <select 
                  id="subject-select" 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)}
                >
                  <option value="Computer Science">Computer Science & Algorithms</option>
                  <option value="Organic Chemistry">Organic Chemistry & Bio</option>
                  <option value="World History">World History & Humanities</option>
                  <option value="Calculus & Algebra">Calculus & Algebra</option>
                  <option value="Literature & Essay">Literature & Critical Essay</option>
                </select>
              </div>

              <div className="form-group">
                <label>Session Duration</label>
                <div className="radio-button-group">
                  {[
                    { label: "1 Hour", val: "60" },
                    { label: "2 Hours", val: "120" },
                    { label: "3 Hours", val: "180" },
                    { label: "4 Hours", val: "244" }
                  ].map((d) => (
                    <button
                      key={d.val}
                      type="button"
                      className={`btn-radio ${duration === d.val ? 'active' : ''}`}
                      onClick={() => setDuration(d.val)}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="study-mode">Study Mode / Focus Technique</label>
                <select 
                  id="study-mode" 
                  value={mode} 
                  onChange={(e) => setMode(e.target.value)}
                >
                  <option value="active-recall">🧠 Active Recall (Self-Testing Focus)</option>
                  <option value="deep-focus">🎯 Deep Focus (Long Content Exploration)</option>
                  <option value="cram-mode">⚡ Cram Mode (Rapid Topics Intake)</option>
                  <option value="spaced-repetition">🔄 Spaced Repetition (Prior Review)</option>
                </select>
              </div>

              <button type="submit" className="btn-generate-planner" disabled={plannerLoading}>
                {plannerLoading ? (
                  <span className="spinner"></span>
                ) : (
                  <span>Calculate Custom Schedule ⚡</span>
                )}
              </button>
            </form>
          </div>

          {/* Re-use results card */}
          <div className="demo-results-card" id="planner-output">
            {!generatedPlan && !plannerLoading && (
              <div className="planner-empty-state">
                <div className="icon-sphere">
                  <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <h3>Your AI Plan Will Render Here</h3>
                <p>Set duration and technique parameters, click calculate, and watch your optimized session load instantly.</p>
              </div>
            )}

            {plannerLoading && (
              <div className="planner-loading-state">
                <div className="pulsing-brain">🧠</div>
                <h3>Structuring Session Schedule...</h3>
                <p>Applying neuroscience-backed time splits and active rest cycles.</p>
              </div>
            )}

            {generatedPlan && !plannerLoading && (
              <div className="planner-plan-content">
                <div className="plan-header">
                  <div>
                    <span className="plan-badge">{generatedPlan.modeName}</span>
                    <h4>{generatedPlan.subject} Session</h4>
                  </div>
                  <span className="plan-duration-total">⏰ {generatedPlan.duration} Mins</span>
                </div>

                <div className="timeline-container">
                  {generatedPlan.steps.map((step, idx) => (
                    <div key={idx} className="timeline-item">
                      <div className={`timeline-indicator ${step.type}`}>
                        <span>{idx + 1}</span>
                      </div>
                      <div className="timeline-content-card">
                        <div className="timeline-meta">
                          <span className="timeline-phase">{step.phase}</span>
                          <span className="timeline-duration">{step.time}</span>
                        </div>
                        <h5>{step.title}</h5>
                        <p>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="plan-actions">
                  <button className="btn-export-plan" onClick={handleExport}>
                    Export Schedule to Device
                  </button>
                  {successMsg && <div className="success-toast">{successMsg}</div>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderFocusTab = () => {
    const maxSecs = timerMode === 'study' ? 1500 : timerMode === 'short' ? 300 : 900;
    const strokeDashoffset = maxSecs > 0 ? (pomodoroSeconds / maxSecs) * 628 : 628;

    return (
      <div className="focus-tab-layout">
        <div className="focus-header">
          <h2>Advanced Focus Room</h2>
          <p>Boost your memory and enter flow state. Choose a time slot and play backing ambient audio.</p>
        </div>

        <div className="focus-panel-grid">
          {/* Main Timer Display */}
          <div className="focus-timer-card">
            <div className="timer-presets">
              <button 
                className={`preset-btn ${timerMode === 'study' ? 'active' : ''}`}
                onClick={() => handleSwitchTimerMode('study')}
              >
                🎯 Study (25m)
              </button>
              <button 
                className={`preset-btn ${timerMode === 'short' ? 'active' : ''}`}
                onClick={() => handleSwitchTimerMode('short')}
              >
                ☕ Short Break (5m)
              </button>
              <button 
                className={`preset-btn ${timerMode === 'long' ? 'active' : ''}`}
                onClick={() => handleSwitchTimerMode('long')}
              >
                🌴 Long Break (15m)
              </button>
            </div>

            <div className="timer-radial-outer">
              <svg width="240" height="240" viewBox="0 0 240 240" className="timer-radial-svg">
                {/* Track Circle */}
                <circle 
                  cx="120" 
                  cy="120" 
                  r="100" 
                  className="radial-track"
                />
                {/* Active Indicator Circle */}
                <circle 
                  cx="120" 
                  cy="120" 
                  r="100" 
                  className="radial-indicator"
                  strokeDasharray="628"
                  strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90 120 120)"
                />
              </svg>
              {/* Inner details centered absolutely */}
              <div className="timer-inner-content">
                <span className="timer-inner-mode">
                  {timerMode === 'study' ? '🎯 Study Session' : timerMode === 'short' ? '☕ Short Break' : '🌴 Long Break'}
                </span>
                <span className="timer-inner-value">{formatTime(pomodoroSeconds)}</span>
                <span className="timer-inner-desc">
                  {pomodoroRunning ? 'Timer ticking...' : 'Paused'}
                </span>
              </div>
            </div>

            <div className="timer-actions">
              <button 
                className={`btn-timer-action ${pomodoroRunning ? 'running' : ''}`}
                onClick={() => {
                  setPomodoroRunning(!pomodoroRunning);
                  addActivity(pomodoroRunning ? "Paused the focus timer" : "Started the focus timer", 'focus');
                }}
              >
                {pomodoroRunning ? 'Pause Session' : 'Start Focus ⚡'}
              </button>
              <button 
                className="btn-timer-reset" 
                onClick={() => {
                  setPomodoroSeconds(maxSecs);
                  setPomodoroRunning(false);
                  addActivity("Reset the focus timer", 'focus');
                }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Sound & Motivation Side Widgets */}
          <div className="focus-settings-column">
            <div className="db-widget sound-settings-card">
              <h3>Ambient Audio Atmosphere</h3>
              <p>Tune out distractions with neuroscience-engineered background loops.</p>
              
              <div className="form-group">
                <label htmlFor="sound-select">Sound Profile</label>
                <select 
                  id="sound-select"
                  value={ambientSound}
                  onChange={(e) => {
                    setAmbientSound(e.target.value);
                    addActivity(`Changed focus environment sound to ${e.target.value}`, 'focus');
                  }}
                  className="sound-dropdown"
                >
                  <option value="none">🔇 Silent Focus</option>
                  <option value="white-noise">🌫️ Pure White Noise</option>
                  <option value="rain">🌧️ Autumn Rainfall</option>
                  <option value="lofi">🎧 Study Lofi Beats</option>
                </select>
              </div>

              {ambientSound !== 'none' && (
                <div className="audio-wave-visualizer">
                  <span className="status-label">Now playing loop: {ambientSound}</span>
                  <div className="waves">
                    <span className="wave-bar active"></span>
                    <span className="wave-bar active"></span>
                    <span className="wave-bar active"></span>
                    <span className="wave-bar active"></span>
                    <span className="wave-bar active"></span>
                  </div>
                </div>
              )}
            </div>

            <div className="db-widget focus-motivation-card">
              <h3>Focus Guidelines</h3>
              <ul className="focus-tips-list">
                <li><strong>No Phones:</strong> Place your device face down in another room.</li>
                <li><strong>Single Tasking:</strong> Close other tabs. Keep only materials for {subject} open.</li>
                <li><strong>Breathe:</strong> Take deep diaphragmatic breaths during short break cycles.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTasksTab = () => {
    // Helper to calculate due date labels and classes
    const getDueDateInfo = (dateStr) => {
      if (!dateStr) return { text: 'No Due Date', type: 'none' };
      const todayStr = new Date().toISOString().split('T')[0];
      if (dateStr === todayStr) {
        return { text: '📅 Today', type: 'today' };
      }
      const today = new Date(todayStr);
      const due = new Date(dateStr);
      const diffTime = due.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) {
        return { text: `⚠️ Overdue (${Math.abs(diffDays)}d)`, type: 'overdue' };
      } else if (diffDays === 1) {
        return { text: '📅 Tomorrow', type: 'tomorrow' };
      } else {
        return { text: `📅 in ${diffDays} days`, type: 'upcoming' };
      }
    };

    // Filter tasks based on UI selections
    let filteredTasks = tasks.filter(t => {
      // 1. Status Filter (tabs)
      if (taskFilter === 'active' && t.done) return false;
      if (taskFilter === 'completed' && !t.done) return false;

      // 2. Category Filter (select dropdown)
      if (taskCategoryFilter !== 'all' && t.category !== taskCategoryFilter) return false;

      // 3. Priority Filter (select dropdown)
      if (taskPriorityFilter !== 'all' && t.priority !== taskPriorityFilter) return false;

      // 4. Search Query (text input)
      if (taskSearchQuery.trim() !== '') {
        const query = taskSearchQuery.toLowerCase();
        const matchesText = t.text.toLowerCase().includes(query);
        const matchesCategory = t.category.toLowerCase().includes(query);
        if (!matchesText && !matchesCategory) return false;
      }

      return true;
    });

    // Sort tasks
    filteredTasks.sort((a, b) => {
      if (taskSortBy === 'dueDate') {
        const dateA = a.dueDate || '9999-12-31';
        const dateB = b.dueDate || '9999-12-31';
        return dateA.localeCompare(dateB);
      }
      if (taskSortBy === 'priority') {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        const weightA = priorityWeight[a.priority] || 2;
        const weightB = priorityWeight[b.priority] || 2;
        return weightB - weightA; // High priority first
      }
      if (taskSortBy === 'text') {
        return a.text.localeCompare(b.text);
      }
      return 0;
    });

    // Counts for stats panel
    const totalCount = tasks.length;
    const completedCount = tasks.filter(t => t.done).length;
    const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
    const pendingCount = tasks.filter(t => t.status === 'todo').length;

    return (
      <div className="tasks-tab-layout">
        <div className="tasks-header-row">
          <div>
            <h2>Task Manager Workspace</h2>
            <p>Structure your syllabus into manageable study goals. Check completed blocks to boost metrics.</p>
          </div>
          <div className="header-actions-group">
            <button 
              type="button" 
              onClick={() => setIsTaskModalOpen(true)} 
              className="btn-primary-gradient btn-add-task-modal-trigger"
            >
              ✨ Add Milestone
            </button>
            <div className="task-filters">
              <button 
                className={`filter-tab ${taskFilter === 'all' ? 'active' : ''}`}
                onClick={() => setTaskFilter('all')}
              >
                All ({tasks.length})
              </button>
              <button 
                className={`filter-tab ${taskFilter === 'active' ? 'active' : ''}`}
                onClick={() => setTaskFilter('active')}
              >
                Active ({tasks.filter(t => !t.done).length})
              </button>
              <button 
                className={`filter-tab ${taskFilter === 'completed' ? 'active' : ''}`}
                onClick={() => setTaskFilter('completed')}
              >
                Completed ({tasks.filter(t => t.done).length})
              </button>
            </div>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="task-stats-row">
          <div className="task-stat-card total">
            <div className="stat-card-glow"></div>
            <span className="stat-value">{totalCount}</span>
            <span className="stat-label">Total Goals</span>
          </div>
          <div className="task-stat-card todo">
            <div className="stat-card-glow"></div>
            <span className="stat-value">{pendingCount}</span>
            <span className="stat-label">To Do</span>
          </div>
          <div className="task-stat-card progress">
            <div className="stat-card-glow"></div>
            <span className="stat-value">{inProgressCount}</span>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="task-stat-card completed">
            <div className="stat-card-glow"></div>
            <span className="stat-value">{completedCount}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        {/* SEARCH AND FILTERS BAR */}
        <div className="task-toolbar">
          <div className="task-toolbar-left">
            <div className="search-bar-container">
              <svg className="search-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search study goals..." 
                value={taskSearchQuery}
                onChange={(e) => setTaskSearchQuery(e.target.value)}
                className="task-search-input"
              />
              {taskSearchQuery && (
                <button type="button" onClick={() => setTaskSearchQuery('')} className="clear-search-btn" title="Clear Search">×</button>
              )}
            </div>

            <div className="toolbar-selects">
              <select 
                value={taskCategoryFilter} 
                onChange={(e) => setTaskCategoryFilter(e.target.value)}
                className="toolbar-select"
              >
                <option value="all">📚 All Subjects</option>
                <option value="Computer Science">💻 Computer Science</option>
                <option value="Chemistry">🧪 Chemistry</option>
                <option value="Mathematics">🧮 Mathematics</option>
                <option value="Literature">📚 Literature</option>
                <option value="General">✨ General/Other</option>
              </select>

              <select 
                value={taskPriorityFilter} 
                onChange={(e) => setTaskPriorityFilter(e.target.value)}
                className="toolbar-select"
              >
                <option value="all">⚡ All Priorities</option>
                <option value="high">🔴 High Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="low">🟢 Low Priority</option>
              </select>
            </div>
          </div>

          <div className="task-toolbar-right">
            <div className="sort-group">
              <span className="sort-label-text">Sort By:</span>
              <select 
                value={taskSortBy} 
                onChange={(e) => setTaskSortBy(e.target.value)}
                className="toolbar-select sort-select"
              >
                <option value="dueDate">📅 Due Date</option>
                <option value="priority">🔥 Priority</option>
                <option value="text">🔤 Alphabetical</option>
              </select>
            </div>
          </div>
        </div>

        <div className="tasks-workspace-grid">
          {/* List display */}
          <div className="tasks-list-panel">
            {filteredTasks.length === 0 ? (
              <div className="tasks-empty-state">
                <span>🔍</span>
                <h4>No Tasks Found</h4>
                <p>Try refining your search query or subject/priority filters.</p>
              </div>
            ) : (
              <div className="task-items-container">
                {filteredTasks.map((task) => {
                  const dueDateInfo = getDueDateInfo(task.dueDate);
                  return (
                    <div key={task.id} className={`workspace-task-item ${task.done ? 'done' : ''} priority-${task.priority}`}>
                      <div className="task-click-area" onClick={() => toggleTask(task.id)}>
                        <div className={`custom-checkbox status-${task.status}`}>
                          {task.done && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                          {!task.done && task.status === 'in_progress' && (
                            <div className="checkbox-in-progress-dot"></div>
                          )}
                        </div>
                        <div className="task-item-body">
                          <span className="task-label-text">{task.text}</span>
                          {task.description && (
                            <p className="task-desc-text">{task.description}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="task-right-meta">
                        {/* Estimated study time tag */}
                        {task.estimatedTime && (
                          <span className="task-time-badge" title="Estimated Study Time">
                            ⏱️ {task.estimatedTime}m
                          </span>
                        )}

                        {/* Due Date urgency badge */}
                        <span className={`task-date-badge date-${dueDateInfo.type}`}>
                          {dueDateInfo.text}
                        </span>

                        {/* Subject Category tag */}
                        <span className="task-category-tag">{task.category}</span>

                        {/* Priority badge */}
                        <span className={`task-priority-badge priority-${task.priority}`}>
                          {task.priority.toUpperCase()}
                        </span>

                        {/* Status Toggle Cycle */}
                        <button 
                          type="button"
                          className={`task-status-badge status-${task.status}`}
                          onClick={(e) => {
                            e.stopPropagation(); // Avoid double toggling via click area
                            cycleTaskStatus(task.id);
                          }}
                          title="Click to cycle status (To Do -> In Progress -> Completed)"
                        >
                          {task.status === 'completed' && '✅ Completed'}
                          {task.status === 'in_progress' && '⏳ In Progress'}
                          {task.status === 'todo' && '📋 To Do'}
                        </button>

                        <button 
                          className="delete-task-btn" 
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent toggling when clicking delete
                            handleDeleteTask(task.id, task.text);
                          }}
                          aria-label="Delete task"
                        >
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Guidelines sidebar card */}
          <div className="db-widget task-guidelines-card">
            <h3>Milestone Guidelines</h3>
            <p>Maintain your study streak by managing daily milestones effectively.</p>
            
            <div className="guidelines-content">
              <div className="guideline-tip">
                <span className="tip-icon">🎯</span>
                <div className="tip-details">
                  <strong>Deconstruct Goals</strong>
                  <span>Break complex subjects into small, 30-to-90 minute conceptual blocks.</span>
                </div>
              </div>

              <div className="guideline-tip">
                <span className="tip-icon">⚡</span>
                <div className="tip-details">
                  <strong>Status Tracking</strong>
                  <span>Update tasks to 'In Progress' to log active recall focus time in metrics.</span>
                </div>
              </div>

              <div className="guideline-tip">
                <span className="tip-icon">📅</span>
                <div className="tip-details">
                  <strong>Deadline Focus</strong>
                  <span>Sort by Due Date to highlight overdue or immediate goals.</span>
                </div>
              </div>
            </div>

            <button 
              type="button" 
              onClick={() => setIsTaskModalOpen(true)}
              className="btn-primary-gradient btn-add-milestone-sidebar"
            >
              ⚡ Open Modal Creator
            </button>
          </div>
        </div>

        {/* TASK CREATION MODAL OVERLAY */}
        {isTaskModalOpen && (
          <div className="task-modal-overlay" onClick={() => setIsTaskModalOpen(false)}>
            <div className="task-modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>✨ Create Study Milestone</h3>
                <button type="button" className="modal-close-btn" onClick={() => setIsTaskModalOpen(false)}>×</button>
              </div>

              <form onSubmit={handleAddNewTask} className="modal-task-form">
                <div className="modal-form-grid">
                  {/* Left Column */}
                  <div className="modal-form-left">
                    <div className="form-group">
                      <label htmlFor="modal-task-text">Objective / Title</label>
                      <input 
                        type="text" 
                        id="modal-task-text"
                        name="taskText"
                        placeholder="e.g. Read Physics Chapter 3 notes" 
                        required
                        className="login-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="modal-task-desc">Detailed Description</label>
                      <textarea 
                        id="modal-task-desc"
                        name="taskDescription"
                        placeholder="Detail specific subtopics, reference pages, active recall prompts..." 
                        rows="4"
                        className="login-input textarea-input"
                      ></textarea>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="modal-form-right">
                    <div className="form-group">
                      <label htmlFor="modal-task-category">Subject Category</label>
                      <select id="modal-task-category" name="taskCategory" className="task-tag-select">
                        <option value="Computer Science">💻 Computer Science</option>
                        <option value="Chemistry">🧪 Chemistry</option>
                        <option value="Mathematics">🧮 Mathematics</option>
                        <option value="Literature">📚 Literature</option>
                        <option value="General">✨ General/Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="modal-task-priority">Priority Level</label>
                      <select id="modal-task-priority" name="taskPriority" className="task-tag-select">
                        <option value="low">🟢 Low Priority</option>
                        <option value="medium" defaultValue>🟡 Medium Priority</option>
                        <option value="high">🔴 High Priority</option>
                      </select>
                    </div>

                    <div className="form-group-row">
                      <div className="form-group">
                        <label htmlFor="modal-task-duedate">Deadline (Due Date)</label>
                        <input 
                          type="date" 
                          id="modal-task-duedate"
                          name="taskDueDate"
                          defaultValue={new Date().toISOString().split('T')[0]}
                          required
                          className="login-input"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="modal-task-time">Estimated Time (mins)</label>
                        <input 
                          type="number" 
                          id="modal-task-time"
                          name="taskEstimatedTime"
                          placeholder="e.g. 45"
                          min="1"
                          max="480"
                          defaultValue="30"
                          required
                          className="login-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary-outline btn-cancel" onClick={() => setIsTaskModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary-gradient btn-save">
                    Save Milestone ⚡
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAnalyticsTab = () => {
    const courses = [
      { name: "Computer Science & Algorithms", progress: 85, color: "#8B5CF6" },
      { name: "Organic Chemistry & Biology", progress: 62, color: "#EC4899" },
      { name: "Calculus & Algebra", progress: 78, color: "#3B82F6" },
      { name: "Literature & Essay", progress: 90, color: "#06B6D4" }
    ];

    return (
      <div className="analytics-tab-layout">
        <div className="analytics-header">
          <h2>Academic Analytics & Readiness</h2>
          <p>Inspect estimates of your course prep status based on focus hours and completed task ratios.</p>
        </div>

        <div className="analytics-dashboard-grid">
          {/* Course Readiness Card */}
          <div className="db-widget course-progress-card">
            <h3>Course Preparation Scores</h3>
            <p>Calculated from study milestones checked off and active recall scores.</p>
            
            <div className="course-progress-list">
              {courses.map((course, idx) => (
                <div key={idx} className="course-progress-item">
                  <div className="course-meta-row">
                    <span className="course-name">{course.name}</span>
                    <span className="course-score-val" style={{ color: course.color }}>{course.progress}% ready</span>
                  </div>
                  <div className="course-progress-track">
                    <div 
                      className="course-progress-fill" 
                      style={{ width: `${course.progress}%`, background: course.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Efficiency Breakdown Panel */}
          <div className="analytics-side-panel">
            <div className="db-widget stats-breakdown-card">
              <h3>Syllabus Insights</h3>
              <div className="insights-metrics">
                <div className="metric-box">
                  <span className="metric-num">89%</span>
                  <span className="metric-lbl">Active Recall Accuracy</span>
                </div>
                <div className="metric-box">
                  <span className="metric-num">1.8 hrs</span>
                  <span className="metric-lbl">Avg Daily Study block</span>
                </div>
              </div>
              <div className="insight-recommendation-note">
                <span className="recommendation-icon">💡</span>
                <p><strong>Recommendation:</strong> Your Chemistry focus score is lower than other categories. Schedule a 45-minute Cram Mode block to review basic chemical structures.</p>
              </div>
            </div>

            <div className="db-widget study-milestone-banner">
              <h3>Academic Rank</h3>
              <div className="rank-badge-row">
                <span className="rank-badge">🏆 Master Planner</span>
                <span className="rank-percentage">Top 5% this month</span>
              </div>
              <p>Keep up your current study pace to reach Grandmaster tier in Spaced Repetition!</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ================= MAIN RENDER ROUTING =================

  if (isLoggedIn && view === 'dashboard') {
    const completedTasksCount = tasks.filter(t => t.done).length;
    const totalTasksCount = tasks.length;
    const completionRate = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

    return (
      <div className="dashboard-container">
        {/* SIDEBAR NAVIGATION */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-brand" onClick={() => setActiveTab('dashboard')}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="6" fill="url(#dbLogoGrad)" />
              <path d="M7 11.5L10 14.5L17 7.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="dbLogoGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#8B5CF6"/>
                  <stop offset="1" stopColor="#EC4899"/>
                </linearGradient>
              </defs>
            </svg>
            <span className="sidebar-logo-text">SmartStudy</span>
          </div>

          <div className="sidebar-user-card">
            <div className="sidebar-avatar">
              {userEmail.substring(0, 2).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <span className="user-email" title={userEmail}>{userEmail}</span>
              <span className="user-tier">Smart Scholar Pro</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            <button 
              className={`sidebar-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <svg className="nav-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
              <span>Dashboard</span>
            </button>

            <button 
              className={`sidebar-nav-btn ${activeTab === 'planner' ? 'active' : ''}`}
              onClick={() => setActiveTab('planner')}
            >
              <svg className="nav-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Study Planner</span>
            </button>

            <button 
              className={`sidebar-nav-btn ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => setActiveTab('tasks')}
            >
              <svg className="nav-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Tasks</span>
              {tasks.filter(t => !t.done).length > 0 && (
                <span className="sidebar-badge">{tasks.filter(t => !t.done).length}</span>
              )}
            </button>

            <button 
              className={`sidebar-nav-btn ${activeTab === 'calendar' ? 'active' : ''}`}
              onClick={() => setActiveTab('calendar')}
            >
              <svg className="nav-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Calendar</span>
            </button>

            <button 
              className={`sidebar-nav-btn ${activeTab === 'goals' ? 'active' : ''}`}
              onClick={() => setActiveTab('goals')}
            >
              <svg className="nav-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Goals</span>
            </button>

            <button 
              className={`sidebar-nav-btn ${activeTab === 'notes' ? 'active' : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              <svg className="nav-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Notes</span>
            </button>

            <button 
              className={`sidebar-nav-btn ${activeTab === 'ai-assistant' ? 'active' : ''}`}
              onClick={() => setActiveTab('ai-assistant')}
            >
              <svg className="nav-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>AI Assistant</span>
            </button>

            <button 
              className={`sidebar-nav-btn ${activeTab === 'progress' ? 'active' : ''}`}
              onClick={() => setActiveTab('progress')}
            >
              <svg className="nav-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Progress</span>
            </button>

            <button 
              className={`sidebar-nav-btn ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <svg className="nav-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span>Notifications</span>
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="sidebar-badge">{notifications.filter(n => !n.read).length}</span>
              )}
            </button>

            <button 
              className={`sidebar-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <svg className="nav-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Profile</span>
            </button>
          </nav>

          <div className="sidebar-footer">
            <button className="sidebar-theme-btn" onClick={handleToggleTheme}>
              {theme === 'dark' ? (
                <>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            <button className="sidebar-logout-btn" onClick={handleLogout}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="dashboard-main-content">
          {/* Header bar */}
          <header className="dashboard-header-bar">
            <div className="header-greeting">
              <h1>Welcome back! 👋</h1>
              <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="header-actions">
              <span className="streak-badge-container" title="Daily study streak">
                <span className="fire-emoji">🔥</span>
                <span className="streak-count">{studyStreak} Day Streak</span>
              </span>
              <button className="btn-primary-gradient btn-quick-plan" onClick={() => setActiveTab('planner')}>
                ⚡ Quick Plan
              </button>
            </div>
          </header>

          {/* ACTIVE TAB CONTENT */}
          <div className="dashboard-tab-content">
            {activeTab === 'dashboard' && renderOverviewTab()}
            {activeTab === 'planner' && renderPlannerTab()}
            {activeTab === 'tasks' && renderTasksTab()}
            {activeTab === 'calendar' && <CalendarTab events={events} setEvents={setEvents} addActivity={addActivity} />}
            {activeTab === 'goals' && <GoalsTab goals={goals} setGoals={setGoals} addActivity={addActivity} />}
            {activeTab === 'notes' && <NotesTab notes={notes} setNotes={setNotes} activeNoteId={activeNoteId} setActiveNoteId={setActiveNoteId} addActivity={addActivity} />}
            {activeTab === 'ai-assistant' && <AiAssistantTab />}
            {activeTab === 'progress' && renderAnalyticsTab()}
            {activeTab === 'notifications' && <NotificationsTab notifications={notifications} setNotifications={setNotifications} />}
            {activeTab === 'profile' && <ProfileTab userEmail={userEmail} setUserEmail={setUserEmail} addActivity={addActivity} />}
          </div>
        </main>
      </div>
    );
  }

  // ================= RENDER PUBLIC VIEWS =================

  const renderLandingPage = () => (
    <>
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
        <div className="container hero-inner">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-pulse"></span>
              <span>✨ AI-Powered Study Assistant v2.5</span>
            </div>
            <h1 className="hero-title">
              Master Your Studies. <br />
              <span className="gradient-text">Boost Your Grades.</span> <br />
              Manage Your Time.
            </h1>
            <p className="hero-subtitle">
              Stop cramming blindly. Get personalized, neuroscience-backed study plans, interactive Pomodoro tools, and predictive grade analytics built for today's high-achieving students.
            </p>
            <div className="hero-ctas">
              <button className="btn-primary-gradient" onClick={() => { setView('register'); setIsSignUp(true); }}>
                Start Planning Free
              </button>
              <span className="btn-secondary-outline" style={{cursor:'pointer'}} onClick={() => setView('features')}>See How It Works</span>
            </div>
            <div className="hero-social-proof">
              <div className="avatars-group">
                <span className="avatar-mini bg-red"></span>
                <span className="avatar-mini bg-blue"></span>
                <span className="avatar-mini bg-purple"></span>
                <span className="avatar-mini bg-green"></span>
              </div>
              <p>Loved by <strong>50,000+</strong> students at Stanford, MIT, Oxford &amp; Harvard</p>
            </div>
          </div>

          <div className="hero-visual">
            <div className="mock-dashboard">
              <div className="dashboard-header">
                <div className="dots-group">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <div className="dashboard-title">Today&apos;s Focus Dashboard</div>
                <div className="dashboard-status">Online</div>
              </div>
              <div className="dashboard-grid">
                <div className="widget timer-widget">
                  <h3>Focus Sessions</h3>
                  <div className="timer-circle-container">
                    <div className="timer-value">{formatTime(pomodoroSeconds)}</div>
                    <div className="timer-label">Pomodoro Interval</div>
                  </div>
                  <div className="timer-controls">
                    <button className={`btn-timer-action ${pomodoroRunning ? 'running' : ''}`} onClick={() => setPomodoroRunning(!pomodoroRunning)}>
                      {pomodoroRunning ? 'Pause' : 'Start Focus'}
                    </button>
                    <button className="btn-timer-reset" onClick={() => { setPomodoroSeconds(1500); setPomodoroRunning(false); }}>Reset</button>
                  </div>
                </div>
                <div className="widget checklist-widget">
                  <h3>Daily Checklist</h3>
                  <div className="task-list">
                    {tasks.map((task) => (
                      <div key={task.id} className={`task-item ${task.done ? 'checked' : ''}`} onClick={() => toggleTask(task.id)}>
                        <div className="custom-checkbox">
                          {task.done && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                        <span className="task-text">{task.text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-info">
                      <span>Daily Completion</span>
                      <span>{Math.round((tasks.filter(t => t.done).length / tasks.length) * 100)}%</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${(tasks.filter(t => t.done).length / tasks.length) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="widget analytics-widget">
                <div className="analytics-meta">
                  <div><h4>Syllabus Covered</h4><span className="analytics-num">78%</span></div>
                  <div><h4>Focus Score</h4><span className="analytics-num glow-txt">94/100</span></div>
                  <div><h4>Active Recall Streak</h4><span className="analytics-num">12 Days</span></div>
                </div>
                <div className="mock-graph">
                  <div className="graph-bar" style={{ height: '40%' }}><span>Mon</span></div>
                  <div className="graph-bar" style={{ height: '65%' }}><span>Tue</span></div>
                  <div className="graph-bar" style={{ height: '55%' }}><span>Wed</span></div>
                  <div className="graph-bar highlight" style={{ height: '85%' }}><span>Thu</span></div>
                  <div className="graph-bar" style={{ height: '70%' }}><span>Fri</span></div>
                  <div className="graph-bar" style={{ height: '95%' }}><span>Sat</span></div>
                  <div className="graph-bar" style={{ height: '60%' }}><span>Sun</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-number">45%</div><div className="stat-title">Study Efficiency Boost</div><p className="stat-desc">Students complete syllabus blocks in nearly half the average time.</p></div>
            <div className="stat-card"><div className="stat-number">12 hrs</div><div className="stat-title">Time Saved Weekly</div><p className="stat-desc">AI scheduling eliminates manual calendar setup automatically.</p></div>
            <div className="stat-card"><div className="stat-number">92%</div><div className="stat-title">Goal Completion Rate</div><p className="stat-desc">Gamified task streaks keep students accountable all semester.</p></div>
            <div className="stat-card"><div className="stat-number">4.9/5</div><div className="stat-title">Student Satisfaction</div><p className="stat-desc">Highly rated across Trustpilot and App Store for design &amp; accessibility.</p></div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE DEMO PLANNER */}
      <section id="demo" className="demo-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Try It Live</div>
            <h2>Generate Your Smart Study Session</h2>
            <p>Select your goals, availability, and learning method. Our system instantly calculates a structured timeline.</p>
          </div>
          <div className="demo-widget-layout">
            <div className="demo-form-card">
              <h3>Configure Your Block</h3>
              <form onSubmit={handleGeneratePlan}>
                <div className="form-group">
                  <label htmlFor="subject-select">Subject Category</label>
                  <select id="subject-select" value={subject} onChange={(e) => setSubject(e.target.value)}>
                    <option value="Computer Science">Computer Science &amp; Algorithms</option>
                    <option value="Organic Chemistry">Organic Chemistry &amp; Bio</option>
                    <option value="World History">World History &amp; Humanities</option>
                    <option value="Calculus & Algebra">Calculus &amp; Algebra</option>
                    <option value="Literature & Essay">Literature &amp; Critical Essay</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Session Duration</label>
                  <div className="radio-button-group">
                    {[{ label: "1 Hour", val: "60" },{ label: "2 Hours", val: "120" },{ label: "3 Hours", val: "180" },{ label: "4 Hours", val: "244" }].map((d) => (
                      <button key={d.val} type="button" className={`btn-radio ${duration === d.val ? 'active' : ''}`} onClick={() => setDuration(d.val)}>{d.label}</button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="study-mode">Study Mode</label>
                  <select id="study-mode" value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="active-recall">🧠 Active Recall</option>
                    <option value="deep-focus">🎯 Deep Focus</option>
                    <option value="cram-mode">⚡ Cram Mode</option>
                    <option value="spaced-repetition">🔄 Spaced Repetition</option>
                  </select>
                </div>
                <button type="submit" className="btn-generate-planner" disabled={plannerLoading}>
                  {plannerLoading ? <span className="spinner"></span> : <span>Calculate Custom Schedule ⚡</span>}
                </button>
              </form>
            </div>
            <div className="demo-results-card" id="planner-output">
              {!generatedPlan && !plannerLoading && (
                <div className="planner-empty-state">
                  <div className="icon-sphere">
                    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                  </div>
                  <h3>Your Plan Will Appear Here</h3>
                  <p>Choose your parameters and click calculate. Our planner will instantly map out a customized revision session.</p>
                </div>
              )}
              {plannerLoading && (
                <div className="planner-loading-state">
                  <div className="pulsing-brain">🧠</div>
                  <h3>Structuring Session Schedule...</h3>
                  <p>Applying neuroscience-backed time splits and active rest cycles.</p>
                </div>
              )}
              {generatedPlan && !plannerLoading && (
                <div className="planner-plan-content">
                  <div className="plan-header">
                    <div><span className="plan-badge">{generatedPlan.modeName}</span><h4>{generatedPlan.subject} Session</h4></div>
                    <span className="plan-duration-total">⏰ {generatedPlan.duration} Mins</span>
                  </div>
                  <div className="timeline-container">
                    {generatedPlan.steps.map((step, idx) => (
                      <div key={idx} className="timeline-item">
                        <div className={`timeline-indicator ${step.type}`}><span>{idx + 1}</span></div>
                        <div className="timeline-content-card">
                          <div className="timeline-meta"><span className="timeline-phase">{step.phase}</span><span className="timeline-duration">{step.time}</span></div>
                          <h5>{step.title}</h5><p>{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="plan-actions">
                    <button className="btn-export-plan" onClick={handleExport}>Export Schedule to Device</button>
                    {successMsg && <div className="success-toast">{successMsg}</div>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {renderFeaturesSection()}
      {renderTestimonialsSection()}
      {renderFaqSection()}
    </>
  );

  const renderFeaturesSection = () => (
    <section className="features-section">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">Full Suite</div>
          <h2>Smart Features Built for High Grades</h2>
          <p>Everything you need to study smarter, retain complex material, and track progress without burnout.</p>
        </div>
        <div className="features-grid">
          {[
            { grad: 'grad-1', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />, title: 'AI Schedule Builder', desc: 'Intelligently balances your courses and dynamically adjusts study blocks based on exam difficulty and deadline urgency.' },
            { grad: 'grad-2', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />, title: 'Advanced Pomodoro Suite', desc: 'Custom focus intervals integrated directly into your tasks. Blocks notifications and plays ambient beats to maintain focus.' },
            { grad: 'grad-3', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />, title: 'Visual Analytics', desc: 'Track study duration, checklist accomplishments, and view estimated readiness scores before your exams.' },
            { grad: 'grad-4', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />, title: 'Collaborative Study Rooms', desc: 'Share calendars with classmates, hold virtual accountability calls, and benchmark your progress on leaderboards.' },
            { grad: 'grad-1', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />, title: 'Active Recall Booster', desc: 'Generates mock flashcards from lecture PDFs and automatically prompts questions during rest intervals.' },
            { grad: 'grad-2', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />, title: 'Privacy-First Vault', desc: 'All data is encrypted. We never sell your study habits or uploaded textbooks. Complete privacy over your academic work.' },
          ].map((f, i) => (
            <div key={i} className="feature-card">
              <div className={`feature-icon-box ${f.grad}`}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">{f.icon}</svg>
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderTestimonialsSection = () => (
    <section className="testimonials-section">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">Social Proof</div>
          <h2>What Students Are Saying</h2>
          <p>Real feedback from university and high school students who elevated their grades and recovered their mental health.</p>
        </div>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="testimonial-card">
              <div className="stars">{[...Array(t.rating)].map((_, i) => <span key={i} className="star-icon">★</span>)}</div>
              <p className="quote">&ldquo;{t.quote}&rdquo;</p>
              <div className="user-profile">
                <div className="user-avatar">{t.avatar}</div>
                <div className="user-meta"><h4>{t.name}</h4><span>{t.role}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderFaqSection = () => (
    <section className="faq-section">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">Clarifications</div>
          <h2>Frequently Asked Questions</h2>
          <p>Need more details? Here are answers to common student inquiries.</p>
        </div>
        <div className="faq-accordion-list">
          {FAQS.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <button className="faq-question-btn" onClick={() => setActiveFaq(isOpen ? null : idx)} aria-expanded={isOpen}>
                  <span>{faq.q}</span>
                  <span className="faq-icon-indicator">{isOpen ? '−' : '+'}</span>
                </button>
                <div className="faq-answer-wrapper">
                  <p className="faq-answer">{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );

  const renderFeaturesPage = () => (
    <div className="features-page-layout">
      {renderFeaturesSection()}
      {renderFaqSection()}
    </div>
  );

  const renderAboutPage = () => (
    <div className="about-page-layout">
      <section className="about-page-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-content">
              <h2>Our Mission &amp; Academic Research</h2>
              <p>SmartStudy was founded by cognitive researchers and developers to help students manage heavy workloads without burnout. We bridge the gap between memory science research and daily student workflows.</p>
              <ul className="about-science-list">
                <li>
                  <span className="science-icon">🧠</span>
                  <div><h4>Active Recall Focus</h4><span>Studies show self-testing boosts long-term memory retrieval by up to 150% compared to passive reading.</span></div>
                </li>
                <li>
                  <span className="science-icon">🔄</span>
                  <div><h4>Spaced Repetition Integration</h4><span>Automatically schedules reviews right when memory begins to decay, flattening the forgetting curve.</span></div>
                </li>
                <li>
                  <span className="science-icon">🎯</span>
                  <div><h4>Cognitive Load Optimization</h4><span>Splits large syllabus objectives into smaller timed focus sessions to maintain attention span.</span></div>
                </li>
              </ul>
            </div>
            <div className="about-visual-box">
              <div className="orb-glow"></div>
              <div style={{fontSize: '80px', marginBottom: '20px'}}>🏛️</div>
              <h3>Backed by Science</h3>
              <p style={{color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5', marginTop: '10px'}}>Built upon research from Ebbinghaus&apos; forgetting curves and modern attention deficit solutions.</p>
            </div>
          </div>
        </div>
      </section>
      {renderTestimonialsSection()}
    </div>
  );

  const renderLoginPage = () => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail);
    return (
      <section className="login-page-section">
        <div className="login-card-container">
          <div className="login-card">
            <div className="login-card-header">
              <h2>Welcome Back</h2>
              <p>Sign in to access your dashboard &amp; planner.</p>
            </div>
            {formError && <div className="auth-error-alert">{formError}</div>}
            {formSuccess && <div className="auth-success-alert">{formSuccess}</div>}
            <form onSubmit={handleAuthSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="login-email">Student Email Address</label>
                <div className="input-with-verification">
                  <input type="email" id="login-email" placeholder="alex@stanford.edu" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required className="login-input" />
                  {isEmailValid && <span className="email-verify-checkmark"><svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>}
                </div>
              </div>
              <div className="form-group">
                <div className="password-label-row">
                  <label htmlFor="login-pass">Password</label>
                  <button type="button" className="btn-forgot-password-link" onClick={() => alert('Password reset link sent to: ' + (formEmail || 'your email'))}>Forgot Password?</button>
                </div>
                <div className="password-input-wrapper">
                  <input type={showPassword ? 'text' : 'password'} id="login-pass" placeholder="••••••••" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} required className="login-input password-input" />
                  <button type="button" className="show-password-btn" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="login-options-row">
                <label className="remember-me-checkbox">
                  <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                  <span className="checkbox-custom-box">{rememberMe && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5L7 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</span>
                  <span className="checkbox-label-text">Remember this browser</span>
                </label>
              </div>
              <button type="submit" className="btn-primary-gradient btn-login-submit" disabled={authLoading}>
                {authLoading ? <span className="spinner"></span> : <span>Sign In Now ⚡</span>}
              </button>
            </form>
            <div className="auth-separator"><span>or continue with</span></div>
            <div className="social-login-grid">
              <button className="btn-social-auth" onClick={() => handleSocialLogin('google')} disabled={authLoading}><span>Google</span></button>
              <button className="btn-social-auth" onClick={() => handleSocialLogin('apple')} disabled={authLoading}><span>Apple</span></button>
              <button className="btn-social-auth" onClick={() => handleSocialLogin('github')} disabled={authLoading}><span>GitHub</span></button>
            </div>
            <div className="login-card-footer">
              <p>Don&apos;t have an account? <button type="button" className="btn-toggle-auth-tier" onClick={() => { setView('register'); setFormError(''); setFormSuccess(''); }}>Create Account</button></p>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderRegisterPage = () => {
    const regEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail);
    const pwdStrength   = getPasswordStrength(formPassword);
    const confirmMatch  = formConfirmPassword.length > 0 && formPassword === formConfirmPassword;
    const confirmMiss   = formConfirmPassword.length > 0 && formPassword !== formConfirmPassword;
    return (
      <section className="login-page-section">
        <div className="login-card-container">
          <div className="login-card">
            <div className="login-card-header">
              <h2>Join SmartStudy</h2>
              <p>Create your student account to get started.</p>
            </div>
            {registerError && <div className="auth-error-alert">{registerError}</div>}
            {registerSuccess && <div className="auth-success-alert">{registerSuccess}</div>}
            <form onSubmit={handleRegisterSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="reg-fullname">Full Name</label>
                <input type="text" id="reg-fullname" placeholder="Alex Rivera" value={formName} onChange={(e) => setFormName(e.target.value)} required className="login-input" />
              </div>
              <div className="form-group">
                <label htmlFor="reg-email">Student Email</label>
                <div className="input-with-verification">
                  <input type="email" id="reg-email" placeholder="alex@stanford.edu" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required className="login-input" />
                  {regEmailValid && <span className="email-verify-checkmark"><svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="reg-password">Password</label>
                <div className="password-input-wrapper">
                  <input type={showPassword ? 'text' : 'password'} id="reg-password" placeholder="Min. 8 characters" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} required className="login-input password-input" />
                  <button type="button" className="show-password-btn" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button>
                </div>
                {formPassword.length > 0 && (
                  <div className="pwd-strength-container" style={{marginTop:'8px'}}>
                    <span className="pwd-strength-label" style={{color: pwdStrength.color}}>Strength: {pwdStrength.label}</span>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="reg-confirm">Confirm Password</label>
                <input type={showConfirmPassword ? 'text' : 'password'} id="reg-confirm" placeholder="Re-enter password" value={formConfirmPassword} onChange={(e) => setFormConfirmPassword(e.target.value)} required className="login-input" />
                {confirmMatch && <p style={{color:'#10B981',fontSize:'12px',marginTop:'4px'}}>✓ Passwords match</p>}
                {confirmMiss  && <p style={{color:'#EF4444',fontSize:'12px',marginTop:'4px'}}>✗ Passwords do not match</p>}
              </div>
              <div className="terms-row">
                <label className="remember-me-checkbox">
                  <input type="checkbox" checked={termsAccepted} onChange={() => setTermsAccepted(!termsAccepted)} />
                  <span className="checkbox-label-text"> I agree to the Terms of Service &amp; Privacy Policy</span>
                </label>
              </div>
              <button type="submit" className="btn-primary-gradient btn-login-submit" disabled={registerLoading}>
                {registerLoading ? <span className="spinner"></span> : <span>Create Free Account ⚡</span>}
              </button>
            </form>
            <div className="login-card-footer">
              <p>Already have an account? <button type="button" className="btn-toggle-auth-tier" onClick={() => { setView('login'); setRegisterError(''); setRegisterSuccess(''); }}>Sign In</button></p>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // ── Unified public return ──
  return (
    <div className="public-root">

      {/* NAVBAR */}
      <header className="navbar-container">
        <div className="container navbar-inner">
          <div className="navbar-logo" onClick={() => setView('landing')} style={{cursor:'pointer'}}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="6" fill="url(#logoGrad)" />
              <path d="M7 11.5L10 14.5L17 7.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#8B5CF6"/>
                  <stop offset="1" stopColor="#EC4899"/>
                </linearGradient>
              </defs>
            </svg>
            <span className="logo-text">SmartStudy</span>
          </div>

          <nav className="navbar-links">
            <span className={`navbar-link ${view === 'landing' ? 'active' : ''}`} onClick={() => setView('landing')} style={{cursor:'pointer'}}>Home</span>
            <span className={`navbar-link ${view === 'features' ? 'active' : ''}`} onClick={() => setView('features')} style={{cursor:'pointer'}}>Features</span>
            <span className={`navbar-link ${view === 'about' ? 'active' : ''}`} onClick={() => setView('about')} style={{cursor:'pointer'}}>About</span>
          </nav>

          <div className="navbar-actions">
            <button className="theme-toggle-btn" onClick={handleToggleTheme} aria-label="Toggle Theme">
              {theme === 'dark' ? (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
              ) : (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
            {isLoggedIn ? (
              <>
                <span className="user-nav-badge" title={userEmail} onClick={() => setView('dashboard')} style={{cursor:'pointer'}}>{userEmail.substring(0, 2).toUpperCase()}</span>
                <button className="btn-secondary-outline btn-logout" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <button className={`btn-signin-link ${view === 'login' ? 'active' : ''}`} onClick={() => { setView('login'); setIsSignUp(false); }}>Login</button>
                <button className={`btn-navbar-cta ${view === 'register' ? 'active' : ''}`} onClick={() => { setView('register'); setIsSignUp(true); }}>Sign Up</button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="public-content-container">
        {view === 'landing'  && renderLandingPage()}
        {view === 'features' && renderFeaturesPage()}
        {view === 'about'    && renderAboutPage()}
        {view === 'login'    && renderLoginPage()}
        {view === 'register' && renderRegisterPage()}
      </main>

      {/* CTA FOOTER */}
      <section className="cta-footer-section">
        <div className="cta-glow"></div>
        <div className="container cta-footer-inner">
          <div className="cta-box">
            <h2>Ready to transform your study habits?</h2>
            <p>Get started today for free. No credit card required. Upgrade when you are ready to take your grades to the top tier.</p>
            <div className="cta-form-container">
              <form onSubmit={(e) => { e.preventDefault(); alert('Thanks for subscribing! Weekly planning tips are on their way.'); }}>
                <input type="email" placeholder="Enter your student email..." required className="cta-input-email" />
                <button type="submit" className="cta-btn-submit">Subscribe</button>
              </form>
            </div>
            <span className="subtext-note">✨ Join over 12,000+ students on our monthly learning newsletter.</span>
          </div>

          <footer className="footer-links-grid">
            <div className="footer-col brand-col">
              <div className="footer-logo" onClick={() => setView('landing')} style={{cursor:'pointer'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="6" fill="url(#logoGrad2)" />
                  <path d="M7 11.5L10 14.5L17 7.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs>
                    <linearGradient id="logoGrad2" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#8B5CF6"/><stop offset="1" stopColor="#EC4899"/>
                    </linearGradient>
                  </defs>
                </svg>
                <span>SmartStudy</span>
              </div>
              <p>Developing tools that empower the next generation of academic scholars, innovators, and leaders.</p>
            </div>
            <div className="footer-col">
              <h4>Product</h4>
              <span onClick={() => setView('features')} style={{cursor:'pointer',display:'block',marginBottom:'8px',color:'rgba(255,255,255,0.5)'}}>Features</span>
              <span onClick={() => setView('landing')} style={{cursor:'pointer',display:'block',marginBottom:'8px',color:'rgba(255,255,255,0.5)'}}>Session Generator</span>
              <a href="#">Roadmap</a>
            </div>
            <div className="footer-col">
              <h4>Resources</h4>
              <a href="#">Study Tips Blog</a>
              <a href="#">Neuroscience Guides</a>
              <a href="#">API Integrations</a>
              <a href="#">Help Center</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <span onClick={() => setView('about')} style={{cursor:'pointer',display:'block',marginBottom:'8px',color:'rgba(255,255,255,0.5)'}}>About Us</span>
              <a href="#">Careers</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Use</a>
            </div>
          </footer>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Smart Study Planner. All rights reserved. Made for students globally.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
// ================= NEW TAB COMPONENTS =================

const CalendarTab = ({ events, setEvents, addActivity }) => {
  const [selectedDate, setSelectedDate] = useState('2026-07-07');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('09:00');

  const daysInMonth = 31;
  const startDayOffset = 3; // Wednesday July 1, 2026
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const cells = [];
  for (let i = 0; i < startDayOffset; i++) {
    cells.push({ day: null, dateStr: null });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `2026-07-${d.toString().padStart(2, '0')}`;
    cells.push({ day: d, dateStr });
  }

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    const newEv = {
      id: Date.now(),
      title: newEventTitle.trim(),
      date: selectedDate,
      time: newEventTime
    };
    setEvents(prev => [...prev, newEv]);
    setNewEventTitle('');
    addActivity(`Scheduled event "${newEv.title}" for ${selectedDate}`, 'planner');
  };

  const handleDeleteEvent = (id) => {
    setEvents(prev => prev.filter(ev => ev.id !== id));
  };

  const selectedEvents = events.filter(ev => ev.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="calendar-tab-layout">
      <div className="tab-header">
        <h2>Study Calendar</h2>
        <p>Organize your study sessions, classes, and exams dynamically.</p>
      </div>

      <div className="calendar-grid-container">
        <div className="db-widget calendar-month-view">
          <div className="calendar-month-header">
            <h3>July 2026</h3>
          </div>
          <div className="calendar-weekdays">
            {weekDays.map(wd => <div key={wd} className="weekday-lbl">{wd}</div>)}
          </div>
          <div className="calendar-days-grid">
            {cells.map((cell, idx) => {
              if (!cell.day) {
                return <div key={`empty-${idx}`} className="calendar-day empty"></div>;
              }
              const isSelected = cell.dateStr === selectedDate;
              const hasEvents = events.some(ev => ev.date === cell.dateStr);
              const dayEvents = events.filter(ev => ev.date === cell.dateStr);
              
              return (
                <div 
                  key={cell.dateStr} 
                  className={`calendar-day active-day ${isSelected ? 'selected' : ''} ${hasEvents ? 'has-events' : ''}`}
                  onClick={() => setSelectedDate(cell.dateStr)}
                >
                  <span className="day-number">{cell.day}</span>
                  {hasEvents && (
                    <div className="day-event-dots">
                      {dayEvents.slice(0, 3).map((_, i) => (
                        <span key={i} className="event-dot"></span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="calendar-details-sidebar">
          <div className="db-widget calendar-events-widget">
            <h3>Events for {selectedDate}</h3>
            {selectedEvents.length === 0 ? (
              <div className="no-events-state">
                <p>No study sessions scheduled for this day.</p>
              </div>
            ) : (
              <div className="events-list">
                {selectedEvents.map(ev => (
                  <div key={ev.id} className="event-item-card">
                    <div className="event-time">⏰ {ev.time}</div>
                    <div className="event-details">
                      <h4>{ev.title}</h4>
                    </div>
                    <button className="btn-delete-event" onClick={() => handleDeleteEvent(ev.id)} title="Delete Event">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="db-widget add-event-widget">
            <h3>Schedule New Event</h3>
            <form onSubmit={handleAddEvent} className="add-event-form">
              <div className="form-group">
                <label>Selected Date</label>
                <input 
                  type="date" 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)} 
                  required 
                  className="login-input"
                />
              </div>
              <div className="form-group">
                <label>Event Time</label>
                <input 
                  type="time" 
                  value={newEventTime} 
                  onChange={(e) => setNewEventTime(e.target.value)} 
                  required 
                  className="login-input"
                />
              </div>
              <div className="form-group">
                <label>Event Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. CS 101 Midterm Exam" 
                  value={newEventTitle} 
                  onChange={(e) => setNewEventTitle(e.target.value)} 
                  required 
                  className="login-input"
                />
              </div>
              <button type="submit" className="btn-primary-gradient btn-add-event">
                Add Event 📅
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const GoalsTab = ({ goals, setGoals, addActivity }) => {
  const [newGoalText, setNewGoalText] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('General');

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    const newGl = {
      id: Date.now(),
      text: newGoalText.trim(),
      progress: 0,
      category: newGoalCategory
    };
    setGoals(prev => [...prev, newGl]);
    setNewGoalText('');
    addActivity(`Added new goal: "${newGl.text}"`, 'task');
  };

  const handleIncrementGoal = (id) => {
    setGoals(prev => prev.map(gl => {
      if (gl.id === id) {
        const newProgress = Math.min(gl.progress + 10, 100);
        if (newProgress === 100) {
          addActivity(`Completed goal: "${gl.text}" 🏆`, 'task');
        }
        return { ...gl, progress: newProgress };
      }
      return gl;
    }));
  };

  const handleCompleteGoal = (id) => {
    setGoals(prev => prev.map(gl => {
      if (gl.id === id) {
        addActivity(`Completed goal: "${gl.text}" 🏆`, 'task');
        return { ...gl, progress: 100 };
      }
      return gl;
    }));
  };

  const handleDeleteGoal = (id) => {
    setGoals(prev => prev.filter(gl => gl.id !== id));
  };

  return (
    <div className="goals-tab-layout">
      <div className="tab-header">
        <h2>Academic & Personal Goals</h2>
        <p>Track your milestones and stay committed to your semester goals.</p>
      </div>

      <div className="goals-grid-layout">
        <div className="db-widget goals-list-card">
          <h3>My Study Goals</h3>
          {goals.length === 0 ? (
            <p className="empty-state-text">No active goals yet. Add some below to get started!</p>
          ) : (
            <div className="goals-list">
              {goals.map(gl => (
                <div key={gl.id} className={`goal-item-row ${gl.progress === 100 ? 'completed' : ''}`}>
                  <div className="goal-info-col">
                    <span className="goal-category-badge">{gl.category}</span>
                    <h4>{gl.text}</h4>
                    <div className="goal-progress-container">
                      <div className="progress-bar-track">
                        <div className="progress-bar-fill" style={{ width: `${gl.progress}%` }}></div>
                      </div>
                      <span className="progress-percent-lbl">{gl.progress}%</span>
                    </div>
                  </div>
                  <div className="goal-actions-col">
                    {gl.progress < 100 && (
                      <>
                        <button className="btn-goal-action btn-goal-plus" onClick={() => handleIncrementGoal(gl.id)} title="Add 10% progress">
                          +10%
                        </button>
                        <button className="btn-goal-action btn-goal-check" onClick={() => handleCompleteGoal(gl.id)} title="Mark Complete">
                          ✓
                        </button>
                      </>
                    )}
                    <button className="btn-goal-action btn-goal-delete" onClick={() => handleDeleteGoal(gl.id)} title="Delete Goal">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="db-widget add-goal-card">
          <h3>Add New Goal</h3>
          <form onSubmit={handleAddGoal} className="add-goal-form">
            <div className="form-group">
              <label>Goal Description</label>
              <input 
                type="text" 
                placeholder="e.g. Read 5 pages of CS textbook daily"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                required
                className="login-input"
              />
            </div>
            <div className="form-group">
              <label>Course / Category</label>
              <select 
                value={newGoalCategory}
                onChange={(e) => setNewGoalCategory(e.target.value)}
                className="login-input"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Literature">Literature</option>
                <option value="Calculus">Calculus</option>
                <option value="General">General / Personal</option>
              </select>
            </div>
            <button type="submit" className="btn-primary-gradient btn-add-goal">
              Add Goal 🎯
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const NotesTab = ({ notes, setNotes, activeNoteId, setActiveNoteId, addActivity }) => {
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState('General');

  const activeNote = notes.find(n => n.id === activeNoteId);

  useEffect(() => {
    if (activeNote) {
      setNoteTitle(activeNote.title);
      setNoteContent(activeNote.content);
      setNoteCategory(activeNote.category);
    } else {
      setNoteTitle('');
      setNoteContent('');
      setNoteCategory('General');
    }
  }, [activeNoteId, activeNote]);

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    if (activeNoteId === 'new') {
      const newNt = {
        id: Date.now(),
        title: noteTitle.trim(),
        content: noteContent,
        category: noteCategory,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      setNotes(prev => [newNt, ...prev]);
      setActiveNoteId(newNt.id);
      addActivity(`Created note: "${newNt.title}"`, 'general');
    } else {
      setNotes(prev => prev.map(n => {
        if (n.id === activeNoteId) {
          return {
            ...n,
            title: noteTitle.trim(),
            content: noteContent,
            category: noteCategory
          };
        }
        return n;
      }));
      addActivity(`Updated note: "${noteTitle.trim()}"`, 'general');
    }
  };

  const handleDeleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (activeNoteId === id) {
      setActiveNoteId(notes.length > 1 ? notes[0].id : 'new');
    }
  };

  const handleNewNoteClick = () => {
    setActiveNoteId('new');
    setNoteTitle('');
    setNoteContent('');
    setNoteCategory('General');
  };

  return (
    <div className="notes-tab-layout">
      <div className="tab-header">
        <h2>Active Recall Notes</h2>
        <p>Draft your summaries and quick definitions here for spaced retrieval practice.</p>
      </div>

      <div className="notes-editor-grid">
        <div className="db-widget notes-list-pane">
          <div className="notes-pane-header">
            <h3>My Study Notes</h3>
            <button className="btn-primary-gradient btn-new-note" onClick={handleNewNoteClick}>
              + New Note
            </button>
          </div>
          <div className="notes-list-scrollable">
            {notes.map(n => (
              <div 
                key={n.id} 
                className={`note-list-item ${n.id === activeNoteId ? 'active' : ''}`}
                onClick={() => setActiveNoteId(n.id)}
              >
                <div className="note-item-meta">
                  <span className="note-cat-badge">{n.category}</span>
                  <span className="note-date">{n.date}</span>
                </div>
                <h4>{n.title}</h4>
                <p>{n.content.substring(0, 50)}{n.content.length > 50 ? '...' : ''}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="db-widget notes-editor-pane">
          <form onSubmit={handleSaveNote} className="notes-edit-form">
            <div className="editor-top-row">
              <input 
                type="text" 
                placeholder="Note Title" 
                value={noteTitle} 
                onChange={(e) => setNoteTitle(e.target.value)} 
                required 
                className="note-title-input"
              />
              <select 
                value={noteCategory} 
                onChange={(e) => setNoteCategory(e.target.value)} 
                className="note-cat-select"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Literature">Literature</option>
                <option value="Calculus">Calculus</option>
                <option value="General">General</option>
              </select>
            </div>

            <textarea 
              placeholder="Start typing your study notes, definitions, or equations here..." 
              value={noteContent} 
              onChange={(e) => setNoteContent(e.target.value)} 
              className="note-body-textarea"
            />

            <div className="editor-bottom-row">
              <button type="submit" className="btn-primary-gradient btn-save-note">
                Save Note 💾
              </button>
              {activeNoteId !== 'new' && (
                <button type="button" className="btn-secondary-outline btn-delete-note" onClick={() => handleDeleteNote(activeNoteId)}>
                  Delete Note ✕
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const AiAssistantTab = () => {
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello! I am your AI Study Coach. How can I help you master your classes today? Try asking me how to organize your day or explain a study technique.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  const quickPrompts = [
    "How should I study for exams?",
    "Create a 4-hour active recall study schedule for Chemistry",
    "Explain the Spaced Repetition technique",
    "Suggest focus intervals to beat study burnout"
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userText }]);
    setChatInput('');
    setIsAiTyping(true);

    setTimeout(() => {
      setIsAiTyping(false);
      let coachResponse = "That is a great question! For best results, I recommend setting up a structured Study Session with Spaced Repetition. Focus for 25 minutes, then test yourself using active recall techniques like blind writing or practice quizzes. What topic are you studying next?";
      
      const textLower = userText.toLowerCase();
      if (textLower.includes('how') && textLower.includes('study')) {
        coachResponse = "Effective studying is all about retrieval practice! Try the Active Recall method: close your books, write down everything you remember, then check your notes to identify gaps. Also, use the Pomodoro technique to maintain focus blocks.";
      } else if (textLower.includes('chemistry') || textLower.includes('chem')) {
        coachResponse = "Chemistry study blocks work best when you split your time: 1) 15 mins reviewing structural logic / mechanism pathways, 2) 30 mins active retrieval drawing mechanisms from memory, and 3) 15 mins doing high-difficulty synthesis problems.";
      } else if (textLower.includes('spaced repetition') || textLower.includes('repetition')) {
        coachResponse = "Spaced Repetition leverages the 'spacing effect' by reviewing material at increasing intervals (e.g. Day 1, Day 3, Day 7, Day 14). This moves information from short-term to long-term memory. SmartStudy automates this in your study planner!";
      } else if (textLower.includes('pomodoro') || textLower.includes('focus') || textLower.includes('burnout')) {
        coachResponse = "To prevent burnout, use the 25/5 Pomodoro rule: 25 minutes of deep focus, followed by a 5-minute offline rest break. After 4 focus blocks, take a longer 15-30 minute break. Keep your phone out of reach during study hours.";
      } else if (textLower.includes('plan') || textLower.includes('schedule')) {
        coachResponse = "Let's construct a study block! Switch over to the AI Study Planner tab, input your subject and duration, and select Cram or Active Recall mode. Our algorithm will immediately output a customized timeline.";
      }

      setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: coachResponse }]);
    }, 1200);
  };

  return (
    <div className="ai-assistant-tab-layout">
      <div className="tab-header">
        <h2>AI Study Assistant & Coach</h2>
        <p>Ask our neuroscience-backed AI tutor for custom lesson schedules, advice, and tips.</p>
      </div>

      <div className="ai-chat-card db-widget">
        <div className="chat-messages-container">
          {chatMessages.map(msg => (
            <div key={msg.id} className={`chat-bubble-row ${msg.sender}`}>
              <div className="chat-avatar">
                {msg.sender === 'ai' ? '🤖' : '🎓'}
              </div>
              <div className="chat-bubble-content">
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          {isAiTyping && (
            <div className="chat-bubble-row ai typing">
              <div className="chat-avatar">🤖</div>
              <div className="chat-bubble-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="chat-quick-suggestions">
          {quickPrompts.map((p, idx) => (
            <button key={idx} className="btn-quick-prompt" onClick={() => setChatInput(p)}>
              {p}
            </button>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="chat-input-form">
          <input 
            type="text" 
            placeholder="Ask your AI study coach a question..." 
            value={chatInput} 
            onChange={(e) => setChatInput(e.target.value)} 
            className="chat-input-text"
          />
          <button type="submit" className="btn-primary-gradient btn-chat-send">
            Send ⚡
          </button>
        </form>
      </div>
    </div>
  );
};

const NotificationsTab = ({ notifications, setNotifications }) => {
  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="notifications-tab-layout">
      <div className="tab-header">
        <h2>Alerts & Notifications</h2>
        <p>Manage recent reminders, focus completions, and system update logs.</p>
      </div>

      <div className="db-widget notifications-card">
        <div className="notifications-card-header">
          <h3>Recent Notifications</h3>
          {notifications.length > 0 && (
            <button className="btn-secondary-outline btn-clear-notifications" onClick={handleClearAll}>
              Clear All Alerts
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="notifications-empty-state">
            <span className="bell-large-icon">🔔</span>
            <h3>No Notifications</h3>
            <p>You are completely caught up! We will alert you when study reminders trigger.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map(n => (
              <div key={n.id} className={`notification-row-item ${n.read ? 'read' : 'unread'}`}>
                <div className="notification-status-badge"></div>
                <div className="notification-main-content">
                  <p>{n.text}</p>
                  <span className="notification-time-ago">{n.time}</span>
                </div>
                {!n.read && (
                  <button className="btn-mark-read" onClick={() => handleMarkAsRead(n.id)}>
                    Mark Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileTab = ({ userEmail, setUserEmail, addActivity }) => {
  const [profileName, setProfileName] = useState('Alex Rivera');
  const [profileEmail, setProfileEmail] = useState(userEmail || 'alex@stanford.edu');
  const [profileWeeklyTarget, setProfileWeeklyTarget] = useState('20');
  const [profileStudyMode, setProfileStudyMode] = useState('active-recall');

  useEffect(() => {
    if (userEmail) {
      setProfileEmail(userEmail);
    }
  }, [userEmail]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUserEmail(profileEmail);
    addActivity('Updated account profile configurations', 'general');
    alert('✨ Profile configurations successfully updated!');
  };

  return (
    <div className="profile-tab-layout">
      <div className="tab-header">
        <h2>My Profile Settings</h2>
        <p>Personalize your student identity, goals, and default learning styles.</p>
      </div>

      <div className="profile-grid-layout">
        <form onSubmit={handleSaveProfile} className="db-widget profile-form-card">
          <h3>Account Settings</h3>
          
          <div className="form-grid-row">
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                value={profileName} 
                onChange={(e) => setProfileName(e.target.value)} 
                required 
                className="login-input"
              />
            </div>
            <div className="form-group">
              <label>Student Email Address</label>
              <input 
                type="email" 
                value={profileEmail} 
                onChange={(e) => setProfileEmail(e.target.value)} 
                required 
                className="login-input"
              />
            </div>
          </div>

          <div className="form-grid-row">
            <div className="form-group">
              <label>Weekly Study Target Hours</label>
              <input 
                type="number" 
                min="1" 
                max="168"
                value={profileWeeklyTarget} 
                onChange={(e) => setProfileWeeklyTarget(e.target.value)} 
                required 
                className="login-input"
              />
            </div>
            <div className="form-group">
              <label>Default Study Mode</label>
              <select 
                value={profileStudyMode} 
                onChange={(e) => setProfileStudyMode(e.target.value)} 
                className="login-input"
              >
                <option value="active-recall">🧠 Active Recall Mode</option>
                <option value="deep-focus">🎯 Deep Focus Mode</option>
                <option value="cram-mode">⚡ Cram Mode</option>
                <option value="spaced-repetition">🔄 Spaced Repetition</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary-gradient btn-save-profile">
            Save Profile Configurations 💾
          </button>
        </form>

        <div className="db-widget profile-stats-card">
          <h3>Scholar Badge Details</h3>
          <div className="profile-badge-showcase">
            <div className="large-badge-icon">🎖️</div>
            <h4>Smart Scholar Pro</h4>
            <p className="badge-subtext">Active subscriber since July 2026</p>
          </div>
          <div className="badge-details-list">
            <div className="detail-row">
              <span>Account Status:</span>
              <span className="status-active">Active</span>
            </div>
            <div className="detail-row">
              <span>Total Study Blocks:</span>
              <span>48 Sessions Completed</span>
            </div>
            <div className="detail-row">
              <span>Study Streak:</span>
              <span>7 Days Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

