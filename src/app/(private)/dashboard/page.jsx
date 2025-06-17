"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import ScrollStack from '@/components/ScrollStack'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const Dashboard = () => {
    const router = useRouter();

    return (
        <div className='w-full min-h-screen bg-white'>
            {/* Hero Section */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
                <div className='flex flex-col lg:flex-row gap-6 items-center'>
                    <div className='lg:w-1/2 space-y-6'>
                        <h1 className='text-6xl font-bold text-gray-900 leading-tight'>
                            Rent. Drive. Explore.
                        </h1>
                        <p className='text-lg text-gray-600 leading-relaxed'>
                            Fast, secure rentals for cars and bikes—book your perfect ride anytime, anywhere with ease.
                        </p>
                        <Button className='text-white px-8 py-6 text-lg' onClick={() => router.push('/vehicles')}>
                            Get Started
                        </Button>
                    </div>
                    <div className='lg:w-1/2'>
                        <div className='bg-gray-900 w-full aspect-square rounded-2xl relative overflow-hidden bg-cover bg-center bg-no-repeat' style={{ backgroundImage: 'url("/dashboard.jpg")' }}>
                            <div className='absolute bottom-8 right-8 w-[280px] p-6 rounded-xl shadow-lg bg-white-300 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-100 '>
                                <div className='flex gap-1 text-yellow-400 mb-3'>
                                    <i className="ri-star-s-fill"></i>
                                    <i className="ri-star-s-fill"></i>
                                    <i className="ri-star-s-fill"></i>
                                    <i className="ri-star-s-fill"></i>
                                    <i className="ri-star-s-fill"></i>
                                </div>
                                <p className='text-white text-sm leading-relaxed'>
                                    Strada has completely transformed how I travel. The seamless booking, quality vehicles, and premium service make it my go-to choice every time.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='py-20'>
                <ScrollStack />
            </div>

            {/* About Section */}
            <div className='bg-gray-50 py-20'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex flex-col lg:flex-row gap-12 items-center'>
                        <div className='lg:w-1/2 space-y-6'>
                            <Badge className='bg-blue-100 text-blue-600 hover:bg-blue-100'>
                                About Us
                            </Badge>
                            <h2 className='text-4xl font-bold text-gray-900'>
                                Modern travel solutions provider
                            </h2>
                        </div>
                        <div className='lg:w-1/2'>
                            <p className='text-gray-600 leading-relaxed'>
                                Welcome to Strada, your trusted rental partner, dedicated to providing reliable vehicles with ease and confidence. With a wide range of bikes and cars for every journey, we take pride in offering a smooth booking experience and dependable rides. Our mission is to keep you moving—whether it's a weekend getaway or a daily commute—with transparent pricing and support you can count on. Let's drive forward together!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className='py-20'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex flex-col lg:flex-row gap-12'>
                        <div className='lg:w-1/2 space-y-6'>
                            <Badge className='bg-blue-100 text-blue-600 hover:bg-blue-100'>
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
        </div>
    )
}

export default Dashboard
