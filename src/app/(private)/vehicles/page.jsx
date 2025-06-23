"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import client from '@/api/client'
import { toast } from 'sonner'
import VehicleCard from '@/components/VehicleCard'

const VehiclesPage = () => {

    const [vehicles, setVehicles] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState('relevance')

    const router = useRouter()

    useEffect(() => {
        fetchVehicles()
    }, [])

    const fetchVehicles = async () => {
        try {
            setLoading(true)
            let query = client.from('vehicles').select('*')

            if (searchTerm) {
                query = query.ilike('name', `%${searchTerm}%`)
            }
            if (sortBy === 'price-low') {
                query = query.order('price_per_day', { ascending: true })
            } else if (sortBy === 'price-high') {
                query = query.order('price_per_day', { ascending: false })
            } else if (sortBy === 'rating') {
                query = query.order('created_at', { ascending: false })
            }

            const { data, error } = await query

            if (error) throw error

            setVehicles(data)
        } catch (error) {
            toast.error('Error loading vehicles: ' + (error.message || 'Unknown error'))
        } finally {
            setLoading(false)
        }
    }

    const handleBookNow = (vehicleId) => {
        router.push(`/product?id=${vehicleId}`)
    }

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-screen' >
                <div className='text-lg' >Loading Vehicles</div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold text-gray-900">Browse Cars and Bikes</h1>
                <p className="text-gray-600 max-w-2xl">
                    Search and explore all vehicles available for rent. Find your perfect ride by filtering through a wide range of cars and bikes, each with detailed info and quick booking options.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex w-full sm:w-auto items-center gap-2">
                    <Input type="search" placeholder="Search vehicles..." className="max-w-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    <Button variant="outline" onClick={fetchVehicles}>
                        <i className="ri-search-line mr-2"></i>
                        Search
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="relevance">Sort by Relevance</SelectItem>
                            <SelectItem value="price-low">Price: Low to High</SelectItem>
                            <SelectItem value="price-high">Price: High to Low</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" onClick={fetchVehicles}>
                        Reset Filters
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} handleBookNow={handleBookNow} />
                ))}
            </div>
        </div>
    )
}

export default VehiclesPage