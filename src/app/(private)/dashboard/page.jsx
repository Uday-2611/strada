"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import ScrollStack from '@/components/ScrollStack'
import { useRouter } from 'next/navigation'
import { InfiniteMovingCards } from '@/components/infinite-moving-cards'

const testimonials = [
    {
        name: "Alex Johnson",
        title: "Weekend Renter",
        quote: "The booking process was incredibly smooth and the car was in perfect condition. Made our weekend trip so much better!",
        avatar: "https://i.pravatar.cc/150?u=alexjohnson",
    },
    {
        name: "Samantha Miller",
        title: "Business Traveler",
        quote: "Reliable service and professional staff. I rent for business frequently and Strada has never let me down. Highly recommend.",
        avatar: "https://i.pravatar.cc/150?u=samanthamiller",
    },
    {
        name: "David Chen",
        title: "Adventure Seeker",
        quote: "Rented a bike for a solo trip through the mountains. The equipment was top-notch and the support team was very helpful.",
        avatar: "https://i.pravatar.cc/150?u=davidchen",
    },
    {
        name: "Jessica Taylor",
        title: "First-Time Renter",
        quote: "As a first-time renter, I was nervous, but Strada made it so easy. The instructions were clear, and the car was perfect for my needs. I'll be back!",
        avatar: "https://i.pravatar.cc/150?u=jessicataylor",
    },
    {
        name: "Mark Wilson",
        title: "City Commuter",
        quote: "The monthly bike rental is a game-changer for my commute. It's affordable, reliable, and much more fun than taking the bus. Great service!",
        avatar: "https://i.pravatar.cc/150?u=markwilson",
    },
];

const Dashboard = () => {
    const router = useRouter();
    const [scale, setScale] = useState(0.7);

    useEffect(() => {
        const handleScroll = () => {
            const maxScroll = 300;
            const scrollY = window.scrollY;
            const progress = Math.min(scrollY / maxScroll, 1);
            const newScale = 0.7 + 0.45 * progress;
            setScale(newScale);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className='w-full min-h-screen bg-white'>
            {/* Hero Section */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
                <div className='flex flex-col lg:flex-col mt-14 gap-6 items-center m-auto '>
                    <div className=' text-center space-y-8'>
                        <h1 className='text-4xl sm:text-6xl md:text-8xl [font-family:var(--SupremeBold)] text-gray-900 leading-tight uppercase'>
                            Your Journey, Your Wheels.
                        </h1>
                        <p className='text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed mt-2 sm:mt-4'>
                            Unlock your next adventure with fast, secure rentals for cars and bikes. Seamlessly book your perfect ride for any journey, available anytime and anywhere with just a few clicks.
                        </p>
                        <div className='flex space-x-4'>
                            <Button className='text-white px-8 py-6 text-lg m-auto h-12' onClick={() => router.push('/vehicles')}>
                                Get Started
                            </Button>
                        </div>
                    </div>
                    <div className='lg:w-[90%] w-full'>
                        <div className='w-full aspect-[16/7] rounded-2xl relative overflow-hidden'>
                            <img
                                src="/dashboard.jpeg"
                                alt="Strada Dashboard"
                                className="w-full h-full object-cover transition-transform rounded-2xl duration-600"
                                style={{ 
                                    transform: `scale(${scale})`, 
                                    transitionTimingFunction: 'linear',
                                    transitionDuration: '600ms'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className='py-20 px-4 sm:px-6 lg:px-8 '>
                <div className='max-w-7xl mx-auto flex flex-col gap-20'>
                    {/* About Section */}
                    <div className='flex flex-col lg:flex-row gap-12 items-start mt-24'>
                        <div className='w-full lg:w-1/3 space-y-4'>
                            <Badge>
                                About Us
                            </Badge>
                            <h2 className='text-4xl md:text-4xl font-bold text-gray-900'>
                                Your Trusted Partner in Mobility
                            </h2>
                        </div>
                        <div className='w-full lg:w-2/3'>
                            <p className='text-gray-600 text-lg leading-relaxed'>
                                At Strada, we are dedicated to providing a seamless and reliable rental experience. Our diverse fleet of cars and bikes is meticulously maintained to ensure your safety and comfort on the road. We believe in making travel accessible, enjoyable, and hassle-free for everyone. Our mission is to empower you to explore with confidence, offering a vehicle for every occasion—from daily commutes to adventurous getaways. With a focus on exceptional customer service and transparent pricing, we handle the details so you can enjoy the journey.
                            </p>
                        </div>
                    </div>

                    {/* ScrollStack Section */}
                    <div className='w-full space-y-12 mt-24'>
                        <div className='text-center space-y-4'>
                            <Badge>
                                Our Collection
                            </Badge>
                            <h2 className='text-4xl md:text-4xl font-bold text-gray-900'>
                                Find Your Perfect Ride
                            </h2>
                            <p className='text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto'>
                                From luxury sedans for a classy night out to rugged bikes for an off-road adventure, we have the perfect vehicle for any occasion. Browse our collection and book your next journey today.
                            </p>
                        </div>
                        <ScrollStack />
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className='bg-gray-50 py-20'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24'>
                    <div className='flex flex-col lg:flex-row gap-12'>
                        <div className='lg:w-1/2 space-y-6'>
                            <Badge>
                                FAQ
                            </Badge>
                            <h2 className='text-4xl font-bold text-gray-900'>
                                Answering your questions
                            </h2>
                            <p className='text-gray-600'>Got more questions? Send us your enquiry below</p>
                        </div>
                        <div className='lg:w-1/2'>
                            <Accordion type="single" collapsible className='w-full'>
                                <AccordionItem value="item-1" className='border-b border-gray-200'>
                                    <AccordionTrigger className='text-lg font-medium text-gray-900 hover:no-underline'>
                                        What documents do I need to rent a vehicle?
                                    </AccordionTrigger>
                                    <AccordionContent className='text-gray-600'>
                                        You'll need a valid driver's license, proof of identity (passport/ID), proof of address, and a credit card for the security deposit. Additional documents may be required for international customers.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2" className='border-b border-gray-200'>
                                    <AccordionTrigger className='text-lg font-medium text-gray-900 hover:no-underline'>
                                        Is insurance included in the rental price?
                                    </AccordionTrigger>
                                    <AccordionContent className='text-gray-600'>
                                        Basic insurance is included in all rental prices. However, we offer additional coverage options for comprehensive protection. We recommend reviewing our insurance packages to choose the best coverage for your needs.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3" className='border-b border-gray-200'>
                                    <AccordionTrigger className='text-lg font-medium text-gray-900 hover:no-underline'>
                                        What is the cancellation policy?
                                    </AccordionTrigger>
                                    <AccordionContent className='text-gray-600'>
                                        Free cancellation is available up to 48 hours before your scheduled pickup. Cancellations within 48 hours may be subject to a fee. Please refer to your booking terms for specific details.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-4" className='border-b border-gray-200'>
                                    <AccordionTrigger className='text-lg font-medium text-gray-900 hover:no-underline'>
                                        What happens if I return the vehicle late?
                                    </AccordionTrigger>
                                    <AccordionContent className='text-gray-600'>
                                        Late returns may incur additional hourly or daily charges. We recommend contacting us immediately if you anticipate a late return to discuss options.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-5" className='border-b border-gray-200'>
                                    <AccordionTrigger className='text-lg font-medium text-gray-900 hover:no-underline'>
                                        Do you offer delivery services?
                                    </AccordionTrigger>
                                    <AccordionContent className='text-gray-600'>
                                        Yes, we offer vehicle delivery and pickup services within city limits for an additional fee. Contact us for availability and rates in your area.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className='py-20'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center mt-24'>
                    <h1 className='text-4xl md:text-4xl font-bold text-gray-900 text-center mb-12'>
                        Trusted by thousands of users nationwide
                    </h1>
                    <InfiniteMovingCards items={testimonials} direction="right" speed="slow" />
                </div>
            </div>

        </div>
    )
}



export default Dashboard
