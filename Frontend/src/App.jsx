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
  // Navigation Routing state ('landing' or 'login')
  const [view, setView] = useState('landing');
  
  // Login Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
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

  // Pricing Toggle state
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  // FAQ Accordion state
  const [activeFaq, setActiveFaq] = useState(null);

  // Task list in the Mock Dashboard
  const [tasks, setTasks] = useState([
    { id: 1, text: "Read Chapter 4 (Logic Gates)", done: true },
    { id: 2, text: "Write binary tree code proof", done: false },
    { id: 3, text: "Complete 15m review flashcards", done: false }
  ]);

  // Synchronize theme attribute on body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Pomodoro timer countdown logic
  useEffect(() => {
    let interval = null;
    if (pomodoroRunning && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroSeconds === 0) {
      setPomodoroRunning(false);
      alert("Great job focusing! Take a short break.");
      setPomodoroSeconds(1500);
    }
    return () => clearInterval(interval);
  }, [pomodoroRunning, pomodoroSeconds]);

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
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
      
      // Auto redirect to landing page after 1s
      setTimeout(() => {
        setView('landing');
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
      setView('landing');
    }, 1000);
  };

  // Handle Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    setView('landing');
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

  // ================= RENDER LOGIN VIEW =================
  if (view === 'login') {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail);
    
    return (
      <div className="landing-root">
        {/* Simple Login Header */}
        <header className="navbar-container">
          <div className="container navbar-inner">
            <div className="navbar-logo" onClick={() => setView('landing')}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="6" fill="url(#loginLogoGrad)" />
                <path d="M7 11.5L10 14.5L17 7.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="loginLogoGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#8B5CF6"/>
                    <stop offset="1" stopColor="#EC4899"/>
                  </linearGradient>
                </defs>
              </svg>
              <span className="logo-text">SmartStudy</span>
            </div>

            <div className="navbar-actions">
              <button className="theme-toggle-btn" onClick={handleToggleTheme} aria-label="Toggle Theme">
                {theme === 'dark' ? (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                ) : (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <button onClick={() => setView('landing')} className="btn-secondary-outline btn-nav-back">
                Back to Home
              </button>
            </div>
          </div>
        </header>

        {/* Login Card Centered Container */}
        <section className="login-page-section">
          <div className="hero-glow-1"></div>
          <div className="hero-glow-2"></div>
          
          <div className="login-card-container">
            <div className="login-card">
              <div className="login-card-header">
                <h2>{isSignUp ? 'Join SmartStudy' : 'Welcome Back'}</h2>
                <p>{isSignUp ? 'Create your student account to get started.' : 'Sign in to access your dashboard & planner.'}</p>
              </div>

              {formError && <div className="auth-error-alert">{formError}</div>}
              {formSuccess && <div className="auth-success-alert">{formSuccess}</div>}

              {/* Form Input fields */}
              <form onSubmit={handleAuthSubmit} className="login-form">
                {isSignUp && (
                  <div className="form-group">
                    <label htmlFor="reg-name">Your Full Name</label>
                    <input 
                      type="text" 
                      id="reg-name" 
                      placeholder="Alex Rivera"
                      value={formName} 
                      onChange={(e) => setFormName(e.target.value)}
                      required
                      className="login-input"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="login-email">Student Email Address</label>
                  <div className="input-with-verification">
                    <input 
                      type="email" 
                      id="login-email" 
                      placeholder="alex@stanford.edu"
                      value={formEmail} 
                      onChange={(e) => setFormEmail(e.target.value)}
                      required
                      className="login-input"
                    />
                    {isEmailValid && (
                      <span className="email-verify-checkmark">
                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 5L4.5 8.5L11 1" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <div className="password-label-row">
                    <label htmlFor="login-pass">Password</label>
                    {!isSignUp && (
                      <button 
                        type="button" 
                        className="btn-forgot-password-link"
                        onClick={() => alert("Password reset link sent to: " + (formEmail || "your email"))}
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="password-input-wrapper">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      id="login-pass" 
                      placeholder="••••••••"
                      value={formPassword} 
                      onChange={(e) => setFormPassword(e.target.value)}
                      required
                      className="login-input password-input"
                    />
                    <button 
                      type="button" 
                      className="show-password-btn" 
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide Password' : 'Show Password'}
                    >
                      {showPassword ? (
                        /* Eye Closed Icon */
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        /* Eye Open Icon */
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember me option */}
                <div className="login-options-row">
                  <label className="remember-me-checkbox">
                    <input 
                      type="checkbox" 
                      checked={rememberMe} 
                      onChange={() => setRememberMe(!rememberMe)}
                    />
                    <span className="checkbox-custom-box">
                      {rememberMe && (
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </span>
                    <span className="checkbox-label-text">Remember this browser</span>
                  </label>
                </div>

                <button type="submit" className="btn-primary-gradient btn-login-submit" disabled={authLoading}>
                  {authLoading ? (
                    <span className="spinner"></span>
                  ) : (
                    <span>{isSignUp ? 'Create Account ⚡' : 'Sign In Now ⚡'}</span>
                  )}
                </button>
              </form>

              {/* Separator line */}
              <div className="auth-separator">
                <span>or continue with</span>
              </div>

              {/* Social Login Grid */}
              <div className="social-login-grid">
                <button className="btn-social-auth" onClick={() => handleSocialLogin('google')} disabled={authLoading}>
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.91c1.7-1.56 2.69-3.86 2.69-6.6z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.47-.8 5.96-2.2l-2.91-2.26c-.8.54-1.83.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33A9 9 0 0 0 9 18z" fill="#34A853"/>
                    <path d="M3.96 10.69A5.4 5.4 0 0 1 3.68 9c0-.58.1-1.15.28-1.69V4.98H.96A8.99 8.99 0 0 0 0 9c0 1.48.36 2.88.96 4.14l3-2.45z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.02A8.99 8.99 0 0 0 9 0 9 9 0 0 0 .96 4.98l3 2.45c.71-2.13 2.7-3.71 5.04-3.71z" fill="#EA4335"/>
                  </svg>
                  <span>Google</span>
                </button>

                <button className="btn-social-auth" onClick={() => handleSocialLogin('apple')} disabled={authLoading}>
                  <svg width="16" height="18" viewBox="0 0 16 18" fill="currentColor">
                    <path d="M13.68 9.87c.03-2.35 1.94-3.48 2.03-3.53-1.1-1.61-2.82-1.83-3.42-1.87-1.45-.15-2.83.85-3.57.85-.73 0-1.9-.83-3.13-.81-1.62.02-3.12.94-3.96 2.39-1.69 2.93-.43 7.26 1.2 9.61.8 1.15 1.74 2.44 2.99 2.39 1.2-.05 1.66-.77 3.11-.77 1.44 0 1.86.77 3.12.74 1.28-.02 2.1-.1.17-1.17-1.07-1.57-1.85-3.48-1.85-5.91-.01-.03-.01-.07-.01-.1zm-2.45-6.84c.65-.79 1.09-1.88.97-2.97-.94.04-2.08.63-2.75 1.41-.58.67-1.09 1.78-.95 2.85.94.07 2.01-.5 2.73-1.29z" />
                  </svg>
                  <span>Apple</span>
                </button>

                <button className="btn-social-auth" onClick={() => handleSocialLogin('github')} disabled={authLoading}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M9 0C4.03 0 0 4.03 0 9c0 3.98 2.58 7.35 6.16 8.54.45.08.61-.2.61-.43 0-.21-.01-.78-.01-1.53-2.5.54-3.03-1.21-3.03-1.21-.41-1.04-1-1.32-1-1.32-.82-.56.06-.55.06-.55.9.06 1.38.93 1.38.93.8 1.38 2.12.98 2.63.75.08-.58.31-.98.57-1.21-2-.23-4.1-1-4.1-4.46 0-.98.35-1.79.93-2.42-.09-.23-.4-1.14.09-2.39 0 0 .76-.24 2.47.92A8.6 8.6 0 019 4.88c.77.004 1.54.1 2.27.3 1.7-1.16 2.46-.92 2.46-.92.49 1.25.18 2.16.09 2.39.58.63.93 1.44.93 2.42 0 3.48-2.1 4.22-4.11 4.45.32.28.62.83.62 1.68 0 1.21-.01 2.19-.01 2.49 0 .24.16.52.62.43C15.42 16.35 18 12.98 18 9c0-4.97-4.03-9-9-9z" />
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>

              {/* Form Bottom Switcher */}
              <div className="login-card-footer">
                <p>
                  {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}
                  <button 
                    type="button" 
                    className="btn-toggle-auth-tier"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setFormError('');
                      setFormSuccess('');
                    }}
                  >
                    {isSignUp ? 'Sign In' : 'Create Student Account'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ================= RENDER LANDING VIEW =================
  return (
    <div className="landing-root">
      
      {/* NAVBAR */}
      <header className="navbar-container">
        <div className="container navbar-inner">
          <div className="navbar-logo" onClick={() => setView('landing')}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <a href="#features">Features</a>
            <a href="#demo">Interactive Planner</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </nav>

          <div className="navbar-actions">
            <button className="theme-toggle-btn" onClick={handleToggleTheme} aria-label="Toggle Theme">
              {theme === 'dark' ? (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {isLoggedIn ? (
              <div className="logged-in-user-menu">
                <span className="user-nav-badge" title={userEmail}>
                  {userEmail.substring(0, 2).toUpperCase()}
                </span>
                <button className="btn-secondary-outline btn-logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button 
                  className="btn-signin-link"
                  onClick={() => { setView('login'); setIsSignUp(false); }}
                >
                  Sign In
                </button>
                <button 
                  className="btn-navbar-cta"
                  onClick={() => { setView('login'); setIsSignUp(true); }}
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </header>

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
              <button 
                className="btn-primary-gradient"
                onClick={() => { setView('login'); setIsSignUp(true); }}
              >
                Start Planning Free
              </button>
              <a href="#features" className="btn-secondary-outline">See How It Works</a>
            </div>
            
            <div className="hero-social-proof">
              <div className="avatars-group">
                <span className="avatar-mini bg-red"></span>
                <span className="avatar-mini bg-blue"></span>
                <span className="avatar-mini bg-purple"></span>
                <span className="avatar-mini bg-green"></span>
              </div>
              <p>Loved by <strong>50,000+</strong> students at Stanford, MIT, Oxford & Harvard</p>
            </div>
          </div>

          {/* Hero Visual Mock Dashboard */}
          <div className="hero-visual">
            <div className="mock-dashboard">
              <div className="dashboard-header">
                <div className="dots-group">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <div className="dashboard-title">Today's Focus Dashboard</div>
                <div className="dashboard-status">Online</div>
              </div>

              <div className="dashboard-grid">
                {/* Left: Pomodoro Timer */}
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
                    <button className="btn-timer-reset" onClick={() => { setPomodoroSeconds(1500); setPomodoroRunning(false); }}>
                      Reset
                    </button>
                  </div>
                </div>

                {/* Right: Daily Checklist */}
                <div className="widget checklist-widget">
                  <h3>Daily Checklist</h3>
                  <div className="task-list">
                    {tasks.map((task) => (
                      <div key={task.id} className={`task-item ${task.done ? 'checked' : ''}`} onClick={() => toggleTask(task.id)}>
                        <div className="custom-checkbox">
                          {task.done && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
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
                      <div 
                        className="progress-fill" 
                        style={{ width: `${(tasks.filter(t => t.done).length / tasks.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom: Focus Analytics Graphic */}
              <div className="widget analytics-widget">
                <div className="analytics-meta">
                  <div>
                    <h4>Syllabus Covered</h4>
                    <span className="analytics-num">78%</span>
                  </div>
                  <div>
                    <h4>Focus Score</h4>
                    <span className="analytics-num glow-txt">94/100</span>
                  </div>
                  <div>
                    <h4>Active Recall Streak</h4>
                    <span className="analytics-num">12 Days</span>
                  </div>
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
            <div className="stat-card">
              <div className="stat-number">45%</div>
              <div className="stat-title">Study Efficiency Boost</div>
              <p className="stat-desc">Students report completing syllabus blocks in nearly half the average time.</p>
            </div>
            <div className="stat-card">
              <div className="stat-number">12 hrs</div>
              <div className="stat-title">Time Saved Weekly</div>
              <p className="stat-desc">AI scheduling automatically blocks empty slots, eliminating manual calendar setup.</p>
            </div>
            <div className="stat-card">
              <div className="stat-number">92%</div>
              <div className="stat-title">Goal Completion Rate</div>
              <p className="stat-desc">Gamified task streaks keep students accountable and motivated throughout the term.</p>
            </div>
            <div className="stat-card">
              <div className="stat-number">4.9/5</div>
              <div className="stat-title">Student Satisfaction</div>
              <p className="stat-desc">Highly rated across Trustpilot and App Store for visual design and accessibility.</p>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE DEMO PLANNER SECTION */}
      <section id="demo" className="demo-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Try It Live</div>
            <h2>Generate Your Smart Study Session</h2>
            <p>Select your goals, availability, and learning method. Our system will immediately calculate a structured timeline to organize your study block.</p>
          </div>

          <div className="demo-widget-layout">
            {/* Form Side */}
            <div className="demo-form-card">
              <h3>Configure Your Block</h3>
              <form onSubmit={handleGeneratePlan}>
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

            {/* Results Side */}
            <div className="demo-results-card" id="planner-output">
              {!generatedPlan && !plannerLoading && (
                <div className="planner-empty-state">
                  <div className="icon-sphere">
                    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  </div>
                  <h3>Your Plan Will Appear Here</h3>
                  <p>Choose your parameters on the left and click calculate. Our planner will instantly map out a structured revision session customized for you.</p>
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
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Full Suite</div>
            <h2>Smart Features Built for High Grades</h2>
            <p>Everything you need to study smarter, retain complex material, and track progress without burnouts.</p>
          </div>

          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-icon-box grad-1">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3>AI Schedule Builder</h3>
              <p>Intelligently balances your courses and dynamically changes study blocks based on exam difficulties and deadline urgency.</p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-icon-box grad-2">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>Advanced Pomodoro Suite</h3>
              <p>Custom focus intervals integrated directly into your tasks. Blocks notifications and plays ambient binaural beats to maintain focus.</p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-icon-box grad-3">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3>Visual Analytics</h3>
              <p>Track study duration, screen time, checklist accomplishments, and view estimated readiness scores before entering your exams.</p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card">
              <div className="feature-icon-box grad-4">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3>Collaborative Study Rooms</h3>
              <p>Share calendars with classmates, hold virtual accountability group calls, and benchmark your progress on subject leaderboards.</p>
            </div>

            {/* Feature 5 */}
            <div className="feature-card">
              <div className="feature-icon-box grad-1">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3>Active Recall Booster</h3>
              <p>Generates mock flashcards directly from lecture PDFs and automatically prompts questions during rest intervals to force active retrieval.</p>
            </div>

            {/* Feature 6 */}
            <div className="feature-card">
              <div className="feature-icon-box grad-2">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3>Privacy-First Vault</h3>
              <p>All data is encrypted. We never sell your study habits or uploaded textbooks. Enjoy complete privacy over your academic work.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Social Proof</div>
            <h2>What Students Are Saying</h2>
            <p>Read true feedback from university and high school students who elevated their grades and recovered their mental health.</p>
          </div>

          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="testimonial-card">
                <div className="stars">
                  {[...Array(t.rating)].map((_, i) => (
                    <span key={i} className="star-icon">★</span>
                  ))}
                </div>
                <p className="quote">"{t.quote}"</p>
                <div className="user-profile">
                  <div className="user-avatar">{t.avatar}</div>
                  <div className="user-meta">
                    <h4>{t.name}</h4>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="pricing-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Fair Plans</div>
            <h2>Simple, Affordable Pricing</h2>
            <p>Start with our free plan. Upgrade to unlock unlimited AI uploads, priority mock schedules, and team rooms.</p>
            
            <div className="pricing-toggle-container">
              <span className={billingPeriod === 'monthly' ? 'active' : ''}>Monthly</span>
              <button 
                className={`billing-toggle ${billingPeriod === 'annual' ? 'checked' : ''}`}
                onClick={() => setBillingPeriod(prev => prev === 'monthly' ? 'annual' : 'monthly')}
                aria-label="Toggle Billing Period"
              >
                <span className="toggle-slider"></span>
              </button>
              <span className={billingPeriod === 'annual' ? 'active' : ''}>
                Annually <span className="discount-badge">Save 25%</span>
              </span>
            </div>
          </div>

          <div className="pricing-grid">
            {/* Card 1: Free */}
            <div className="pricing-card">
              <div className="pricing-tier">Base</div>
              <h3 className="tier-name">Free Plan</h3>
              <div className="price-container">
                <span className="currency">$</span>
                <span className="price">0</span>
                <span className="period">/mo</span>
              </div>
              <p className="tier-desc">Essential planning features for individual learners.</p>
              
              <ul className="tier-features">
                <li>
                  <svg className="bullet-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                  Up to 3 active schedules
                </li>
                <li>
                  <svg className="bullet-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                  Standard Pomodoro timer
                </li>
                <li>
                  <svg className="bullet-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                  Basic progress trackers
                </li>
                <li className="disabled">
                  <svg className="bullet-cross" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12"/></svg>
                  Unlimited AI schedule updates
                </li>
                <li className="disabled">
                  <svg className="bullet-cross" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12"/></svg>
                  Auto PDF-to-flashcard generation
                </li>
              </ul>
              
              <button 
                onClick={() => { setView('login'); setIsSignUp(true); }}
                className="btn-pricing-cta"
              >
                Get Started Free
              </button>
            </div>

            {/* Card 2: Pro (Premium Highlighted Card) */}
            <div className="pricing-card premium">
              <div className="premium-badge">Most Popular</div>
              <div className="pricing-tier">Pro</div>
              <h3 className="tier-name">Smart Scholar</h3>
              <div className="price-container">
                <span className="currency">$</span>
                <span className="price">{billingPeriod === 'monthly' ? '8' : '6'}</span>
                <span className="period">/mo</span>
              </div>
              <p className="tier-desc">Advanced AI planning tools to maximize grades.</p>
              
              <ul className="tier-features">
                <li>
                  <svg className="bullet-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                  <strong>Unlimited</strong> active schedules
                </li>
                <li>
                  <svg className="bullet-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                  Dynamic AI schedule builder
                </li>
                <li>
                  <svg className="bullet-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                  PDF to Flashcards generation
                </li>
                <li>
                  <svg className="bullet-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                  Spaced Repetition reminders
                </li>
                <li>
                  <svg className="bullet-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                  Full focus room collaborations
                </li>
              </ul>
              
              <button 
                className="btn-pricing-cta btn-pro" 
                onClick={() => { setView('login'); setIsSignUp(true); }}
              >
                Go Pro Now
              </button>
            </div>

            {/* Card 3: Team */}
            <div className="pricing-card">
              <div className="pricing-tier">Cohort</div>
              <h3 className="tier-name">Study Group</h3>
              <div className="price-container">
                <span className="currency">$</span>
                <span className="price">{billingPeriod === 'monthly' ? '24' : '18'}</span>
                <span className="period">/mo</span>
              </div>
              <p className="tier-desc">Perfect for study groups, cohorts, and project teams.</p>
              
              <ul className="tier-features">
                <li>
                  <svg className="bullet-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                  Up to 5 student members
                </li>
                <li>
                  <svg className="bullet-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                  Shared calendar integration
                </li>
                <li>
                  <svg className="bullet-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                  Group focus goals & streaks
                </li>
                <li>
                  <svg className="bullet-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                  Priority customer support
                </li>
                <li>
                  <svg className="bullet-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                  Detailed group grade analytics
                </li>
              </ul>
              
              <button 
                className="btn-pricing-cta"
                onClick={() => { setView('login'); setIsSignUp(true); }}
              >
                Buy Cohort Plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="faq-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Clarifications</div>
            <h2>Frequently Asked Questions</h2>
            <p>Need more details? Here are some answers to common inquiries from students.</p>
          </div>

          <div className="faq-accordion-list">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx} 
                  className={`faq-item ${isOpen ? 'open' : ''}`}
                >
                  <button 
                    className="faq-question-btn"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <span className="faq-icon-indicator">
                      {isOpen ? '−' : '+'}
                    </span>
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

      {/* FINAL CALL TO ACTION (CTA) & NEWSLETTER */}
      <section className="cta-footer-section">
        <div className="cta-glow"></div>
        <div className="container cta-footer-inner">
          <div className="cta-box">
            <h2>Ready to transform your study habits?</h2>
            <p>Get started today for free. No credit card required. Upgrade when you are ready to take your grades to the top tier.</p>
            <div className="cta-form-container">
              <form onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing to our waitlist! Weekly planning tips are on their way."); }}>
                <input 
                  type="email" 
                  placeholder="Enter your student email..." 
                  required 
                  className="cta-input-email"
                />
                <button type="submit" className="cta-btn-submit">Subscribe</button>
              </form>
            </div>
            <span className="subtext-note">✨ Join over 12,000+ students on our monthly learning newsletter.</span>
          </div>

          {/* FOOTER */}
          <footer className="footer-links-grid">
            <div className="footer-col brand-col">
              <div className="footer-logo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="6" fill="url(#logoGrad2)" />
                  <path d="M7 11.5L10 14.5L17 7.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs>
                    <linearGradient id="logoGrad2" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#8B5CF6"/>
                      <stop offset="1" stopColor="#EC4899"/>
                    </linearGradient>
                  </defs>
                </svg>
                <span>SmartStudy</span>
              </div>
              <p>Developing tools that empower the next generation of academic scholars, innovators, and leaders.</p>
            </div>

            <div className="footer-col">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#demo">Session Generator</a>
              <a href="#pricing">Pricing</a>
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
              <a href="#">About Us</a>
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

export default App;
