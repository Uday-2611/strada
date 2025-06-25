'use client'

import React, { useEffect, useState } from 'react'
import client from '@/api/client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

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
  const [vehicles, setVehicles] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [vehicleLoading, setVehicleLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchBookings()
    fetchVehicles()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)

    const { data: bookings } = await client.from('bookings').select('id, status, created_at, user_id, vehicle_id, total_amount').order('created_at', { ascending: false })

    const userIds = [...new Set((bookings || []).map(b => b.user_id))]
    const vehicleIds = [...new Set((bookings || []).map(b => b.vehicle_id))]

    const { data: profiles } = await client.from('profiles').select('id, full_name').in('id', userIds)

    const { data: vehicles } = await client.from('vehicles').select('id, name').in('id', vehicleIds)

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

  const fetchVehicles = async () => {
    setVehicleLoading(true)
    const { data: vehicles } = await client.from('vehicles').select('id, name, type, price_per_day, status, created_at').order('created_at', { ascending: false })
    setVehicles(vehicles || [])
    setVehicleLoading(false)
  }

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return
    setDeletingId(id)
    await client.from('vehicles').delete().eq('id', id)
    setVehicles(prev => prev.filter(v => v.id !== id))
    setDeletingId(null)
  }

  const filteredData = data.filter(
    (row) =>
      row.user_name?.toLowerCase().includes(filter.toLowerCase()) ||
      row.vehicle_name?.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 sm:px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Orders</h1>
        <p className="text-gray-600 mb-8 max-w-2xl">View all bookings, regardless of their status.</p>
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <h2 className="text-xl font-semibold text-gray-900">All Bookings</h2>
            <Input placeholder="Filter by user or vehicle..." value={filter} onChange={(e) => setFilter(e.target.value)} className="max-w-xs" />
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className='text-center'>Loading...</TableCell>
                    </TableRow>
                  ) : filteredData.length ? (
                    filteredData.map((row) => (
                      <TableRow key={row.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="px-4 py-2">{row.user_name}</TableCell>
                        <TableCell className="px-4 py-2">{row.vehicle_name}</TableCell>
                        <TableCell className="px-4 py-2">{row.created_at ? new Date(row.created_at).toLocaleDateString() : ''}</TableCell>
                        <TableCell className='text-right px-4 py-2'>₹{row.total_amount?.toLocaleString() || "0"}</TableCell>
                        <TableCell className={`capitalize px-4 py-2 font-semibold rounded-md ${getStatusClass(row.status)}`}>{row.status}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell className='text-center' colSpan={5}>
                        No results.
                      </TableCell>
                    </TableRow>
                  )
                }
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Vehicles Table */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">All Vehicles</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-2">Name</TableHead>
                  <TableHead className="px-4 py-2">Type</TableHead>
                  <TableHead className="px-4 py-2">Price/Day</TableHead>
                  <TableHead className="px-4 py-2">Status</TableHead>
                  <TableHead className="px-4 py-2">Created At</TableHead>
                  <TableHead className="px-4 py-2">Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  vehicleLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className='text-center'>Loading...</TableCell>
                    </TableRow>
                  ) : vehicles.length ? (
                    vehicles.map((v) => (
                      <TableRow key={v.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="px-4 py-2">{v.name}</TableCell>
                        <TableCell className="px-4 py-2">{v.type}</TableCell>
                        <TableCell className="px-4 py-2">₹{v.price_per_day?.toLocaleString() || '0'}</TableCell>
                        <TableCell className="px-4 py-2 capitalize">{v.status}</TableCell>
                        <TableCell className="px-4 py-2">{v.created_at ? new Date(v.created_at).toLocaleDateString() : ''}</TableCell>
                        <TableCell className="px-4 py-2">
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteVehicle(v.id)} disabled={deletingId === v.id} >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className='text-center'>No vehicles found.</TableCell>
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