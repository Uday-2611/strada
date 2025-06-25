'use client';

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlusCircle, ListOrdered, History, ArrowLeftCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const AdminSidebar = () => {
    const pathname = usePathname();

    const links = [
        { href: "/admin/dashboard", text: "Admin Overview", icon: LayoutDashboard },
        { href: "/admin/addProduct", text: "Add Vehicle", icon: PlusCircle },
        { href: "/admin/activeOrders", text: "Current Bookings", icon: ListOrdered },
        { href: "/admin/allOrders", text: "Booking History", icon: History },
    ];

    return (
        <div className='bg-gray-900 text-white w-full h-full p-4 flex flex-col justify-between'>
            <div>
                <div className='flex items-center gap-2 mb-8'>
                    <Image src="/logo.png" alt="Strada" width={40} height={40} />
                    <h1 className='text-2xl font-bold'>Strada</h1>
                </div>
                <div className='flex flex-col gap-2'>
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-800",
                                { "bg-gray-800 text-white": pathname === link.href }
                            )}
                        >
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
        </div>
    )
}

export default AdminSidebar;
