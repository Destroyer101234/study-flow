import React, { useEffect, useRef } from 'react';

// Main App component
const App = () => {
    // A ref to hold the observer instance across renders
    const observer = useRef(null);

    // Effect to inject CSS and set up animations on component mount
    useEffect(() => {
        // CSS as a string
        const css = `
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
                opacity: 0;
                animation: fadeIn 1s ease-out forwards;
                max-width: 900px;
                margin: 0 auto;
                text-align: center;
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

        // Create and inject a style tag
        const styleTag = document.createElement('style');
        styleTag.innerHTML = css;
        document.head.appendChild(styleTag);

        // Set up the IntersectionObserver for scroll-in animations
        const observerOptions = {
            threshold: 0.2
        };

        observer.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.current.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const elementsToAnimate = document.querySelectorAll('.scroll-animate');
        elementsToAnimate.forEach(element => {
            observer.current.observe(element);
        });

        // Cleanup function
        return () => {
            document.head.removeChild(styleTag);
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, []);

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
        <div className="body">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Master Your Schedule. Conquer Your Goals.
                    </h1>
                    <p className="hero-subtitle">
                        Study Flow is the smart new way to organize, plan, and succeed.
                    </p>
                    <a href="#" className="hero-cta">
                        Get Started
                    </a>
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

export default App;
