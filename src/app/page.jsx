"use client";

import React from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

const images = [
    { content: <img src="/sliderImages/slider1.jpg" alt="Slider 1" className="w-full h-full object-cover rounded-[15px]" /> },
    { content: <img src="/sliderImages/slider2.jpg" alt="Slider 2" className="w-full h-full object-cover rounded-[15px]" /> },
    { content: <img src="/sliderImages/slider3.jpg" alt="Slider 3" className="w-full h-full object-cover rounded-[15px]" /> },
    { content: <img src="/sliderImages/slider4.jpg" alt="Slider 4" className="w-full h-full object-cover rounded-[15px]" /> },
    { content: <img src="/sliderImages/slider5.jpg" alt="Slider 5" className="w-full h-full object-cover rounded-[15px]" /> },
];

const FrontPage = () => {
    const router = useRouter();
    const { user, loading } = useAuth();

    const handleGetStarted = () => {
        if (loading) return;
        if (user) {
            router.push("/dashboard");
        } else {
            router.push("/auth");
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
            {/* Background eyeglasses pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-10 w-96 h-96 border border-gray-300 rounded-full transform rotate-12"></div>
                <div className="absolute bottom-20 right-10 w-80 h-80 border border-gray-300 rounded-full transform -rotate-12"></div>
                <div className="absolute top-1/2 left-1/4 w-64 h-64 border border-gray-300 rounded-full transform rotate-45"></div>
            </div>

            {/* Main content */}
            <div className="relative z-10 text-center space-y-8 px-4">
                {/* Logo */}
                <div className="mb-12 flex items-center justify-center space-x-4">
                    <img src="/logoBlack.png" alt="Strada Logo" className="w-16 h-16 object-contain" />
                    <h1 className="text-6xl font-bold text-gray-900 tracking-wider">
                        Strada
                    </h1>
                </div>

                {/* Layered images */}
                <div className="relative w-full max-w-4xl mx-auto mb-12">
                    <div className="grid grid-cols-5 gap-4 transform -rotate-2">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className={`relative transform transition-all duration-500 hover:scale-105 hover:rotate-0 ${
                                    index === 0 ? 'rotate-6 translate-y-4' :
                                    index === 1 ? 'rotate-3 translate-y-2' :
                                    index === 2 ? '' :
                                    index === 3 ? '-rotate-3 -translate-y-2' :
                                    '-rotate-6 -translate-y-4'
                                }`}
                            >
                                <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-2xl">
                                    {image.content}
                                </div>
                                {/* Neon glow effect */}
                                <div className={`absolute inset-0 rounded-2xl shadow-lg ${
                                    index === 0 ? 'shadow-blue-500/30' :
                                    index === 1 ? 'shadow-green-500/30' :
                                    index === 2 ? 'shadow-pink-500/30' :
                                    index === 3 ? 'shadow-purple-500/30' :
                                    'shadow-orange-500/30'
                                }`}></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tagline */}
                <h3 className="text-3xl font-light text-gray-700 tracking-wide mb-8">
                    Your journey simplified
                </h3>

                {/* CTA Button */}
                <button
                    onClick={handleGetStarted}
                    className="group relative px-8 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                    <span className="flex items-center space-x-3">
                        <span>Enter Store</span>
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300">
                            <svg className="w-3 h-3 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </span>
                </button>
            </div>

            {/* Floating neon elements */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-green-400 rounded-full animate-pulse delay-500"></div>
            <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-1500"></div>
        </div>
    );
};

export default FrontPage; 