import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const VehicleCard = ({ vehicle, handleBookNow }) => {
    return (
        <Card key={vehicle.id} className="overflow-hidden border-none  ">
            <CardHeader className="p-0">
                <div className="relative">
                    <img src={vehicle.images[0]} alt={vehicle.name} className="w-[90%] h-52 object-cover m-auto rounded-md" />
                </div>
            </CardHeader>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className='text-lg'>{vehicle.name}</CardTitle>
                    <span className="text-2xl font-semibold ">₹{vehicle.price_per_day}<span className="text-neutral-500 text-lg font-normal ">/per day</span></span>
                </div>
                <CardDescription>{vehicle.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Badge variant="secondary">{vehicle.fuel_type}</Badge>
                    <Badge variant="secondary">{vehicle.transmission}</Badge>
                    <Badge variant="secondary">{vehicle.seats} Seats</Badge>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full h-12" onClick={() => handleBookNow(vehicle.id)} >
                    Book Now
                </Button>
            </CardFooter>
        </Card>
        
    );
};

export default VehicleCard; 