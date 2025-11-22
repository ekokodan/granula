import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingCart, Zap, ChevronDown } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Home', href: '/' },
  {
    name: 'Solutions',
    href: '#',
    children: [
      { name: 'Residential', href: '/store?category=residential', description: 'Home backup systems' },
      { name: 'Commercial', href: '/store?category=commercial', description: 'Business solutions' },
      { name: 'Grid-Scale', href: '/commercial', description: 'Large-scale projects' },
    ],
  },
  { name: 'Store', href: '/store' },
  { name: 'Deals', href: '/deals' },
  { name: 'System Builder', href: '/builder' },
  { name: 'About', href: '/about' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const location = useLocation()
  const { toggleCart, getItemCount } = useCartStore()
  const itemCount = getItemCount()

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-md border-b border-white/10">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-secondary-600 flex items-center justify-center group-hover:shadow-glow-teal transition-shadow duration-300">
              <Zap className="w-6 h-6 text-navy" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display font-bold text-xl text-white">Pascal Watts</span>
              <span className="block text-xs text-secondary -mt-1">Energy Solutions</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.children ? (
                  <button className={cn(
                    "flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    activeDropdown === item.name
                      ? "text-secondary bg-white/10"
                      : "text-white/80 hover:text-white hover:bg-white/5"
                  )}>
                    {item.name}
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform",
                      activeDropdown === item.name && "rotate-180"
                    )} />
                  </button>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "text-secondary bg-white/10"
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {item.name}
                  </Link>
                )}

                {/* Dropdown */}
                <AnimatePresence>
                  {item.children && activeDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-navy-light border border-white/10 rounded-xl shadow-xl overflow-hidden"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          className="block px-4 py-3 hover:bg-white/5 transition-colors"
                        >
                          <span className="block text-white font-medium">{child.name}</span>
                          <span className="block text-white/60 text-sm">{child.description}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-navy text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {itemCount}
                </motion.span>
              )}
            </button>

            {/* CTA Button */}
            <Link
              to="/builder"
              className="hidden md:inline-flex btn-primary text-sm"
            >
              Get Quote
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/10"
            >
              <div className="py-4 space-y-1">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.children ? (
                      <div className="space-y-1">
                        <span className="block px-4 py-2 text-white/60 text-sm font-medium">
                          {item.name}
                        </span>
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-8 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <Link
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "block px-4 py-2 rounded-lg font-medium",
                          isActive(item.href)
                            ? "text-secondary bg-white/10"
                            : "text-white/80 hover:text-white hover:bg-white/5"
                        )}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
                <div className="pt-4 px-4">
                  <Link
                    to="/builder"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block btn-primary text-center"
                  >
                    Get Your Free Quote
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
