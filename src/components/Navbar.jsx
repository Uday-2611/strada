"use client"

import React from 'react'
import client from '@/api/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const Navbar = () => {
    const router = useRouter()

    return (
        <div className='w-full bg-white border-b border-gray-200 shadow-sm'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center h-16'>
                    <div className='flex items-center'>
                        <h1 className='text-2xl font-bold text-blue-600 cursor-pointer' onClick={() => router.push('/dashboard')}>
                            Strada
                        </h1>
                    </div>
                    <div>
                        <ul className='flex items-center gap-8'>
                            
                            <li 
                                onClick={() => router.push('/vehicles')}
                                className='text-gray-600 hover:text-blue-600 cursor-pointer transition-colors duration-200'
                            >
                                Vehicles
                            </li>
                            <li 
                                onClick={() => router.push('/bookings')}
                                className='text-gray-600 hover:text-blue-600 cursor-pointer transition-colors duration-200'
                            >
                                Bookings
                            </li>
                            <li 
                                onClick={() => router.push("/profile")}
                                className='text-gray-600 hover:text-blue-600 cursor-pointer transition-colors duration-200'
                            >
                                Profile
                            </li>
                            <Button 
                                onClick={() => {
                                    client.auth.signOut();
                                }}
                                className='bg-red-600 text-white hover:bg-red-700 hover:text-white'
                            >
                                Sign Out
                            </Button>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
