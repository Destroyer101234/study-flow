import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
} from 'firebase/auth';
import { 
    getFirestore, 
    collection, 
    onSnapshot, 
    addDoc, 
    query, 
    doc, 
    updateDoc, 
    deleteDoc 
} from 'firebase/firestore';
import { Book, Mail, AtSign, Loader, LogOut, CheckCircle, PieChart, Calendar } from 'lucide-react';

// Firebase configuration provided by the user
const firebaseConfig = {
    apiKey: "AIzaSyC6ckPIKzUwp1BrT3chjaOc5T-27KA_oZc",
    authDomain: "study-flow-2ba2d.firebaseapp.com",
    projectId: "study-flow-2ba2d",
    storageBucket: "study-flow-2ba2d.firebasestorage.app",
    messagingSenderId: "969213960063",
    appId: "1:969213960063:web:8ebbdbc8f49ef067ba444a",
    measurementId: "G-X4RP76D7DC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Injected CSS for the application
const appCss = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
    :root {
        --dark-bg: #0c0e1a;
        --dark-blue: #1E3A8A;
        --subtle-blue: #102048;
        --lime-green: #BEF264;
    }

    body {
        font-family: 'Inter', sans-serif;
        background-color: var(--dark-bg);
        color: white;
        margin: 0;
        padding: 0;
        scroll-behavior: smooth;
    }
    
    /* General styles for the entire app */
    .app-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    .main-content-wrapper {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }

    /* Landing Page Styles */
    .hero-section {
        height: 100vh;
        width: 100%;
        background-color: var(--dark-blue);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        text-align: center;
    }

    .hero-content {
        max-width: 900px;
        margin: 0 auto;
        text-align: center;
        animation: fadeIn 1s ease-out forwards;
    }

    .hero-title {
        font-size: clamp(2.5rem, 6vw, 4.5rem);
        font-weight: 800;
        color: var(--lime-green);
        letter-spacing: -0.05em;
        line-height: 1.1;
    }

    .hero-subtitle {
        font-size: clamp(1.25rem, 2.5vw, 1.5rem);
        color: rgba(255, 255, 255, 0.7);
        font-weight: 500;
        margin-top: 2rem;
        opacity: 0;
        animation: slideUp 1s ease-out forwards 0.5s;
    }
    
    .hero-cta {
        display: inline-block;
        padding: 1rem 2rem;
        margin-top: 1.5rem;
        background-color: var(--lime-green);
        color: var(--dark-blue);
        font-weight: bold;
        border-radius: 9999px; /* rounded-full */
        text-decoration: none;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease-in-out;
        transform: translateY(20px) scale(1);
        opacity: 0;
        animation: slideUp 1s ease-out forwards 1s;
    }
    
    .hero-cta:hover {
        background-color: white;
        transform: scale(1.05);
    }

    .features-section {
        min-height: 100vh;
        padding: 6rem 1.5rem;
        width: 100%;
        background-color: var(--dark-bg);
    }

    .container {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 1.5rem;
    }

    .features-header {
        text-align: center;
        margin-bottom: 4rem;
    }

    .features-title, .features-subtitle {
        opacity: 0;
    }

    .features-title {
        font-size: clamp(2.25rem, 5vw, 3rem);
        font-weight: 800;
        color: white;
    }

    .features-subtitle {
        margin-top: 1rem;
        font-size: clamp(1rem, 2vw, 1.5rem);
        color: rgba(255, 255, 255, 0.7);
        max-width: 48rem;
        margin-left: auto;
        margin-right: auto;
    }

    .features-grid {
        display: grid;
        grid-template-columns: repeat(1, minmax(0, 1fr));
        gap: 2rem;
    }

    @media (min-width: 768px) {
        .features-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @media (min-width: 1024px) {
        .features-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }
    }

    .feature-card {
        background-color: var(--subtle-blue);
        padding: 2rem;
        border-radius: 1.5rem; /* rounded-2xl */
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        transition: all 0.3s ease-in-out;
        opacity: 0;
        transform: translateY(20px);
    }

    .feature-card:hover {
        transform: scale(1.05);
        box-shadow: 0 20px 25px -5px rgba(190, 242, 100, 0.1), 0 10px 10px -5px rgba(190, 242, 100, 0.04);
    }

    .feature-icon {
        color: var(--lime-green);
        margin-bottom: 1.5rem;
        font-size: 3rem;
        display: block;
    }
    
    .feature-card:hover .feature-icon.bounce {
        animation: bounce 1s infinite;
    }
    .feature-card:hover .feature-icon.spin {
        animation: spin 2s linear infinite;
    }
    .feature-card:hover .feature-icon.pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .feature-title {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--lime-green);
        margin-bottom: 0.5rem;
    }

    .feature-description {
        color: rgba(255, 255, 255, 0.8);
    }

    /* Modal Styles */
    .auth-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(5px);
    }

    .auth-modal-content {
        background-color: var(--subtle-blue);
        border-radius: 1rem;
        padding: 2.5rem;
        width: 90%;
        max-width: 450px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        position: relative;
    }
    
    .auth-modal-close-button {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        transition: color 0.2s;
    }

    .auth-modal-close-button:hover {
        color: var(--lime-green);
    }

    .auth-title {
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--lime-green);
        text-align: center;
        margin-bottom: 0.5rem;
    }
    
    .auth-subtitle {
        font-size: 1rem;
        text-align: center;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 2rem;
    }

    .auth-input-container {
        position: relative;
        margin-bottom: 1rem;
    }
    
    .auth-input-icon {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: rgba(255, 255, 255, 0.5);
    }

    .auth-input {
        width: 100%;
        padding: 0.75rem 0.75rem 0.75rem 2.5rem;
        border-radius: 0.5rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background-color: rgba(0, 0, 0, 0.3);
        color: white;
        transition: border-color 0.3s;
    }

    .auth-input:focus {
        outline: none;
        border-color: var(--lime-green);
        box-shadow: 0 0 0 2px rgba(190, 242, 100, 0.3);
    }
    
    .auth-submit-button {
        width: 100%;
        padding: 0.75rem;
        border-radius: 0.5rem;
        background-color: var(--lime-green);
        color: var(--dark-bg);
        font-weight: 700;
        border: none;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .auth-submit-button:hover:not(:disabled) {
        background-color: white;
    }
    
    .auth-submit-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .auth-divider {
        display: flex;
        align-items: center;
        text-align: center;
        margin: 1.5rem 0;
    }

    .auth-divider-line {
        flex: 1;
        height: 1px;
        background-color: rgba(255, 255, 255, 0.2);
    }

    .auth-divider-text {
        padding: 0 1rem;
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.875rem;
    }

    .google-sign-in-button {
        width: 100%;
        padding: 0.75rem;
        border-radius: 0.5rem;
        background-color: #4285F4;
        color: white;
        font-weight: 700;
        border: none;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .google-sign-in-button:hover:not(:disabled) {
        background-color: #357ae8;
    }

    .google-icon {
        width: 1.5rem;
        height: 1.5rem;
        margin-right: 0.5rem;
    }
    
    .auth-toggle-view-button {
        background: none;
        border: none;
        color: var(--lime-green);
        text-decoration: underline;
        cursor: pointer;
        margin-top: 1rem;
        width: 100%;
        text-align: center;
    }
    
    .auth-toggle-view-button:hover {
        color: white;
    }
    
    .auth-loader {
        animation: spin 1s linear infinite;
    }

    /* Dashboard Styles */
    .dashboard-container {
        padding: 2rem;
        background-color: var(--dark-bg);
        min-height: 100vh;
    }
    
    .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }
    
    .dashboard-title {
        font-size: 2.5rem;
        font-weight: 800;
        color: var(--lime-green);
    }
    
    .user-info {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .sign-out-button {
        background-color: var(--subtle-blue);
        color: white;
        border: 1px solid var(--lime-green);
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .sign-out-button:hover {
        background-color: var(--lime-green);
        color: var(--dark-bg);
    }

    /* Keyframe Animations */
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes bounce {
        0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
        50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: .5; }
    }
`;

// App Component
const App = () => {
    const [user, setUser] = useState(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    
    // Custom hook for scroll-in animations
    const useAnimateOnScroll = (threshold = 0.2) => {
        const observer = useRef(null);

        useEffect(() => {
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        observer.current.unobserve(entry.target);
                    }
                });
            }, { threshold });

            const elements = document.querySelectorAll('.scroll-animate');
            elements.forEach(element => {
                observer.current.observe(element);
            });

            return () => {
                if (observer.current) {
                    observer.current.disconnect();
                }
            };
        }, []);
    };
    
    // Effect to inject CSS and set up auth listener
    useEffect(() => {
        const styleTag = document.createElement('style');
        styleTag.innerHTML = appCss;
        document.head.appendChild(styleTag);
        
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => {
            document.head.removeChild(styleTag);
            unsubscribe();
        };
    }, []);

    useAnimateOnScroll();

    return (
        <div className="app-container">
            {user ? (
                <Dashboard user={user} />
            ) : (
                <LandingPage setShowAuthModal={setShowAuthModal} />
            )}
            <AuthUI isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </div>
    );
};

// Landing Page Component
const LandingPage = ({ setShowAuthModal }) => {
    // Reusable component for feature cards
    const FeatureCard = ({ icon, title, description, iconClass }) => {
        return (
            <div className="feature-card scroll-animate">
                <div className={`feature-icon ${iconClass}`}>
                    {icon}
                </div>
                <h3 className="feature-title">{title}</h3>
                <p className="feature-description">{description}</p>
            </div>
        );
    };

    return (
        <div className="main-content-wrapper">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Master Your Schedule. Conquer Your Goals.
                    </h1>
                    <p className="hero-subtitle">
                        Study Flow is the smart new way to organize, plan, and succeed.
                    </p>
                    <button onClick={() => setShowAuthModal(true)} className="hero-cta">
                        Get Started
                    </button>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="features-header">
                        <h2 className="features-title scroll-animate">
                            Features Engineered for Success
                        </h2>
                        <p className="features-subtitle scroll-animate">
                            From intelligent breakdowns to visual progress tracking, we've got you covered.
                        </p>
                    </div>

                    {/* Feature Grid */}
                    <div className="features-grid">
                        <FeatureCard
                            icon="💡"
                            title="AI Task Breakdown"
                            description="Turn any large project into a simple, step-by-step plan instantly. Our AI assistant helps you tackle complex tasks with confidence."
                            iconClass="bounce"
                        />
                        <FeatureCard
                            icon="📈"
                            title="Progress Analytics"
                            description="Stay motivated by visualizing your progress. See your completed tasks and pending goals with intuitive, clear charts."
                            iconClass="spin"
                        />
                        <FeatureCard
                            icon="🗓️"
                            title="Dynamic Planner"
                            description="Effortlessly organize your week. Drag, drop, and reschedule tasks to fit your life, ensuring you always stay on top of your priorities."
                            iconClass="pulse"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

// Auth UI Component (Modal)
const AuthUI = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            onClose();
        } catch (error) {
            console.error(error);
            setError("Failed to sign in with Google. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleEmailPasswordAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            onClose();
        } catch (error) {
            console.error(error);
            setError("An error occurred during authentication. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };
    
    const iconStyle = {
        width: '1.5rem',
        height: '1.5rem',
        color: 'rgba(255, 255, 255, 0.5)'
    };
    
    return (
        <div className="auth-modal-overlay">
            <div className="auth-modal-content">
                <button className="auth-modal-close-button" onClick={onClose}>&times;</button>
                <h1 className="auth-title">{isLogin ? 'Sign in to Study Flow' : 'Create Your Account'}</h1>
                <p className="auth-subtitle">{isLogin ? 'Welcome back! Get organized and focused.' : 'Get started with a more productive study routine.'}</p>
                
                {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}
                
                <button onClick={handleGoogleSignIn} className="google-sign-in-button" disabled={loading}>
                    <svg className="google-icon" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.6 12.8c0-.7-.1-1.3-.2-1.9H12v3.6h6.4c-.3 1.8-1.5 3.3-3.2 4.3v2.8h2.7c1.6-1.5 2.5-3.8 2.5-6.8z" fill="#4285F4"/>
                        <path d="M12 23c3.2 0 5.9-1.1 7.9-3v-2.8c-1.1.7-2.5 1.1-4.2 1.1-3.2 0-5.9-2.1-6.8-4.9h-2.8v2.2c1.7 3.5 5.2 6 9.7 6z" fill="#34A853"/>
                        <path d="M4.1 14.8c-.4-1.1-.6-2.3-.6-3.7s.2-2.6.6-3.7V5.2H1.3c-.9 1.8-1.4 3.9-1.4 6.8s.5 5 1.4 6.8l2.8-2.2z" fill="#FBBC05"/>
                        <path d="M12 4.4c1.8 0 3.3.6 4.6 1.8l2.3-2.3C16.9 1.6 14.6.4 12 .4c-4.5 0-8 2.5-9.7 6l2.8 2.2c.9-2.8 3.6-4.9 6.8-4.9z" fill="#EA4335"/>
                    </svg>
                    <span>Sign {isLogin ? 'in' : 'up'} with Google</span>
                </button>
                
                <div className="auth-divider">
                    <div className="auth-divider-line"></div>
                    <span className="auth-divider-text">or</span>
                </div>

                <form onSubmit={handleEmailPasswordAuth}>
                    <div className="auth-input-container">
                        <Mail style={iconStyle} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="auth-input"
                        />
                    </div>
                    <div className="auth-input-container">
                        <AtSign style={iconStyle} />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="auth-input"
                        />
                    </div>
                    <button type="submit" className="auth-submit-button" disabled={loading}>
                        {loading ? (
                            <Loader className="auth-loader" style={iconStyle} />
                        ) : (
                            isLogin ? 'Sign In' : 'Sign Up'
                        )}
                    </button>
                </form>
                
                <button onClick={() => setIsLogin(!isLogin)} className="auth-toggle-view-button">
                    {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
                </button>
            </div>
        </div>
    );
};

// Dashboard Placeholder Component
const Dashboard = ({ user }) => {
    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1 className="dashboard-title">Welcome to Study Flow</h1>
                <div className="user-info">
                    <p>User: {user.uid}</p>
                    <button onClick={() => signOut(auth)} className="sign-out-button">
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </header>
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>This is your dashboard. Future features like a task planner and reports will go here.</p>
        </div>
    );
};

export default App;
