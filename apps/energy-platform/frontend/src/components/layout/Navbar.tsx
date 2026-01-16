'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Zap, Menu, X } from 'lucide-react'

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const pathname = usePathname()
    const isHomePage = pathname === '/'

    useEffect(() => {
        let ticking = false
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setIsScrolled(window.scrollY > 20)
                    ticking = false
                })
                ticking = true
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Determine if we should use dark text/elements
    // Use dark text if:
    // 1. We are scrolled (bg is white)
    // 2. We are NOT on the homepage (bg is likely white/light)
    const useDarkTheme = isScrolled || !isHomePage

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-[90] transition-all duration-slow ${useDarkTheme
                ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-cool-200'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="relative h-11 w-28">
                            {/* Show Black Logo when theme is dark (scrolled or not home) */}
                            <div className={`absolute inset-0 transition-opacity duration-normal ${useDarkTheme ? 'opacity-100' : 'opacity-0'}`}>
                                <Image
                                    src="/images/logo_black.png"
                                    alt="gridco"
                                    fill
                                    className="object-contain object-left"
                                    priority
                                />
                            </div>
                            {/* Show White Logo when theme is light (transparent on home) */}
                            <div className={`absolute inset-0 transition-opacity duration-normal ${useDarkTheme ? 'opacity-0' : 'opacity-100'}`}>
                                <Image
                                    src="/images/logo_white.png"
                                    alt="gridco"
                                    fill
                                    className="object-contain object-left"
                                    priority
                                />
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-10">
                        {['Store', 'Builder', 'About'].map((item) => (
                            <Link
                                key={item}
                                href={`/${item.toLowerCase()}`}
                                className={`text-body transition-colors duration-fast ${useDarkTheme ? 'text-gray-cool-600 hover:text-primary-600' : 'text-white/90 hover:text-white'
                                    }`}
                            >
                                {item}
                            </Link>
                        ))}
                        <Link
                            href="/login"
                            className={`text-body transition-colors duration-fast ${useDarkTheme ? 'text-gray-cool-600 hover:text-primary-600' : 'text-white/90 hover:text-white'}`}
                        >
                            Sign In
                        </Link>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex items-center space-x-4">
                        <Link href="/store">
                            <Button className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/25 hover:shadow-xl transition-all duration-normal hover:scale-105 font-medium px-6">
                                Shop Now
                            </Button>
                        </Link>
                        <button
                            className={`md:hidden p-2 ${useDarkTheme ? 'text-gray-cool-600' : 'text-white'}`}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu (Basic implementation) */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-gray-cool-200 p-6 shadow-xl">
                    <div className="flex flex-col space-y-4">
                        {['Store', 'Solutions', 'Builder', 'About'].map((item) => (
                            <Link
                                key={item}
                                href={`/${item.toLowerCase()}`}
                                className="text-body-lg text-gray-cool-800 font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-gray-cool-100 flex flex-col gap-3">
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="outline" className="w-full justify-center">Sign In</Button>
                            </Link>
                            <Link href="/store" onClick={() => setMobileMenuOpen(false)}>
                                <Button className="w-full justify-center">Shop Now</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
