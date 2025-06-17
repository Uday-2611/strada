import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { toast } from 'sonner'

import client from '@/api/client'

const Login = () => {

    const handleLogin = async (e) => {
        e.preventDefault();
        const email = e.target[0]?.value;
        const password = e.target[1]?.value;
        console.log(email, password)

        if (!email || !password) {
            toast.error("Invalid email or password")
            return
        }

        // making a call to supabase project using the api client -> 
        const { error } = await client.auth.signInWithPassword({
            email, password
        });

        if (error) {
            toast.error('Unable to Login. Please try again')
        }

    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Login to your existing account</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLogin} >
                    <div className='flex flex-col gap-6'>
                        <div className='grid gap-2'>
                            <Label>Email</Label>
                            <Input id='email' type='email' required placeholder='Enter your email' />
                        </div>
                        <div className='grid gap-2'>
                            <Label>Password</Label>
                            <Input id='password' type='password' placeholder='Enter your password' />
                        </div>
                        <Button type='submit' className='w-full'>Login</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default Login
