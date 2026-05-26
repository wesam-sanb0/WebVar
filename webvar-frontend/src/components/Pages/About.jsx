import React, { useState, useEffect, useContext } from 'react';
import { FaAngleDoubleRight, FaAngleDoubleLeft } from 'react-icons/fa';
const About = () => {
    const [isSlideMode, setIsSlideMode] = useState(false);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const slidesContent = [
        {
            title: 'About WebVar',
            content: (
                <>
                    <p className="typewriter" key={1}>
                        Welcome to <span className="highlight-text">WebVar</span>, the modern web browser designed to provide a secure, fast, and seamless browsing experience.
                    </p>
                    <p className="typewriter" key={2}>
                        Our goal is to enhance the way you interact with the internet by offering advanced features that improve security, privacy, and efficiency.
                    </p>
                </>
            ),
        },
        {
            title: 'Why Choose WebVar?',
            content: (
                <>
                    <p className="typewriter" key={3}>• <span className="highlight-text">Enhanced Security:</span> Advanced protection against phishing, malware, and trackers.</p>
                    <p className="typewriter" key={4}>• <span className="highlight-text">Speed & Performance:</span> Experience a fast and responsive browsing environment.</p>
                    <p className="typewriter" key={5}>• <span className="highlight-text">AI Integration:</span> Smart assistance for personalized and secure navigation.</p>
                </>
            ),
        },
        {
            title: 'Join Us Today!',
            content: (
                <>
                    <p className="typewriter" key={6}>
                        Discover a new era of browsing with WebVar—experience unmatched speed, security, and privacy.
                    </p>
                    <p className="typewriter" key={7}>
                        Explore our innovative features designed to simplify your online journey.
                    </p>
                    <p></p>
                </>
            ),
        },
    ];

    // Typewriter animation effect
    useEffect(() => {
        const applyTypewriterAnimation = (container) => {
            const elements = container.querySelectorAll('.typewriter');
            elements.forEach((el) => {
                const fullText = el.getAttribute('data-text') || el.textContent;
                el.textContent = '';
                let i = 0;
                const timer = setInterval(() => {
                    el.textContent += fullText.charAt(i);
                    i++;
                    if (i >= fullText.length) clearInterval(timer);
                }, 50);
            });
        };

        const slideContainer = document.getElementById('singleSlide');
        if (slideContainer && isSlideMode) {
            applyTypewriterAnimation(slideContainer);
        }
    }, [currentSlideIndex, isSlideMode]);

    // Toggle between states
    const handleToggle = () => {
        if (!isSlideMode) {
            setIsSlideMode(true);
            setCurrentSlideIndex(0);
        } else {
            if (currentSlideIndex === slidesContent.length - 1) {
                setIsSlideMode(false);
                setCurrentSlideIndex(0);
            } else {
                setCurrentSlideIndex(currentSlideIndex + 1);
            }
        }
        console.log(isSlideMode,currentSlideIndex);
    };



    return (
        <div style={{ position: 'relative', minHeight: 'calc(100vh - 80px)' }}>
            {/* Welcome Section */}
            <section className="welcome" id="welcome-centered" style={{ position: 'relative', height: '20vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div
                    className="welcome-text"
                    id="welcome-center"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '70px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: 'white',
                        zIndex: 3,
                        opacity: isSlideMode ? 0 : 1,
                        transition: 'opacity 0.5s ease',
                    }}
                >
                    <span className="blinking-braces">[</span>
                    About WebVar!
                    <span className="blinking-braces">]</span>
                </div>
            </section>

            {/* Planet Section */}
            <section className="planet-section" style={{ width: '100%', height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '20px' }}>
                <img
                    src="/planet-animation.gif"
                    alt="Rotating Planet"
                    className="planet full-planet"
                    style={{
                        width: '1100px',
                        height: '1100px',
                        position: 'relative',
                        top: '80%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        transition: 'opacity 0.5s ease',
                        opacity: isSlideMode ? 0 : 1,
                    }}
                    onError={() => console.error('Failed to load planet-animation.gif')}
                />

                <div
                    className="planet-split"
                    style={{
                        position: 'absolute',
                        width: '1100px',
                        height: '1100px',
                        opacity: isSlideMode ? 1 : 0,
                        transition: 'opacity 0.5s ease',
                    }}
                >
                    <img
                        src="/planet-animation.gif"
                        alt="Left Half"
                        className="planet half left"
                        style={{
                            width: '50%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                            position: 'absolute',
                            left: 0,
                            clipPath: 'inset(0 50% 0 0)',
                            transform: isSlideMode ? 'translateX(-30px)' : 'translateX(0)',
                        }}
                        onError={() => console.error('Failed to load planet-animation.gif (left half)')}
                    />
                    <img
                        src="/planet-animation.gif"
                        alt="Right Half"
                        className="planet half right"
                        style={{
                            width: '50%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                            position: 'absolute',
                            right: 0,
                            clipPath: 'inset(0 0 0 50%)',
                            transform: isSlideMode ? 'translateX(30px)' : 'translateX(0)',
                        }}
                        onError={() => console.error('Failed to load planet-animation.gif (right half)')}
                    />
                </div>

                <div
                    className="location-content"
                    style={{
                        position: 'absolute',
                        width: '609px',
                        height: '400px',
                        margin: '0 auto',
                        overflow: 'hidden',
                        opacity: isSlideMode ? 1 : 0,
                        transition: 'opacity 0.5s ease',
                    }}
                >
                    <video autoPlay muted loop className="location-video" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative' }}>
                        <source src="/Cyber-board.mp4" type="video/mp4" />
                        Your browser does not support the video.
                    </video>
                    <div className="location-text" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', padding: '20px', textAlign: 'center', color: 'white' }}>
                        <div className="slide" id="singleSlide" style={{ opacity: 1, transition: 'opacity 0.3s ease' }}>
                            <main className="about-container" style={{ maxWidth: '600px', margin: '0 auto', width: '100%', height: '100%', padding: '20px', lineHeight: 1.6 }}>
                                <h1 className="neon typewriter" data-text={slidesContent[currentSlideIndex]?.title}>{slidesContent[currentSlideIndex]?.title}</h1>
                                {slidesContent[currentSlideIndex]?.content}
                            </main>
                        </div>
                    </div>
                </div>
            </section>

            {/* Toggle Icon */}
            <div
                className="toggle-icon"
                id="toggleIcon"
                onClick={handleToggle}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(90deg, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)',
                    padding: '12px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    zIndex: 200,
                    transition: 'background 0.3s',
                }}
            >
                {isSlideMode && currentSlideIndex === slidesContent.length - 1 ? (
                    <FaAngleDoubleLeft style={{ fontSize: '24px', color: '#00bcd4' }} />
                ) : (
                    <FaAngleDoubleRight style={{ fontSize: '24px', color: '#00bcd4' }} />
                )}
            </div>

            {/* Inline CSS */}
            <style>
                {`
                    .neon {
                        color: #fff;
                        text-shadow: 
                            0 0 5px #fff,
                            0 0 10px #fff,
                            0 0 20px #0ff,
                            0 0 40px #0ff,
                            0 0 80px #0ff;
                        animation: neon-glow 1.5s ease-in-out infinite alternate;
                    }

                    @keyframes neon-glow {
                        from { text-shadow: 0 0 5px #fff; }
                        to { text-shadow: 
                            0 0 10px #fff,
                            0 0 20px #0ff,
                            0 0 30px #0ff,
                            0 0 40px #0ff,
                            0 0 50px #0ff; }
                    }

                    .blinking-braces {
                        animation: blink 1s step-end infinite;
                    }

                    @keyframes blink {
                        50% { opacity: 0; }
                    }

                    .typewriter {
                        overflow: hidden;
                        border-right: .15em solid transparent;
                        margin: 0 auto;
                        letter-spacing: .15em;
                    }

                    .location-text h1 {
                        font-size: 30px;
                        font-weight: bolder;
                        margin-bottom: 1.5rem;
                        text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
                    }

                    .location-text p {
                        font-size: 14px;
                        margin-bottom: 1rem;
                        text-align: center;
                        white-space: normal;
                        word-wrap: break-word;
                    }

                    .highlight-text {
                        color: #00bcd4;
                        font-weight: bold;
                        font-style: italic;
                    }

                    .toggle-icon:hover {
                        background: rgba(0, 0, 0, 0.9);
                    }
                `}
            </style>
        </div>
    );
};

export default About;