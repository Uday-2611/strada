"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import client from '@/api/client'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const toggleMenu = () => setIsOpen(!isOpen)

  const navLinks = [
    { title: "Vehicles", href: "/vehicles" },
    { title: "Bookings", href: "/bookings" },
    { title: "Profile", href: "/profile" },
  ]

  return (
    <div className="flex justify-center w-full py-6 px-4">
      <div className="flex items-center justify-between px-6 py-1 bg-white rounded-full shadow-lg w-full max-w-3xl relative z-10">
        <div className="flex items-center">
          <img
            src="/logoBlack.png"
            alt="Strada Logo"
            className="h-14 w-auto object-contain cursor-pointer"
            onClick={() => router.push('/dashboard')}
          />
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((item) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} whileHover={{ scale: 1.05 }} >
              <a onClick={() => router.push(item.href)} className="text-sm text-gray-900 cursor-pointer transition-colors font-medium" >
                {item.title}
              </a>
            </motion.div>
          ))}
        </nav>

        <motion.div className="hidden md:block" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.2 }} whileHover={{ scale: 1.05 }} >
          <Button onClick={() => client.auth.signOut()} className=" text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors text-sm " >
            Sign Out
          </Button>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button className="md:hidden flex items-center" onClick={toggleMenu} whileTap={{ scale: 0.9 }}>
          <Menu className="h-6 w-6 text-gray-900" />
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div className="fixed inset-0 bg-white z-50 pt-24 px-6 md:hidden" initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }} >
            <motion.button className="absolute top-6 right-6 p-2" onClick={toggleMenu} whileTap={{ scale: 0.9 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} >
              <X className="h-6 w-6 text-gray-900" />
            </motion.button>
            <div className="flex flex-col space-y-6">
              {navLinks.map((item, i) => (
                <motion.div key={item.title} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 + 0.1 }} exit={{ opacity: 0, x: 20 }} >
                  <a onClick={() => {
                    router.push(item.href)
                    toggleMenu()
                  }} className="text-base text-gray-900 font-medium cursor-pointer" >
                    {item.title}
                  </a>
                </motion.div>
              ))}

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} exit={{ opacity: 0, y: 20 }} className="pt-6" >
                <Button
                  onClick={() => {
                    client.auth.signOut()
                    toggleMenu()
                  }}
                  className="w-full text-base text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors h-12"
                >
                  Sign Out
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Navbar
