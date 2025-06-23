"use client"
import React from 'react'
import { Badge } from "@/components/ui/badge"
import { ExpandableCard } from './ExpandableCard';

const sectionsData = [
    {
        title: "Luxury Cars",
        shortDescription: "Drive in style with our premium luxury cars for any occasion.",
        detailedDescription: "Experience the thrill of driving premium vehicles with our luxury car rental service. Perfect for special occasions, business trips, or simply to enjoy the finest in automotive engineering. Our fleet is meticulously maintained to ensure your comfort, safety, and a memorable driving experience.",
        tags: ["Premium", "Comfort", "Business"],
        imageUrl: "/luxury.jpeg"
    },
    {
        title: "Adventure Bikes",
        shortDescription: "Explore the city's hidden gems on our agile adventure bikes.",
        detailedDescription: "Explore the city on two wheels with our range of adventure bikes. Perfect for urban exploration and weekend getaways, these bikes offer a thrilling mix of performance and convenience. They are an eco-friendly and exciting way to navigate bustling city streets and discover new paths.",
        tags: ["Adventure", "Urban", "Eco-friendly"],
        imageUrl: "/adventure.jpg"
    },
    {
        title: "Family Vehicles",
        shortDescription: "Spacious, safe, and comfortable vehicles for your next family trip.",
        detailedDescription: "Our spacious and comfortable vehicles are perfect for family trips, ensuring safety and comfort for your loved ones. Each vehicle comes equipped with modern safety features, ample storage space, and entertainment options to make your family journey a pleasant and worry-free experience.",
        tags: ["Family", "Spacious", "Safe"],
        imageUrl: "/family.jpg"
    }
]

const ScrollStack = () => {
    const cards = sectionsData.map((section, index) => ({
        title: section.title,
        description: section.shortDescription,
        src: section.imageUrl,
        ctaText: "Details",
        ctaLink: "#",
        content: () => (
            <div>
                <p className={`text-base sm:text-lg md:text-xl mb-6 sm:mb-8 ${index % 2 === 0 ? 'text-gray-800' : 'text-gray-700'}`}>
                    {section.detailedDescription}
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                    {section.tags.map((tag, tagIndex) => (
                        <Badge
                            key={tagIndex}
                            variant="outline"
                            className={`text-sm sm:text-base ${index % 2 === 0
                                ? 'bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300'
                                : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'}`}
                        >
                            {tag}
                        </Badge>
                    ))}
                </div>
            </div>
        )
    }));

    return (
        <div className="relative w-full">
            <ExpandableCard cards={cards} />
        </div>
    )
}

export default ScrollStack
