"use client";

import React from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import InfiniteScroll from "../components/InfiniteScroll";
import { Button } from "../components/ui/button";

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
        <div className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gray-50 overflow-hidden">
            
            <div className="relative z-20 flex flex-col items-center justify-center w-full h-1/3 lg:h-full lg:w-full p-8 lg:p-20 gap-4">
                <h1 className="text-7xl lg:text-9xl font-bold mb-2 text-black text-center max-w-[12ch]">Strada</h1>
                <p className="text-lg text-gray-900 mb-2 text-center max-w-md">Your journey, simplified.</p>
                <Button onClick={handleGetStarted} className="px-8 py-4 text-lg font-semibold" disabled={loading} size="lg" >
                    Get Started
                </Button>
            </div>

            <div className="relative w-full h-[38rem] lg:h-full items-center justify-center z-0 hidden lg:flex">
                <InfiniteScroll items={images} width="40rem" maxHeight="100vh" itemMinHeight={340} autoplay autoplaySpeed={0.7} pauseOnHover={false} isTilted={true} tiltDirection="left" />
            </div>
        </div>
    );
};

export default FrontPage; 