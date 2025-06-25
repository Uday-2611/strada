'use client'

import React, { useEffect, useState } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import client from '@/api/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const page = () => {
  const [data, setData] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      // 1. Fetch bookings (no join)
      const { data: bookings } = await client
        .from('bookings')
        .select('id, status, created_at, user_id, vehicle_id, total_amount')
        .eq('status', 'confirmed')
        .order('created_at', { ascending: false })
        .limit(5);

      // 2. Fetch active bookings count
      const { count: activeCount } = await client
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'confirmed');

      // 3. Fetch total bookings count
      const { count: totalCount } = await client
        .from('bookings')
        .select('id', { count: 'exact', head: true });

      // 4. Fetch all needed profiles and vehicles
      const userIds = [...new Set((bookings || []).map(b => b.user_id))];
      const vehicleIds = [...new Set((bookings || []).map(b => b.vehicle_id))];

      const { data: profiles } = await client
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      const { data: vehicles } = await client
        .from('vehicles')
        .select('id, name')
        .in('id', vehicleIds);

      // 5. Map names into bookings
      const profileMap = Object.fromEntries((profiles || []).map(p => [p.id, p.full_name]));
      const vehicleMap = Object.fromEntries((vehicles || []).map(v => [v.id, v.name]));

      const bookingsWithNames = (bookings || []).map(b => ({
        ...b,
        user_name: profileMap[b.user_id] || 'Unknown',
        vehicle_name: vehicleMap[b.vehicle_id] || 'Unknown'
      }));

      setData(bookingsWithNames);
      setActiveCount(activeCount || 0);
      setTotalCount(totalCount || 0);
      setLoading(false);
    };

    fetchDashboardData();
  }, [])

  const filteredData = data.filter(
    (row) =>
      row.user_name?.toLowerCase().includes(filter.toLowerCase()) ||
      row.vehicle_name?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8 max-w-2xl">Monitor your platform's activity, manage bookings, and get a quick overview of your business performance.</p>

        <div className='flex flex-wrap gap-6 mb-10'>
          <Card className="flex-1 min-w-[220px] shadow-sm">
            <CardHeader>
              <CardTitle>Active Bookings</CardTitle>
              <CardDescription>Currently confirmed bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{activeCount}</p>
            </CardContent>
          </Card>

          <Card className="flex-1 min-w-[220px] shadow-sm">
            <CardHeader>
              <CardTitle>Total Bookings</CardTitle>
              <CardDescription>All bookings till date</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{totalCount}</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Active Bookings</h2>
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
                  <TableHead>User Name</TableHead>
                  <TableHead>Vehicle Name</TableHead>
                  <TableHead>Date of Booking</TableHead>
                  <TableHead className='text-right'>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
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
                        <TableCell>{row.user_name}</TableCell>
                        <TableCell>{row.vehicle_name}</TableCell>
                        <TableCell>{row.created_at ? new Date(row.created_at).toLocaleDateString() : ''}</TableCell>
                        <TableCell className='text-right'>₹{row.total_amount?.toLocaleString() || "0"}</TableCell>
                        <TableCell className='capitalize'>{row.status}</TableCell>
                        
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

