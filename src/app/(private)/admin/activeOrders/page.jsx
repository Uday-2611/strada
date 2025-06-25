'use client'

import React, { useEffect, useState } from 'react'
import client from '@/api/client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const getStatusClass = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'confirmed':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

const page = () => {
  const [data, setData] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    // 1. Fetch only confirmed bookings
    const { data: bookings } = await client
      .from('bookings')
      .select('id, status, created_at, user_id, vehicle_id, total_amount')
      .eq('status', 'confirmed')
      .order('created_at', { ascending: false })

    // 2. Fetch all needed profiles and vehicles
    const userIds = [...new Set((bookings || []).map(b => b.user_id))]
    const vehicleIds = [...new Set((bookings || []).map(b => b.vehicle_id))]

    const { data: profiles } = await client
      .from('profiles')
      .select('id, full_name')
      .in('id', userIds)

    const { data: vehicles } = await client
      .from('vehicles')
      .select('id, name')
      .in('id', vehicleIds)

    // 3. Map names into bookings
    const profileMap = Object.fromEntries((profiles || []).map(p => [p.id, p.full_name]))
    const vehicleMap = Object.fromEntries((vehicles || []).map(v => [v.id, v.name]))

    const bookingsWithNames = (bookings || []).map(b => ({
      ...b,
      user_name: profileMap[b.user_id] || 'Unknown',
      vehicle_name: vehicleMap[b.vehicle_id] || 'Unknown'
    }))

    setData(bookingsWithNames)
    setLoading(false)
  }

  const handleStatusChange = async (bookingId, newStatus) => {
    setUpdatingId(bookingId)
    // Update in Supabase
    const { error } = await client
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', bookingId)

    if (!error) {
      // Update in UI
      setData(prev =>
        prev.map(b =>
          b.id === bookingId ? { ...b, status: newStatus } : b
        )
      )
    } else {
      alert('Failed to update status')
    }
    setUpdatingId(null)
  }

  const filteredData = data.filter(
    (row) =>
      row.user_name?.toLowerCase().includes(filter.toLowerCase()) ||
      row.vehicle_name?.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 sm:px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Active Orders</h1>
        <p className="text-gray-600 mb-8 max-w-2xl">Manage all confirmed bookings. Change their status as needed.</p>
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Confirmed Bookings</h2>
            <Input
              placeholder="Filter by user or vehicle..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-xs"
            />
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-2">User Name</TableHead>
                  <TableHead className="px-4 py-2">Vehicle Name</TableHead>
                  <TableHead className="px-4 py-2">Date of Booking</TableHead>
                  <TableHead className='text-right px-4 py-2'>Total Amount</TableHead>
                  <TableHead className="px-4 py-2">Status</TableHead>
                  <TableHead className="px-4 py-2">Change Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className='text-center'>Loading...</TableCell>
                    </TableRow>
                  ) : filteredData.length ? (
                    filteredData.map((row) => (
                      <TableRow key={row.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="px-4 py-2">{row.user_name}</TableCell>
                        <TableCell className="px-4 py-2">{row.vehicle_name}</TableCell>
                        <TableCell className="px-4 py-2">{row.created_at ? new Date(row.created_at).toLocaleDateString() : ''}</TableCell>
                        <TableCell className='text-right px-4 py-2'>₹{row.total_amount?.toLocaleString() || "0"}</TableCell>
                        <TableCell className={`capitalize px-4 py-2 font-semibold rounded-md ${getStatusClass(row.status)}`}>{row.status}</TableCell>
                        <TableCell className="px-4 py-2">
                          <Select
                            value={row.status}
                            onValueChange={val => handleStatusChange(row.id, val)}
                            disabled={updatingId === row.id}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell className='text-center' colSpan={6}>
                        No results.
                      </TableCell>
                    </TableRow>
                  )
                }
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
