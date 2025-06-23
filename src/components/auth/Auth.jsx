import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

const Auth = () => {
    const [view, setView] = useState('signup');

    const toggleView = () => {
        setView(view === 'signup' ? 'login' : 'signup');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="flex w-full max-w-4xl shadow-2xl rounded-2xl overflow-hidden">
                <div className="hidden md:flex md:w-1/2 bg-cover bg-center p-12 text-white flex-col justify-center" style={{ backgroundImage: "url('/auth.jpg')" }} >
                    <h2 className="text-4xl font-bold leading-tight">Your journey, simplified.</h2>
                    <p className="mt-4 text-lg text-gray-300">Rent cars and bikes with ease. Your next adventure is just a click away.</p>
                </div>

                <div className="w-full md:w-1/2 bg-white p-8 md:p-12">
                    {view === 'signup' ? <Signup toggleView={toggleView} /> : <Login toggleView={toggleView} />}
                </div>
            </div>
        </div>
    );
};

export default Auth;