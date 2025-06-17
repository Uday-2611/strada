"use client"

// this will act as a wrapper on the whole website for authentication and we can check anywhere in the website if the user is logged in 

import React from 'react'

import { createContext, useState, useEffect } from 'react'
import client from '@/api/client'

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true)

    // this is to check whether the user is logged in or not
    useEffect(() => {
        client.auth.getSession().then(({ data }) => {
            setUser(data?.session?.user || null)
            setLoading(false)
        });

        // This will keep listening to auth events and will know when a user logins and logout
        const { data: listener } = client.auth.onAuthStateChange((e, session) => {
            setUser(session?.user || null)
        });

        // we also want to un listen auth events when website un renders
        return () => {
            listener.subscription.unsubscribe();
        }

    }, [])

    return (
        <AuthContext.Provider value={{
            user, loading
        }} >
            {children}
        </AuthContext.Provider>
    )

}

export { AuthProvider, AuthContext }
