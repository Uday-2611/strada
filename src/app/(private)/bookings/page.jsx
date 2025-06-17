"use client"

import React, { useEffect, useState } from 'react'
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
import { Badge } from "@/components/ui/badge"
import { toast } from 'sonner'
import client from '@/api/client'
import useAuth from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

const BookingsPage = () => {

    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('all') // 'all', 'confirmed', 'completed', 'cancelled'
    const [sortBy, setSortBy] = useState('created_at_desc') // 'created_at_desc', 'pickup_date_asc', etc.

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user) {
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                let query = client.from('bookings').select(`
                    *,
                    vehicles(name, type)
                `)

                // Apply filter
                if (filterStatus !== 'all') {
                    query = query.eq('status', filterStatus)
                }

                // Apply sort
                const [column, order] = sortBy.split('_')
                const sortColumn = column === 'created' ? 'created_at' : column;
                query = query.order(sortColumn, { ascending: order === 'asc' })

                query = query.eq('user_id', user.id)

                const { data, error } = await query

                if (error) throw error
                setBookings(data)
            } catch (error) {
                console.log('Error fetching bookings - ', error)
                toast.error('Error loading your bookings - ' + (error.message || 'Unknown error'))
            } finally {
                setLoading(false)
            }
        }

        fetchBookings()
    }, [user, filterStatus, sortBy]) // Depend on filterStatus and sortBy

    const handleCancelBooking = async (bookingId) => {
        if (!user) {
            toast.error('Please log in to cancel a booking')
            return
        }

        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return
        }

        try {
            setLoading(true)

            const { error: bookingUpdateError } = await client.from('bookings').update({ status: 'cancelled', updated_at: new Date().toISOString() }).eq('id', bookingId).eq('user_id', user.id)

            if (bookingUpdateError) throw bookingUpdateError

            const { error: paymentUpdateError } = await client.from('payments').update({ status: 'cancelled' }).eq('booking_id', bookingId).select()

            if (paymentUpdateError) {
                console.warn('Could not update associated payment status (might not exist or already cancelled):', paymentUpdateError.message);
            }

            setBookings(prevBookings => prevBookings.map(booking => booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking))

            toast.success('Booking cancelled successfully');
        } catch (error) {
            console.error('Error cancelling booking:', error)
            toast.error('Failed to cancel booking: ' + (error.message || 'Unknown error'))
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
            case 'completed':
                return 'bg-green-100 text-green-800 hover:bg-green-100';
            case 'cancelled': // Now explicitly handling cancelled status for badge
                return 'bg-red-100 text-red-800 hover:bg-red-100';
            default:
                return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
        }
    }

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading bookings...</div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Please log in to view your bookings</div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Your Bookings</h1>
                <p className="text-gray-600 max-w-2xl">
                    View and manage all your vehicle bookings. Track your current rentals and view your booking history.
                </p>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">All Bookings</h2>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline">Filter & Sort Bookings</Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Filter & Sort Bookings</SheetTitle>
                            </SheetHeader>
                            <div className="py-4 space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="filter-status">Filter by Status</Label>
                                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                                        <SelectTrigger id="filter-status">
                                            <SelectValue placeholder="Select a status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="confirmed">Confirmed</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Label htmlFor="sort-by">Sort by</Label>
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger id="sort-by">
                                            <SelectValue placeholder="Sort by..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="created_at_desc">Newest First</SelectItem>
                                            <SelectItem value="created_at_asc">Oldest First</SelectItem>
                                            <SelectItem value="pickup_date_asc">Pickup Date (Asc)</SelectItem>
                                            <SelectItem value="pickup_date_desc">Pickup Date (Desc)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                <Table>
                    <TableCaption>A list of all your vehicle bookings.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Vehicle Name</TableHead>
                            <TableHead>Vehicle Type</TableHead>
                            <TableHead>Pickup Date</TableHead>
                            <TableHead>Drop-off Date</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>

                        {bookings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className='text-center py-4 text-muted-foreground' >
                                    No bookings found
                                </TableCell>
                            </TableRow>
                        ) : (
                            bookings.map((booking) => (
                                <TableRow key={booking.id} >
                                    <TableCell className="font-medium">{booking.vehicles?.name}</TableCell>
                                    <TableCell>{booking.vehicles?.type}</TableCell>
                                    <TableCell>{new Date(booking.pickup_date).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(booking.dropoff_date).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge className={getStatusBadgeVariant(booking.status)}>
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="sm" onClick={() => router.push(`/order?booking_id=${booking.id}`)}>View Details</Button>
                                            {booking.status === 'confirmed' && (
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleCancelBooking(booking.id)}
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}



                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default BookingsPage
