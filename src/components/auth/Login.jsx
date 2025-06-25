import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import client from '@/api/client';

const Login = ({ toggleView }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Invalid email or password");
            return;
        }

        const { error } = await client.auth.signInWithPassword({ email, password });

        if (error) {
            toast.error('Unable to Login. Please check your credentials and try again.');
        }
    };

    return (
        <div className="flex flex-col justify-center h-full">
            
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-gray-500 mt-2">Login to your existing account</p>

            <form onSubmit={handleLogin} className="mt-8 space-y-6">
                <div className='grid gap-2'>
                    <Label htmlFor='email'>Your email</Label>
                    <Input id='email' type='email' required placeholder='hi@example.com' value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-100 border-none h-12" />
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='password'>Password</Label>
                    <Input id='password' type='password' required placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} className="bg-gray-100 border-none h-12" />
                </div>
                <Button type='submit' className='w-full h-12 text-white'>Login</Button>
            </form>

            <p className="mt-6 text-center text-sm">
                Don't have an account?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); toggleView(); }} className="font-medium ">
                    Sign Up
                </a>
            </p>
        </div>
    );
};

export default Login;