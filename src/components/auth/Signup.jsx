import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import client from '@/api/client';

const Signup = ({ toggleView }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please enter required details");
            return;
        }

        const { error } = await client.auth.signUp({ email, password });

        if (error) {
            toast.error('Unable to Sign Up. Please try again');
        } else {
            toast.success('Sign up successful! Please check your email to verify.');
        }
    };

    return (
        <div className="flex flex-col justify-center h-full">
            
            <h1 className="text-3xl font-bold">Get Started</h1>
            <p className="text-gray-500 mt-2">Welcome to Strada — Let's get started</p>

            <form onSubmit={handleSignup} className="mt-8 space-y-6">
                <div className='grid gap-2'>
                    <Label htmlFor='email'>Your email</Label>
                    <Input id='email' type='email' required placeholder='hi@example.com' value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-100 border-none h-12" />
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='password'>Create new password</Label>
                    <Input id='password' type='password' required placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} className="bg-gray-100 border-none h-12" />
                </div>
                <Button type='submit' className='w-full h-12 text-white'>Create a new account</Button>
            </form>

            <p className="mt-6 text-center text-sm">
                Already have an account?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); toggleView(); }} className="font-medium ">
                    Login
                </a>
            </p>
        </div>
    );
};

export default Signup;
