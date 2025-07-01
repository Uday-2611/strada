'use client';

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlusCircle, ListOrdered, History, ArrowLeftCircle, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const AdminSidebar = () => {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    const links = [
        { href: "/admin/dashboard", text: "Admin Overview", icon: LayoutDashboard },
        { href: "/admin/addProduct", text: "Add Vehicle", icon: PlusCircle },
        { href: "/admin/activeOrders", text: "Current Bookings", icon: ListOrdered },
        { href: "/admin/allOrders", text: "Booking History", icon: History },
    ];

    return (
        <>
            <button className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-900 text-white lg:hidden" onClick={() => setSidebarOpen((open) => !open)} aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"} >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <div className={`fixed inset-0 z-40 bg-black bg-opacity-40 transition-opacity duration-300 ${sidebarOpen ? 'block' : 'hidden'} lg:hidden`} onClick={() => setSidebarOpen(false)} />
            <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 text-white p-4 flex flex-col justify-between transform transition-transform duration-300 lg:static lg:translate-x-0 lg:block ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:w-full lg:h-full`} style={{ boxShadow: sidebarOpen ? '0 0 20px rgba(0,0,0,0.2)' : 'none' }} >
                <div>
                    <div className='flex items-center gap-2 mb-8'>
                        <Image src="/logo.png" alt="Strada" width={40} height={40} />
                        <h1 className='text-2xl font-bold'>Strada</h1>
                    </div>
                    <div className='flex flex-col gap-2'>
                        {links.map((link) => (
                            <Link key={link.href} href={link.href} className={cn( "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-800", { "bg-gray-800 text-white": pathname === link.href } )} onClick={() => setSidebarOpen(false)} >
                                <link.icon className="h-4 w-4" />
                                {link.text}
                            </Link>
                        ))}
                    </div>
                </div>
                <div>
                    <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-800" onClick={() => setSidebarOpen(false)}>
                        <ArrowLeftCircle className="h-4 w-4" />
                        Return to site
                    </Link>
                </div>
            </aside>

            <aside className="hidden lg:block bg-gray-900 text-white w-full h-full p-4 flex flex-col justify-between">
                <div>
                    <div className='flex items-center gap-2 mb-8'>
                        <Image src="/logo.png" alt="Strada" width={40} height={40} />
                        <h1 className='text-2xl font-bold'>Strada</h1>
                    </div>
                    <div className='flex flex-col gap-2'>
                        {links.map((link) => (
                            <Link key={link.href} href={link.href} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-800", { "bg-gray-800 text-white": pathname === link.href })} >
                                <link.icon className="h-4 w-4" />
                                {link.text}
                            </Link>
                        ))}
                    </div>
                </div>
                <div>
                    <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-800">
                        <ArrowLeftCircle className="h-4 w-4" />
                        Return to site
                    </Link>
                </div>
            </aside>
        </>
    )
}

export default AdminSidebar;