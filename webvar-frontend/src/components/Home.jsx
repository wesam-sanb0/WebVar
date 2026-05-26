import React from 'react'
import { motion } from 'framer-motion'
import { MoveRight } from 'lucide-react';
import { Link } from 'react-router-dom';
const Home = () => {
    
    const bracketAnimation = {
        opacity: [0, 1, 0], 
        transition: {
            repeat: Infinity,
            duration: 2,
            ease: 'easeInOut', 
        },
    };


    return (
        <div className="w-full flex-1 flex flex-col items-center justify-center text-center gap-10 px-6">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 flex items-center gap-2">
                <motion.span
                    className="text-cyan-400"
                    animate={bracketAnimation}
                >
                    {' ['}
                </motion.span>
                Hello users!
                <motion.span
                    className="text-cyan-400"
                    animate={bracketAnimation}
                >
                    {' ]'}
                </motion.span>
            </h1>

            <p className="text-lg md:text-xl text-white max-w-4xl mb-30 font-bold">
                Shop with confidence! We compare prices and verify the security of shopping websites to
                ensure you get the best deals safely and easily.
            </p>


            <div className="cards-container">
                <div className="card">
                    <Link className="card1" to="/price-comparison">
                        <p>Price Comparison</p>
                        <p className="small">Price comparison for the same product</p>
                        <div className="go-corner">
                            <div className="go-arrow">→</div>
                        </div>
                    </Link>
                </div>

                <div className="card">
                    <Link className="card2" to="/secure-shopping">
                        <p>Secure Shopping</p>
                        <p className="small">Thorough website security check by Scanne</p>
                        <div className="go-corner">
                            <div className="go-arrow">→</div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;