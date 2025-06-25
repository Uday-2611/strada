"use client"

import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import useAuth from '@/hooks/useAuth'
import { useRouter, usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

const PrivatePagesLayout = ({ children }) => {

    const { user, loading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!loading && !user) {
            router.push("/")
        }
    }, [user, loading])


    if (loading || !user) return null

    const isAdminRoute = pathname.startsWith('/admin')

    return (
        <>
            {!isAdminRoute && <Navbar />}
            <div className="w-screen overflow-x-hidden overflow-y-auto">
                {children}
            </div>
            {!isAdminRoute && <Footer />}
        </>
    )
}

export default PrivatePagesLayout
