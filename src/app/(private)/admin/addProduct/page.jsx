'use client'

import React, { useState } from 'react'
import client from '@/api/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const initialState = {
  name: '',
  type: '',
  description: '',
  price_per_day: '',
  transmission: '',
  fuel_type: '',
  seats: '',
  images: '',
  status: 'available',
}

const transmissionOptions = [
  { value: 'Manual', label: 'Manual' },
  { value: 'Automatic', label: 'Automatic' },
]

const fuelTypeOptions = [
  { value: 'Petrol', label: 'Petrol' },
  { value: 'Diesel', label: 'Diesel' },
  { value: 'Electric', label: 'Electric' },
  { value: 'Hybrid', label: 'Hybrid' },
]

const statusOptions = [
  { value: 'available', label: 'Available' },
  { value: 'unavailable', label: 'Unavailable' },
  { value: 'maintenance', label: 'Maintenance' },
]

const page = () => {
  const [form, setForm] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess('')
    setError('')
    // Validate required fields
    if (!form.name || !form.type || !form.price_per_day || !form.seats || !form.status) {
      setError('Please fill all required fields.')
      setLoading(false)
      return
    }
    // Insert into Supabase
    const { error } = await client
      .from('vehicles')
      .insert([{
        name: form.name,
        type: form.type,
        description: form.description,
        price_per_day: Number(form.price_per_day),
        transmission: form.transmission,
        fuel_type: form.fuel_type,
        seats: Number(form.seats),
        images: form.images
          ? form.images.split(',').map(s => s.trim()).filter(Boolean)
          : [],
        status: form.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
    if (error) {
      setError('Failed to add product. Please try again.')
    } else {
      setSuccess('Product added successfully!')
      setForm(initialState)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 border">
        <h1 className="text-2xl font-bold mb-4">Add New Vehicle</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input name="name" value={form.name} onChange={handleChange} placeholder="Name*" required />
            <Input name="type" value={form.type} onChange={handleChange} placeholder="Type* (e.g. Car, Bike)" required />
            <Input name="price_per_day" value={form.price_per_day} onChange={handleChange} placeholder="Price per day*" type="number" required />
            <Input name="seats" value={form.seats} onChange={handleChange} placeholder="Seats*" type="number" required />

            <Select value={form.transmission} onValueChange={val => handleSelectChange('transmission', val)}>
              <SelectTrigger className="w-full" required>
                <SelectValue placeholder="Transmission" />
              </SelectTrigger>
              <SelectContent>
                {transmissionOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={form.fuel_type} onValueChange={val => handleSelectChange('fuel_type', val)}>
              <SelectTrigger className="w-full" required>
                <SelectValue placeholder="Fuel Type" />
              </SelectTrigger>
              <SelectContent>
                {fuelTypeOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              name="images"
              value={form.images}
              onChange={handleChange}
              placeholder="Image URL(s), comma separated"
            />

            <Select value={form.status} onValueChange={val => handleSelectChange('status', val)}>
              <SelectTrigger className="w-full" required>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border rounded-md p-2 min-h-[80px]"
          />
          {error && <div className="text-red-600 font-medium">{error}</div>}
          {success && <div className="text-green-600 font-medium">{success}</div>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Adding...' : 'Add Vehicle'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default page
