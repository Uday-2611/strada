import React from 'react'
import { Badge } from "@/components/ui/badge"

const sectionsData = [
    {
        title: "Luxury Cars",
        description: "Experience the thrill of driving premium vehicles with our luxury car rental service. Perfect for special occasions and business trips.",
        tags: ["Premium", "Comfort", "Business"],
        duration: "Available for 24/7 rental",
        imageUrl: "/luxury-car.jpg"
    },
    {
        title: "Adventure Bikes",
        description: "Explore the city on two wheels with our range of adventure bikes. Perfect for urban exploration and weekend getaways.",
        tags: ["Adventure", "Urban", "Eco-friendly"],
        duration: "Flexible rental periods",
        imageUrl: "/adventure-bike.jpg"
    },
    {
        title: "Family Vehicles",
        description: "Spacious and comfortable vehicles perfect for family trips. Safety and comfort guaranteed for your loved ones.",
        tags: ["Family", "Spacious", "Safe"],
        duration: "Weekly and monthly rentals available",
        imageUrl: "/family-car.jpg"
    }
]

const ScrollStack = () => {
    return (
        <div className="relative w-full">
            {sectionsData.map((section, index) => (
                <div key={index} className={`sticky top-20 w-[90vw] m-auto mt-10 rounded-xl flex items-center justify-between p-20 ${index % 2 === 0 ? 'bg-blue-100' : 'bg-blue-50'}`} style={{ zIndex: index }}>
                    <div className="w-1/2 pr-10">
                        <h2 className={`text-6xl font-bold mb-6 ${index % 2 === 0 ? 'text-blue-900' : 'text-blue-800'}`}>
                            {section.title}
                        </h2>
                        <p className={`text-xl mb-8 ${index % 2 === 0 ? 'text-blue-800' : 'text-blue-700'}`}>
                            {section.description}
                        </p>
                        <div className="flex flex-wrap gap-3 mb-6">
                            {section.tags.map((tag, tagIndex) => (
                                <Badge
                                    key={tagIndex}
                                    variant="outline"
                                    className={`${index % 2 === 0
                                        ? 'bg-blue-200 text-blue-800 border-blue-300 hover:bg-blue-300'
                                        : 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200'}`}
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                        <p className={`text-sm ${index % 2 === 0 ? 'text-blue-600' : 'text-blue-500'}`}>
                            {section.duration}
                        </p>
                    </div>

                    <div className="w-1/2">
                        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-200">
                            {/* Placeholder for image */}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ScrollStack
