import Navbar from '@/components/layout/Navbar'
import { Shield, Eye, Lock, Users, Cookie, Mail } from 'lucide-react'

export default function PrivacyPolicyPage() {
    const sections = [
        {
            icon: Eye,
            title: 'Information We Collect',
            content: [
                'Personal information you provide: name, email, phone number, address, and payment details when you make a purchase or create an account.',
                'Automatically collected information: IP address, browser type, device information, and usage data through cookies and similar technologies.',
                'Communication data: records of your interactions with our customer support team.',
                'Installation data: property details and energy consumption patterns when you request installation services.'
            ]
        },
        {
            icon: Lock,
            title: 'How We Use Your Information',
            content: [
                'Process and fulfill your orders for solar equipment and installation services.',
                'Communicate with you about your orders, deliveries, and installation schedules.',
                'Provide customer support and respond to your inquiries.',
                'Send you marketing communications about our products and services (with your consent).',
                'Improve our website, products, and services based on usage patterns.',
                'Comply with legal obligations and enforce our terms of service.',
                'Detect and prevent fraud and security threats.'
            ]
        },
        {
            icon: Users,
            title: 'Data Sharing and Disclosure',
            content: [
                'Service Providers: We share data with trusted partners who help us operate our business, including Paystack for payment processing, logistics partners for delivery, and installation contractors.',
                'Legal Requirements: We may disclose information to comply with Nigerian laws, regulations, or legal proceedings.',
                'Business Transfers: Your information may be transferred if GridCo is involved in a merger, acquisition, or sale of assets.',
                'With Your Consent: We may share information for other purposes with your explicit permission.',
                'We do not sell your personal information to third parties for marketing purposes.'
            ]
        },
        {
            icon: Cookie,
            title: 'Cookies and Tracking Technologies',
            id: 'cookies',
            content: [
                'We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content.',
                'Essential Cookies: Required for basic site functionality (shopping cart, checkout).',
                'Analytics Cookies: Help us understand how visitors interact with our website.',
                'Marketing Cookies: Used to deliver relevant advertisements and measure campaign effectiveness.',
                'You can control cookie preferences through your browser settings, though disabling certain cookies may affect site functionality.'
            ]
        },
        {
            icon: Shield,
            title: 'Your Rights',
            content: [
                'Access: Request a copy of the personal information we hold about you.',
                'Correction: Ask us to update or correct inaccurate information.',
                'Deletion: Request deletion of your personal data, subject to legal retention requirements.',
                'Objection: Opt out of marketing communications at any time.',
                'Data Portability: Request your data in a structured, machine-readable format.',
                'To exercise these rights, contact us at privacy@gridco.ng.'
            ]
        },
        {
            icon: Lock,
            title: 'Data Security',
            content: [
                'We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, or destruction.',
                'Payment information is processed through Paystack, a PCI DSS compliant payment processor. We do not store your full credit card details.',
                'Our website uses SSL/TLS encryption for secure data transmission.',
                'Access to personal data is restricted to authorized personnel only.',
                'While we strive to protect your information, no method of transmission over the internet is 100% secure.'
            ]
        }
    ]

    return (
        <div className="min-h-screen bg-gray-warm-50">
            <Navbar />
            
            <main className="max-w-4xl mx-auto px-6 lg:px-8 py-24">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                        <Shield className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-cool-900 mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-gray-cool-600">
                        Last updated: {new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* Introduction */}
                <div className="bg-white rounded-2xl border border-gray-cool-200 p-8 mb-8 shadow-sm">
                    <p className="text-gray-cool-700 leading-relaxed mb-4">
                        GridCo Energy ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy 
                        explains how we collect, use, disclose, and safeguard your information when you visit our website 
                        or purchase our solar energy products and services in Nigeria.
                    </p>
                    <p className="text-gray-cool-700 leading-relaxed">
                        By using our services, you agree to the collection and use of information in accordance with this policy. 
                        If you do not agree with our policies and practices, please do not use our services.
                    </p>
                </div>

                {/* Policy Sections */}
                <div className="space-y-6">
                    {sections.map((section, index) => (
                        <div 
                            key={index} 
                            id={section.id}
                            className="bg-white rounded-2xl border border-gray-cool-200 p-8 shadow-sm"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <section.icon className="h-6 w-6 text-emerald-600" />
                                </div>
                                <div className="flex-grow">
                                    <h2 className="text-2xl font-bold text-gray-cool-900 mb-4">
                                        {section.title}
                                    </h2>
                                    <ul className="space-y-3">
                                        {section.content.map((item, itemIndex) => (
                                            <li key={itemIndex} className="flex items-start gap-3">
                                                <span className="text-emerald-600 mt-1.5">•</span>
                                                <span className="text-gray-cool-700 leading-relaxed flex-1">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact Section */}
                <div className="mt-8 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-8">
                    <div className="flex items-start gap-4">
                        <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Mail className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-cool-900 mb-2">Contact Us</h3>
                            <p className="text-gray-cool-700 mb-4">
                                If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
                            </p>
                            <div className="space-y-2 text-gray-cool-700">
                                <p><strong>Email:</strong> privacy@gridco.ng</p>
                                <p><strong>Phone:</strong> +234 800 GRIDCO</p>
                                <p><strong>Address:</strong> 123 Solar Avenue, Victoria Island, Lagos, Nigeria</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Governing Law */}
                <div className="mt-6 bg-white rounded-2xl border border-gray-cool-200 p-6 shadow-sm">
                    <p className="text-sm text-gray-cool-600">
                        This Privacy Policy is governed by and construed in accordance with the laws of the Federal Republic of Nigeria, 
                        including the Nigeria Data Protection Regulation (NDPR). Any disputes arising from this policy will be subject 
                        to the exclusive jurisdiction of Nigerian courts.
                    </p>
                </div>
            </main>
        </div>
    )
}
