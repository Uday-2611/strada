"use client"

import React, { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import useAuth from '@/hooks/useAuth'
import client from '@/api/client'
import { useRouter } from 'next/navigation'

const ProfilePage = () => {
    const { user, loading: authLoading } = useAuth()
    const [profile, setProfile] = useState({
        full_name: '',
        email: '',
        address: '',
        phone: '',
        created_at: ''
    })
    const [passwords, setPasswords] = useState({
        current: '',
        new: ''
    })
    const [loading, setLoading] = useState(true)
    const [bookings, setBookings] = useState([])
    const router = useRouter()

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return
            try {
                setLoading(true)
                const { data: profileData, error: profileError } = await client
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()
                if (profileError) {
                    if (profileError.code === 'PGRST116') {
                        const { error: insertError } = await client
                            .from('profiles')
                            .insert([
                                {
                                    id: user.id,
                                    email: user.email,
                                    created_at: new Date().toISOString(),
                                    updated_at: new Date().toISOString()
                                }
                            ])
                        if (insertError) throw insertError
                        setProfile({ id: user.id, email: user.email, full_name: '', address: '', phone: '', created_at: new Date().toISOString() });
                    } else {
                        throw profileError
                    }
                } else {
                    setProfile({
                        full_name: profileData.full_name || '',
                        email: profileData.email || '',
                        address: profileData.address || '',
                        phone: profileData.phone || '',
                        created_at: profileData.created_at || '',
                        ...profileData
                    })
                }
            } catch (error) {
                console.error('Error fetching profile:', error)
                toast.error('Error loading profile data')
            } finally {
                setLoading(false)
            }
        }

        const fetchBookings = async () => {
            if (!user) return
            try {
                const { data, error } = await client
                    .from('bookings')
                    .select('*, vehicles(name, type)')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                if (error) throw error
                setBookings(data)
            } catch (error) {
                toast.error('Error loading bookings: ' + (error.message || 'Unknown error'))
            }
        }

        fetchProfile()
        fetchBookings()
    }, [user])

    // Handle profile update
    const handleProfileUpdate = async (e) => {
        e.preventDefault()
        
        if (!user) {
            toast.error('Please log in to update your profile')
            return
        }

        try {
            const { error } = await client
                .from('profiles')
                .update({
                    full_name: profile.full_name,
                    address: profile.address,
                    phone: profile.phone,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id)

            if (error) throw error

            toast.success('Profile updated successfully')
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error('Error updating profile')
        }
    }

    // Handle password update
    const handlePasswordUpdate = async (e) => {
        e.preventDefault()

        if (!user) {
            toast.error('Please log in to update your password')
            return
        }

        try {
            const { error } = await client.auth.updateUser({
                password: passwords.new
            })

            if (error) throw error

            setPasswords({ current: '', new: '' })
            toast.success('Password updated successfully')
        } catch (error) {
            console.error('Error updating password:', error)
            toast.error('Error updating password')
        }
    }

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading profile...</div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Please log in to view your profile</div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Welcome, {profile.full_name || 'User'}</h1>
                <p className="text-gray-600 max-w-2xl">
                    Your dashboard puts your bookings and details up front. Quickly check upcoming rentals, manage profile info, and see how many rides you've enjoyed.
                </p>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Recent Bookings</h2>
                <Table>
                    <TableCaption>A list of your recent bookings.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Vehicle Name</TableHead>
                            <TableHead>Vehicle Type</TableHead>
                            <TableHead>Pickup Date</TableHead>
                            <TableHead>Drop-off Date</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.slice(0, 3).map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell className="font-medium">{booking.vehicles?.name}</TableCell>
                                <TableCell>{booking.vehicles?.type}</TableCell>
                                <TableCell>{new Date(booking.pickup_date).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(booking.dropoff_date).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <span className={`px-2 py-1 rounded-full text-sm ${
                                        booking.status === 'completed'
                                            ? 'bg-green-100 text-green-800'
                                            : booking.status === 'confirmed'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                        {bookings.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground">
                                    No bookings found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <Button onClick={() => router.push('/bookings')}>View All Bookings</Button>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Profile Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <i className="ri-calendar-line text-blue-600"></i>
                                Member Since
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold">
                                {profile.created_at
                                    ? new Date(profile.created_at).toLocaleDateString()
                                    : 'N/A'}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <i className="ri-car-line text-blue-600"></i>
                                Number of Bookings
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold">{bookings.length}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-blue-50">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center space-y-2">
                            <i className="ri-flashlight-line text-2xl text-blue-600"></i>
                            <h3 className="font-semibold">Instant Booking</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-green-50">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center space-y-2">
                            <i className="ri-cash-line text-2xl text-green-600"></i>
                            <h3 className="font-semibold">Secure Payments</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-purple-50">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center space-y-2">
                            <i className="ri-service-line text-2xl text-purple-600"></i>
                            <h3 className="font-semibold">Trusted Partners</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-orange-50">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center space-y-2">
                            <i className="ri-global-line text-2xl text-orange-600"></i>
                            <h3 className="font-semibold">24/7 Support</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Separator className="my-8" />

            <div className="space-y-6">
                <h2 className="text-xl font-semibold">Edit Profile</h2>
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input 
                                        id="name" 
                                        placeholder="Enter your full name"
                                        value={profile.full_name}
                                        onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input 
                                        id="email" 
                                        type="email" 
                                        value={profile.email}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Home Address</Label>
                                <Input 
                                    id="address" 
                                    placeholder="Enter your home address"
                                    value={profile.address}
                                    onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                    Save Profile Changes
                                </Button>
                            </div>
                        </form>

                        <Separator className="my-8" />

                        <form onSubmit={handlePasswordUpdate} className="space-y-4">
                            <h3 className="font-medium">Change Password</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="current-password">Current Password</Label>
                                    <Input 
                                        id="current-password" 
                                        type="password" 
                                        placeholder="Enter current password"
                                        value={passwords.current}
                                        onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <Input 
                                        id="new-password" 
                                        type="password" 
                                        placeholder="Enter new password"
                                        value={passwords.new}
                                        onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                    Update Password
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ProfilePage
