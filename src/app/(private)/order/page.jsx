"use client"

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CreditCard, IndianRupee, Wallet } from 'lucide-react'
import useAuth from '@/hooks/useAuth'
import { toast } from 'sonner'
import client from '@/api/client'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const page = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()

  const [booking, setBooking] = useState(null)
  const [vehicle, setVehicle] = useState(null)
  const [profile, setProfile] = useState(null)
  const [billingDetails, setBillingDetails] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      toast.success('Payment successful! Your booking is being processed.');
    }

    const fetchOrderData = async () => {
      if (!user) {
        setLoading(false)
        toast.error('Please log in to view your order')
        router.push('/')
        return
      }

      const bookingId = searchParams.get('booking_id')
      if (!bookingId) {
        setLoading(false)
        toast.error('Booking ID not found in URL')
        router.push('/dashboard') // Redirect if no booking ID
        return
      }

      try {
        // Fetch booking details
        const { data: bookingData, error: bookingError } = await client
          .from('bookings')
          .select('*')
          .eq('id', bookingId)
          .eq('user_id', user.id) // Ensure only fetching user's own booking
          .single()

        if (bookingError) {
          console.error('Error fetching booking:', bookingError)
          throw bookingError
        }
        setBooking(bookingData)

        // Fetch vehicle details
        const { data: vehicleData, error: vehicleError } = await client
          .from('vehicles')
          .select('*')
          .eq('id', bookingData.vehicle_id)
          .single()

        if (vehicleError) {
          console.error('Error fetching vehicle:', vehicleError)
          throw vehicleError
        }
        setVehicle(vehicleData)

        // Fetch user profile for billing details
        const { data: profileData, error: profileError } = await client
          .from('profiles')
          .select('full_name, email, address, phone')
          .eq('id', user.id)
          .single()

        if (profileError) {
          console.error('Error fetching profile:', profileError)
          // If profile doesn't exist, handle it gracefully
          if (profileError.code === 'PGRST116' || (profileError && Object.keys(profileError).length === 0)) { // No rows found or empty error object
            toast.info('Profile not found, please update your billing details.')
            setProfile(null); // Explicitly set profile to null if not found
          } else {
            throw profileError
          }
        } else if (!profileData) {
            // Handle case where no profile data is returned but no explicit error is thrown
            toast.info('Profile not found, please update your billing details.');
            setProfile(null);
        }

        setProfile(profileData)
        setBillingDetails({
          full_name: profileData?.full_name || '',
          email: profileData?.email || user.email || '', // Use user.email if profile email is null
          phone: profileData?.phone || '',
          address: profileData?.address || ''
        })

      } catch (error) {
        console.error("Error loading order page data:", error)
        toast.error('Error loading order details: ' + (error.message || 'Unknown error'))
        router.push('/dashboard') // Redirect on error
      } finally {
        setLoading(false)
      }
    }

    fetchOrderData()
  }, [searchParams, user, router])

  const handlePayment = async (paymentMethod) => {
    if (!user || !booking) {
      toast.error('Booking details not available.')
      return
    }

    if (!billingDetails.phone.trim()) {
        toast.error('Please enter your phone number.')
        return
    }
    
    setLoading(true);

    if (paymentMethod === 'Stripe') {
      try {
        const stripe = await stripePromise;
        if (!stripe) {
          toast.error("Stripe.js has not loaded yet.");
          setLoading(false);
          return;
        }

        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            item: {
              name: vehicle.name,
              description: `Booking for ${vehicle.name} from ${new Date(booking.pickup_date).toLocaleDateString()} to ${new Date(booking.dropoff_date).toLocaleDateString()}`,
              amount: Math.round(booking.total_amount * 100), // Amount in paise
              quantity: 1,
              booking_id: booking.id,
            },
          }),
        });

        const session = await response.json();
        if (response.ok) {
          const { error } = await stripe.redirectToCheckout({
            sessionId: session.id,
          });
          if (error) {
            toast.error(error.message);
          }
        } else {
          toast.error(session.error.message);
        }
      } catch (error) {
        console.error('Stripe payment error:', error)
        toast.error('Failed to initiate Stripe payment.')
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
        // Update phone number in profiles table
        const { error: profileUpdateError } = await client
            .from('profiles')
            .update({ phone: billingDetails.phone, updated_at: new Date().toISOString() })
            .eq('id', user.id)
        
        if (profileUpdateError) throw profileUpdateError

        // Update booking status and payment method
        const { error: bookingUpdateError } = await client
            .from('bookings')
            .update({ status: 'confirmed', payment_method: paymentMethod, updated_at: new Date().toISOString() })
            .eq('id', booking.id)
            .eq('user_id', user.id)

        if (bookingUpdateError) throw bookingUpdateError

        // Insert into payments table
        const { error: paymentInsertError } = await client
            .from('payments')
            .insert({
                booking_id: booking.id,
                amount: booking.total_amount,
                payment_method: paymentMethod,
                transaction_id: `TXN_${Date.now()}`, // Placeholder transaction ID
                status: 'completed',
                created_at: new Date().toISOString(),
            })

        if (paymentInsertError) throw paymentInsertError

        toast.success('Booking confirmed successfully!')
        router.push('/dashboard') // Redirect to dashboard
    } catch (error) {
        console.error('Payment processing error:', error)
        toast.error('Failed to process payment: ' + (error.message || 'Unknown error'))
    } finally {
        setLoading(false)
    }
  }

  if (loading || authLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-lg'>Loading order details...</div>
      </div>
    )
  }

  if (!booking || !vehicle || !profile) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-lg'>Order details could not be loaded.</div>
      </div>
    )
  }

  return (
    <div className='w-screen min-h-screen bg-background p-6'>
      <div className='flex gap-6 max-w-7xl mx-auto'>
        {/* Left Section - Order and Billing Details */}
        <div className='w-1/2 space-y-6'>
          <Card className="bg-gray-100 border-none">
            <CardHeader>
              <CardTitle className='text-xl'>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Vehicle</span>
                  <span>{vehicle.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price per day</span>
                  <span>₹{vehicle.price_per_day}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span>{booking.total_days} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base Amount</span>
                  <span>₹{booking.base_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span>₹{(booking.total_amount - booking.base_amount).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total Amount</span>
                  <span>₹{booking.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-100 border-none">
            <CardHeader>
              <CardTitle className='text-xl'>Billing Details</CardTitle>
              <CardDescription>Please confirm your billing information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullname">Full Name</Label>
                  <Input id="fullname" value={billingDetails.full_name} disabled className="h-12 bg-gray-50 border-none focus-visible:ring-0 focus-visible:ring-offset-0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={billingDetails.email} disabled className="h-12 bg-gray-50 border-none focus-visible:ring-0 focus-visible:ring-offset-0" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={billingDetails.phone}
                  onChange={(e) => setBillingDetails(prev => ({ ...prev, phone: e.target.value }))}
                  className="h-12 bg-gray-50 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={billingDetails.address} disabled className="h-12 bg-gray-50 border-none focus-visible:ring-0 focus-visible:ring-offset-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-100 border-none">
            <CardHeader>
              <CardTitle className='text-xl'>Payment Method</CardTitle>
              <CardDescription>Choose your preferred payment method</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <Button className="w-full justify-start gap-2 h-12 bg-purple-600 hover:bg-purple-700" onClick={() => handlePayment('Stripe')} disabled={loading}>
                  <CreditCard className="h-5 w-5" />
                  <span>Pay with Stripe</span>
                </Button>
                
                <Button className="w-full justify-start gap-2 h-12 bg-green-500 hover:bg-green-600" onClick={() => handlePayment('Cash on Delivery')} disabled={loading}>
                  <Wallet className="h-5 w-5" />
                  <span>Cash on Delivery</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Section - Order Summary */}
        <div className='w-1/2 space-y-6'>
          <Card className="bg-gray-100 border-none">
            <CardHeader>
              <CardTitle className='text-xl'>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                {vehicle.images && vehicle.images[0] ? (
                  <img src={vehicle.images[0]} alt={vehicle.name} className='w-full h-full object-cover' />
                ) : (
                  <span className="text-muted-foreground">Vehicle Image</span>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">{vehicle.name}</h3>
                  <p className="text-sm text-muted-foreground">{vehicle.type} • {vehicle.seats} Seats • {vehicle.transmission}</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pickup Date</span>
                    <span>{new Date(booking.pickup_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Drop-off Date</span>
                    <span>{new Date(booking.dropoff_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pickup Location</span>
                    <span>{booking.pickup_location}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Drop-off Location</span>
                    <span>{booking.dropoff_location}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default page
