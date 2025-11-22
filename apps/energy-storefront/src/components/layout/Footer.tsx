import { Link } from 'react-router-dom'
import { Zap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react'

const footerLinks = {
  solutions: [
    { name: 'Residential Systems', href: '/store?category=residential' },
    { name: 'Commercial Solutions', href: '/store?category=commercial' },
    { name: 'Grid-Scale Projects', href: '/commercial' },
    { name: 'System Builder', href: '/builder' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Partners', href: '/about#partners' },
    { name: 'Case Studies', href: '/about#case-studies' },
    { name: 'Contact', href: '/contact' },
  ],
  support: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Warranty', href: '/warranty' },
    { name: 'Installation Guide', href: '/installation' },
    { name: 'Support Portal', href: '/support' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Return Policy', href: '/returns' },
  ],
}

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
  { name: 'YouTube', icon: Youtube, href: '#' },
]

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-secondary-600 flex items-center justify-center">
                <Zap className="w-6 h-6 text-navy" />
              </div>
              <div>
                <span className="font-display font-bold text-xl">Pascal Watts</span>
                <span className="block text-xs text-secondary -mt-1">Energy Solutions</span>
              </div>
            </Link>
            <p className="text-white/60 mb-6 max-w-sm">
              Premium energy storage solutions for Africa. Cut your power costs by up to 70% with our Grade-A lithium battery systems.
            </p>
            <div className="space-y-3">
              <a href="mailto:hello@pascalwatts.com" className="flex items-center gap-3 text-white/60 hover:text-secondary transition-colors">
                <Mail className="w-5 h-5" />
                hello@pascalwatts.com
              </a>
              <a href="tel:+2348001234567" className="flex items-center gap-3 text-white/60 hover:text-secondary transition-colors">
                <Phone className="w-5 h-5" />
                +234 800 123 4567
              </a>
              <div className="flex items-start gap-3 text-white/60">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>15 Energy Drive, Victoria Island, Lagos, Nigeria</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-display font-semibold mb-4">Solutions</h4>
            <ul className="space-y-3">
              {footerLinks.solutions.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-white/60 hover:text-secondary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-white/60 hover:text-secondary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-white/60 hover:text-secondary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-white/60 hover:text-secondary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-display font-semibold text-lg mb-1">Stay Updated</h4>
              <p className="text-white/60">Get the latest deals and energy tips delivered to your inbox.</p>
            </div>
            <form className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-secondary/50"
              />
              <button type="submit" className="btn-secondary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} Pascal Watts Energy Solutions. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="p-2 rounded-lg text-white/40 hover:text-secondary hover:bg-white/5 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
