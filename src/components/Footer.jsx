import React, { useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'sonner'

const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

const Footer = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus({ type: "", message: "" });

        const payload = {
            ...formData,
            access_key: WEB3FORMS_ACCESS_KEY,
            subject: formData.subject,
        };

        try {
            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (data.success) {
                setStatus({ type: "success", message: "Email sent successfully!" });
                toast.success("Email sent successfully!");
                setFormData({ name: "", email: "", subject: "", message: "" });
            } else {
                setStatus({ type: "error", message: "Failed to send email. Please try again." });
                toast.error("Failed to send email. Please try again.");
            }
        } catch (err) {
            setStatus({ type: "error", message: "Something went wrong. Please try again." });
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='bg-gray-50 rounded-t-3xl mt-24'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
                <div className='flex flex-col lg:flex-row gap-12'>
                    <div className='lg:w-1/2 space-y-6'>
                        <Badge>Contact</Badge>
                        <h2 className='text-4xl font-bold text-gray-900'>Get in Touch</h2>
                        <p className='text-gray-600 mt-4'>Have a question or need assistance? We're here to help.</p>
                        <p className='flex items-center gap-2 text-gray-600'>
                            <i className="ri-mail-line text-xl"></i> udayagarwal234@gmail.com
                        </p>

                        <div className='border-t border-gray-200 my-6'></div>

                        <ul className='flex gap-6'>
                            <li className='text-gray-600 hover:text-blue-600 cursor-pointer transition-colors duration-200'>
                                <i className="ri-instagram-line text-xl"></i>
                            </li>
                            <li className='text-gray-600 hover:text-blue-600 cursor-pointer transition-colors duration-200'>
                                <i className="ri-linkedin-line text-xl"></i>
                            </li>
                        </ul>
                    </div>
                    <div className='lg:w-1/2'>
                        <Card className="w-full bg-gray-100 border-none">
                            <CardHeader>
                                <CardTitle className='text-2xl font-bold text-gray-900'>Send us a message</CardTitle>
                                <CardDescription>We'll get back to you as soon as possible.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                                    <div className='flex flex-col gap-2'>
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required placeholder='Enter your name' className="bg-gray-50 border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-12" />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder='Enter your email' className="bg-gray-50 border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-12" />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <Label htmlFor="subject">Subject</Label>
                                        <Input id="subject" name="subject" type="text" value={formData.subject} onChange={handleChange} required placeholder='Enter subject' className="bg-gray-50 border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-12" />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={6} placeholder='Enter your message' className='min-h-[120px] bg-gray-50 border-none focus-visible:ring-0 focus-visible:ring-offset-0' />
                                    </div>
                                    {status.message && (
                                        <div className={`p-3 rounded-sm ${status.type === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                            {status.message}
                                        </div>
                                    )}
                                    <Button type="submit" disabled={isLoading} className='w-full sm:w-auto px-6 mt-4 h-12' >
                                        {isLoading ? 'Sending...' : 'Send Message'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className='border-t border-gray-200 mt-16 pt-8'>
                    <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
                        <div className='flex items-center gap-2'>
                            <h1 className='text-2xl font-bold text-blue-600'>Strada</h1>
                            <p className='text-gray-600'>© 2024 Strada. All rights reserved.</p>
                        </div>
                        <ul className='flex gap-8'>
                            <li className='text-gray-600 hover:text-blue-600 cursor-pointer transition-colors duration-200'>
                                Privacy Policy
                            </li>
                            <li className='text-gray-600 hover:text-blue-600 cursor-pointer transition-colors duration-200'>
                                Terms of Service
                            </li>
                            <li className='text-gray-600 hover:text-blue-600 cursor-pointer transition-colors duration-200'>
                                Cookie Policy
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer
