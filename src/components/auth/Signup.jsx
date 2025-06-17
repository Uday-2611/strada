import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { toast } from 'sonner'

import client from '@/api/client'

const Signup = () => {

    const handleSignup = async (e) => {
        e.preventDefault();
        const email = e.target[0]?.value;
        const password = e.target[1]?.value;
        console.log(email, password)

        if (!email || !password) {
            toast.error("Please enter required details")
            return
        }

        const { data, error } = await client.auth.signUp({
            email,
            password
        });

        if (error) {
            toast.error('Unable to Sign Up. Please try again ')
        } else {
            toast.success('Sign up successful!')
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Create a new account</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSignup} >
                    <div className='flex flex-col gap-6'>
                        
                        <div className='grid gap-2'>
                            <Label>Email</Label>
                            <Input id='email' type='email' required placeholder='Enter your email' />
                        </div>
                        <div className='grid gap-2'>
                            <Label>Password</Label>
                            <Input id='password' type='password' placeholder='Enter your password' />
                        </div>
                        <Button type='submit' className='w-full'>Sign Up</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default Signup
