"use client"

import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import useAuth from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const PrivatePagesLayout = ({ children }) => {

    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push("/")
        }
    }, [user, loading])


    if (loading || !user) return null

    return (
        <>
            <Navbar />
            <div className="w-screen overflow-x-hidden overflow-y-auto">
                {children}
            </div>
            <Footer />
        </>
    )
}

export default PrivatePagesLayout
