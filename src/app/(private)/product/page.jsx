"use client"

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import useAuth from '@/hooks/useAuth'
import { toast } from 'sonner'
import client from '@/api/client'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

const ProductPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState([])
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    user_id: null
  })
  const [bookingDetails, setBookingDetails] = useState({
    pickup_date: '',
    dropoff_date: '',
    pickup_location: '',
    dropoff_location: '',
    total_days: 0,
    base_amount: 0,
    total_amount: 0
  })

  useEffect(() => {
    const initializeData = async () => {
      if (user) {
        setNewReview(prev => ({
          ...prev,
          user_id: user.id
        }))
      }

      const vehicleId = searchParams.get('id')
      if (vehicleId) {
        try {
          console.log('Fetching vehicle data for ID:', vehicleId)
          const { data: vehicleData, error: vehicleError } = await client
            .from('vehicles')
            .select('*')
            .eq('id', vehicleId)
            .single()

          if (vehicleError) {
            console.error('Error fetching vehicle:', vehicleError)
            throw vehicleError
          }
          console.log('Vehicle data:', vehicleData)
          setVehicle(vehicleData)

          console.log('Fetching reviews for vehicle ID:', vehicleId)
          const { data: reviewsData, error: reviewsError } = await client
            .from('reviews')
            .select('*')
            .eq('vehicle_id', vehicleId)
            .order('created_at', { ascending: false })

          if (reviewsError) {
            console.error('Error fetching reviews:', reviewsError)
            throw reviewsError
          }
          console.log('Reviews data:', reviewsData)
          setReviews(reviewsData)
        } catch (error) {
          console.error("Error details:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          })
          toast.error('Error loading data: ' + (error.message || 'Unknown error'))
        }
      }
      setLoading(false)
    }

    initializeData()
  }, [searchParams, user])

  // Calculate total days and amount when dates change or vehicle price changes
  useEffect(() => {
    if (bookingDetails.pickup_date && bookingDetails.dropoff_date && vehicle) {
      const pickup = new Date(bookingDetails.pickup_date)
      const dropoff = new Date(bookingDetails.dropoff_date)
      const diffTime = Math.abs(dropoff.getTime() - pickup.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      const calculatedBaseAmount = diffDays * vehicle.price_per_day;
      const calculatedTotalAmount = calculatedBaseAmount * 1.18; // Add 18% GST

      setBookingDetails(prev => ({
        ...prev,
        total_days: diffDays,
        base_amount: calculatedBaseAmount,
        total_amount: calculatedTotalAmount
      }))
    } else if (vehicle) {
      // Reset total_amount and total_days if dates are not valid but vehicle is loaded
      setBookingDetails(prev => ({
        ...prev,
        total_days: 0,
        base_amount: 0,
        total_amount: 0
      }))
    }
  }, [bookingDetails.pickup_date, bookingDetails.dropoff_date, vehicle])

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please log in to make a booking')
      return
    }

    if (!bookingDetails.pickup_date || !bookingDetails.dropoff_date) {
      toast.error('Please select pickup and drop-off dates')
      return
    }

    if (new Date(bookingDetails.pickup_date) >= new Date(bookingDetails.dropoff_date)) {
      toast.error('Drop-off date must be after pickup date')
      return
    }

    if (!bookingDetails.pickup_location.trim() || !bookingDetails.dropoff_location.trim()) {
      toast.error('Please enter pickup and drop-off locations')
      return
    }

    try {
      const { data, error } = await client
        .from('bookings')
        .insert({
          user_id: user.id,
          vehicle_id: searchParams.get('id'),
          pickup_date: bookingDetails.pickup_date,
          dropoff_date: bookingDetails.dropoff_date,
          pickup_location: bookingDetails.pickup_location,
          dropoff_location: bookingDetails.dropoff_location,
          total_days: bookingDetails.total_days,
          base_amount: bookingDetails.base_amount,
          total_amount: bookingDetails.total_amount,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()

      if (error) {
        console.error('Error creating booking:', error)
        toast.error('Failed to create booking: ' + error.message)
        return
      }

      toast.success('Booking created successfully!')
      router.push(`/order?booking_id=${data[0].id}`)
    } catch (error) {
      console.error('Error creating booking:', error)
      toast.error('An unexpected error occurred while creating your booking')
    }
  }

  if (loading || authLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen' >
        <div className='text-lg' >Loading Vehicles</div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className='flex items-center justify-center min-h-screen' >
        <div className='text-lg' >Vehicle Not Found</div>
      </div>
    )
  }

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error('Please log in to submit a review')
      return
    }

    if (!newReview.comment.trim()) {
      toast.error('Please enter a review comment')
      return
    }

    try {
      const { data, error } = await client
        .from('reviews')
        .insert({
          vehicle_id: searchParams.get('id'),
          rating: newReview.rating,
          comment: newReview.comment,
          user_id: user.id,
          created_at: new Date().toISOString()
        })
        .select()

      if (error) {
        console.error('Supabase error:', error)
        toast.error('Failed to submit review: ' + error.message)
        return
      }

      toast.success('Review submitted successfully!')

      setNewReview({
        rating: 5,
        comment: '',
        user_id: user.id
      })

      // Refresh reviews
      const { data: reviewsData, error: reviewsError } = await client
        .from('reviews')
        .select('*')
        .eq('vehicle_id', searchParams.get('id'))
        .order('created_at', { ascending: false })

      if (reviewsError) {
        console.error('Error fetching updated reviews:', reviewsError)
        toast.error('Review submitted but failed to refresh the list')
        return
      }

      setReviews(reviewsData)
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('An unexpected error occurred while submitting your review')
    }
  }

  return (
    <div className='w-screen min-h-screen bg-background p-6'>
      <div className='flex gap-6 max-w-7xl mx-auto'>
        {/* Left Section - Product Image and Basic Info */}
        <div className='w-1/2 space-y-6'>

          <div className='w-full aspect-video bg-muted rounded-lg flex items-center justify-center'>
            {vehicle.images && vehicle.images[0] ? (
              <img src={vehicle.images[0]} alt={vehicle.name} className='w-full h-full object-cover rounded-lg' />
            ) : (
              <span className="text-muted-foreground">Product Image</span>
            )}
          </div>

          <Card className='bg-gray-100 border-none'>
            <CardHeader>
              <CardTitle className='text-4xl font-semibold' >{vehicle.name}</CardTitle>
              <CardDescription className='text-lg' >{vehicle.type} • {vehicle.seats} Seats • {vehicle.transmission}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap ">
                <Badge variant="secondary" className=' bg-yellow-500'>4.5 ★</Badge>
                {vehicle.features?.map((feature, index) => (
                  <Badge key={index} variant='secondary' >{feature}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Accordion type="single" collapsible className="w-full mb-4 bg-red-100 px-4 rounded-md">
            <AccordionItem value="important-info">
              <AccordionTrigger className="text-base font-semibold text-red-600">Important Information</AccordionTrigger>
              <AccordionContent className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded-md">
                <ul className="list-disc list-inside space-y-2 text-sm text-red-700">
                  <li>Minimum permissible age for renting is 21 years</li>
                  <li>Driving license should be minimum one year old as on the rental start date</li>
                  <li>Some vehicles may be speed limited to 80 km/hr for safety</li>
                  <li>Please read the policy on Inter State tax under Terms & Conditions</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Right Section - Booking Details */}
        <div className='w-1/2 space-y-6'>
          <Card className='bg-gray-100 border-none'>
            <CardHeader>
              <CardTitle className='text-xl'>Book Now</CardTitle>
              <CardDescription>Select your rental period</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pickup">Pickup Date</Label>
                  <Input
                    type="date"
                    id="pickup"
                    value={bookingDetails.pickup_date}
                    onChange={(e) => setBookingDetails(prev => ({ ...prev, pickup_date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="h-12 bg-white border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dropoff">Drop-off Date</Label>
                  <Input
                    type="date"
                    id="dropoff"
                    value={bookingDetails.dropoff_date}
                    onChange={(e) => setBookingDetails(prev => ({ ...prev, dropoff_date: e.target.value }))}
                    min={bookingDetails.pickup_date || new Date().toISOString().split('T')[0]}
                    className="h-12 bg-white border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickup-location">Pickup Location</Label>
                <Input
                  id="pickup-location"
                  placeholder="Enter pickup location"
                  value={bookingDetails.pickup_location}
                  onChange={(e) => setBookingDetails(prev => ({ ...prev, pickup_location: e.target.value }))}
                  className="h-12 bg-white border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dropoff-location">Drop-off Location</Label>
                <Input
                  id="dropoff-location"
                  placeholder="Enter drop-off location"
                  value={bookingDetails.dropoff_location}
                  onChange={(e) => setBookingDetails(prev => ({ ...prev, dropoff_location: e.target.value }))}
                  className="h-12 bg-white border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Base Price</span>
                  <span>₹{vehicle?.price_per_day}/day</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Duration</span>
                  <span>{bookingDetails.total_days} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Base Amount</span>
                  <span>₹{bookingDetails.base_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total (incl. 18% GST)</span>
                  <span>₹{bookingDetails.total_amount.toFixed(2)}</span>
                </div>
              </div>

              <Button className="w-full bg-green-500 h-12" onClick={handleBooking} disabled={!bookingDetails.pickup_date || !bookingDetails.dropoff_date || !bookingDetails.pickup_location.trim() || !bookingDetails.dropoff_location.trim() || bookingDetails.total_days <= 0} >
                Confirm Booking
              </Button>
            </CardContent>
          </Card>


        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto mt-12">
        <Card className="bg-gray-100 border-none">
          <CardHeader>
            <CardTitle className='text-xl'>Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="reviews">
              <TabsList>
                <TabsTrigger value="reviews">Customer Reviews</TabsTrigger>
                <TabsTrigger value="write">Write a Review</TabsTrigger>
              </TabsList>


              <TabsContent value="reviews" className="space-y-4">
                {reviews.length === 0 ? (
                  <p className='text-muted-foreground' >No reviews yet. Be the first to write a review!</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge>{review.rating} ★</Badge>
                        <span className="font-medium">Anonymous User</span>
                        <span className="text-sm text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                    </div>
                  ))
                )}

              </TabsContent>

              <TabsContent value="write" className="space-y-4">

                {!user ? (
                  <p className='text-muted-foreground'>Please log in to write a review</p>
                ) : (
                  <div className='space-y-4'>
                    <div className="space-y-2">
                      <Label>Rating</Label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Button
                            key={star}
                            variant="ghost"
                            className={`rounded-full ${newReview.rating >= star ? 'text-yellow-500' : 'text-gray-400'}`}
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                          >
                            ★
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="review">Your Review</Label>
                      <Textarea
                        id="review"
                        placeholder="Share your experience..."
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        className="bg-white border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>

                    <Button className='h-12 w-40' onClick={handleSubmitReview} disabled={!newReview.comment.trim()} >
                      Submit Review
                    </Button>
                  </div>
                )}

              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ProductPage
