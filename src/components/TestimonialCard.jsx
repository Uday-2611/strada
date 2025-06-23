import React from 'react'

const TestimonialCard = ({ name, title, quote, avatar }) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto'>
            <div className='flex items-center gap-4 mb-6'>
                <h1 className='text-3xl'>
                    <i className="ri-user-line"></i>
                </h1>
                <div>
                    <h3 className='text-lg font-bold text-gray-900'>{name}</h3>
                    <p className='text-sm text-gray-600'>{title}</p>
                </div>
            </div>
            <div>
                <p className='text-black leading-relaxed'>
                    "{quote}"
                </p>
            </div>
        </div>
    )
}

export default TestimonialCard
