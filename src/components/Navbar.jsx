"use client"

import React, { useState } from 'react'
import client from '@/api/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
    const router = useRouter()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <div className='w-full bg-white border-b border-gray-200 shadow-sm'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center h-16'>
                    <div className='flex items-center'>
                        <h1 className='text-xl sm:text-2xl font-bold text-blue-600 cursor-pointer' onClick={() => router.push('/dashboard')}>
                            Strada
                        </h1>
                    </div>
                    {/* Desktop Menu */}
                    <div className='hidden sm:block'>
                        <ul className='flex items-center gap-4 md:gap-8'>
                            <li 
                                onClick={() => router.push('/vehicles')}
                                className='text-sm sm:text-base text-gray-600 hover:text-blue-600 cursor-pointer transition-colors duration-200'
                            >
                                Vehicles
                            </li>
                            <li 
                                onClick={() => router.push('/bookings')}
                                className='text-sm sm:text-base text-gray-600 hover:text-blue-600 cursor-pointer transition-colors duration-200'
                            >
                                Bookings
                            </li>
                            <li 
                                onClick={() => router.push("/profile")}
                                className='text-sm sm:text-base text-gray-600 hover:text-blue-600 cursor-pointer transition-colors duration-200'
                            >
                                Profile
                            </li>
                            <Button 
                                onClick={() => {
                                    client.auth.signOut();
                                }}
                                className='text-sm sm:text-base bg-red-600 text-white hover:bg-red-700 hover:text-white'
                            >
                                Sign Out
                            </Button>
                        </ul>
                    </div>
                    {/* Mobile Menu Button */}
                    <button 
                        className='sm:hidden p-2'
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <X className="h-6 w-6 text-gray-600" />
                        ) : (
                            <Menu className="h-6 w-6 text-gray-600" />
                        )}
                    </button>
                </div>
                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className='sm:hidden border-t border-gray-200'>
                        <ul className='py-2 space-y-2'>
                            <li 
                                onClick={() => {
                                    router.push('/vehicles');
                                    setIsMenuOpen(false);
                                }}
                                className='px-4 py-2 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors duration-200'
                            >
                                Vehicles
                            </li>
                            <li 
                                onClick={() => {
                                    router.push('/bookings');
                                    setIsMenuOpen(false);
                                }}
                                className='px-4 py-2 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors duration-200'
                            >
                                Bookings
                            </li>
                            <li 
                                onClick={() => {
                                    router.push("/profile");
                                    setIsMenuOpen(false);
                                }}
                                className='px-4 py-2 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors duration-200'
                            >
                                Profile
                            </li>
                            <li className='px-4 py-2'>
                                <Button 
                                    onClick={() => {
                                        client.auth.signOut();
                                        setIsMenuOpen(false);
                                    }}
                                    className='w-full bg-red-600 text-white hover:bg-red-700 hover:text-white'
                                >
                                    Sign Out
                                </Button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Navbar
