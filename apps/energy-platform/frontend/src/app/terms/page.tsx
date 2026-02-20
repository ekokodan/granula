import Navbar from '@/components/layout/Navbar'
import { FileText, ShoppingCart, CreditCard, Truck, Wrench, ShieldCheck, RotateCcw, AlertTriangle, Scale } from 'lucide-react'

export default function TermsOfServicePage() {
    const sections = [
        {
            icon: FileText,
            title: 'Acceptance of Terms',
            content: 'By accessing and using GridCo Energy\'s website and services, you accept and agree to be bound by these Terms of Service. These terms apply to all visitors, users, and customers. If you do not agree with any part of these terms, you may not access our services. We reserve the right to modify these terms at any time, and continued use of our services constitutes acceptance of any changes.'
        },
        {
            icon: ShoppingCart,
            title: 'Products and Pricing',
            content: [
                'All products are subject to availability. We reserve the right to limit quantities and discontinue products.',
                'Prices are displayed in Nigerian Naira (₦) and are inclusive of applicable taxes unless otherwise stated.',
                'We make every effort to display accurate pricing, but errors may occur. We reserve the right to correct pricing errors.',
                'Product specifications are provided by manufacturers and may be subject to change.',
                'Bundle offers and promotional pricing are valid for limited periods and may be withdrawn at any time.',
                'Custom quotes are valid for 30 days from issue date.'
            ]
        },
        {
            icon: CreditCard,
            title: 'Orders and Payment',
            content: [
                'Orders are subject to acceptance and product availability. We reserve the right to refuse or cancel any order.',
                'Payment must be received in full before order processing begins.',
                'We accept payments via Paystack (card payments) and bank transfer.',
                'For custom or large commercial orders, a deposit may be required before production/procurement.',
                'All payments are processed securely. We do not store full credit card details.',
                'You are responsible for ensuring payment information is accurate and up to date.'
            ]
        },
        {
            icon: Truck,
            title: 'Shipping and Delivery',
            content: [
                'Delivery timelines are estimates and not guarantees. Actual delivery may vary based on location and product availability.',
                'Standard delivery for in-stock items is 5-7 business days within Lagos and major cities.',
                'Remote areas may require additional delivery time and fees.',
                'Free shipping applies to orders above specified thresholds as advertised.',
                'Risk of loss and title pass to you upon delivery to the carrier.',
                'You must inspect products upon delivery and report any damage within 48 hours.'
            ]
        },
        {
            icon: Wrench,
            title: 'Installation',
            content: [
                'Professional installation is recommended for all solar systems and is included with select bundles.',
                'Installation scheduling is subject to technician availability and site readiness.',
                'You must provide safe access to installation site and ensure necessary permits are obtained.',
                'Installation does not include electrical wiring upgrades or structural modifications unless specifically quoted.',
                'Our team will conduct a site assessment before installation to confirm system compatibility.',
                'You are responsible for ensuring property readiness for installation.'
            ]
        },
        {
            icon: ShieldCheck,
            title: 'Warranty',
            content: [
                'Products are covered by manufacturer warranties as specified in product documentation.',
                'Warranty periods vary by product: batteries (5-10 years), inverters (2-5 years), solar panels (25 years).',
                'Warranty coverage is void if products are improperly installed, modified, or damaged through misuse.',
                'Warranty claims must be submitted with proof of purchase and installation records.',
                'We facilitate warranty claims but are not responsible for manufacturer warranty fulfillment.',
                'Installation workmanship is warranted for 1 year from installation date.'
            ]
        },
        {
            icon: RotateCcw,
            title: 'Returns and Refunds',
            content: [
                'Unopened products in original packaging may be returned within 14 days of delivery, subject to a 15% restocking fee.',
                'Custom-ordered products, installed systems, and opened batteries are non-returnable.',
                'Defective products may be returned within the warranty period for repair or replacement.',
                'Return shipping costs are the responsibility of the customer unless the product is defective.',
                'Refunds will be processed within 14 business days of receiving the returned product.',
                'Installation fees are non-refundable once work has commenced.'
            ]
        },
        {
            icon: AlertTriangle,
            title: 'Limitation of Liability',
            content: [
                'GridCo Energy is not liable for indirect, incidental, or consequential damages arising from product use.',
                'Our total liability shall not exceed the purchase price of the product in question.',
                'We are not responsible for power generation estimates or energy savings projections.',
                'We are not liable for damage caused by improper installation, use, or maintenance.',
                'System performance may vary based on environmental conditions, usage patterns, and grid availability.',
                'You agree to indemnify GridCo Energy against claims arising from your use of our products and services.'
            ]
        },
        {
            icon: Scale,
            title: 'Governing Law',
            content: 'These Terms of Service are governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes arising from these terms or your use of our services shall be subject to the exclusive jurisdiction of the courts of Nigeria. By using our services, you consent to the jurisdiction and venue of such courts.'
        }
    ]

    return (
        <div className="min-h-screen bg-gray-warm-50">
            <Navbar />
            
            <main className="max-w-4xl mx-auto px-6 lg:px-8 py-24">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-cool-900 mb-4">
                        Terms of Service
                    </h1>
                    <p className="text-gray-cool-600">
                        Last updated: {new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* Introduction */}
                <div className="bg-white rounded-2xl border border-gray-cool-200 p-8 mb-8 shadow-sm">
                    <p className="text-gray-cool-700 leading-relaxed mb-4">
                        Welcome to GridCo Energy. These Terms of Service ("Terms") govern your use of our website, products, 
                        and services. Please read them carefully before making a purchase or using our services.
                    </p>
                    <p className="text-gray-cool-700 leading-relaxed">
                        These Terms constitute a legally binding agreement between you and GridCo Energy regarding your use 
                        of our solar energy products, installation services, and related offerings in Nigeria.
                    </p>
                </div>

                {/* Terms Sections */}
                <div className="space-y-6">
                    {sections.map((section, index) => (
                        <div 
                            key={index} 
                            className="bg-white rounded-2xl border border-gray-cool-200 p-8 shadow-sm"
                        >
                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <section.icon className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="flex-grow">
                                    <h2 className="text-2xl font-bold text-gray-cool-900 mb-4">
                                        {section.title}
                                    </h2>
                                    {Array.isArray(section.content) ? (
                                        <ul className="space-y-3">
                                            {section.content.map((item, itemIndex) => (
                                                <li key={itemIndex} className="flex items-start gap-3">
                                                    <span className="text-blue-600 mt-1.5">•</span>
                                                    <span className="text-gray-cool-700 leading-relaxed flex-1">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-cool-700 leading-relaxed">{section.content}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact Section */}
                <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-gray-cool-900 mb-4">Questions About These Terms?</h3>
                    <p className="text-gray-cool-700 mb-4">
                        If you have any questions or concerns about these Terms of Service, please contact us:
                    </p>
                    <div className="space-y-2 text-gray-cool-700">
                        <p><strong>Email:</strong> legal@gridco.ng</p>
                        <p><strong>Phone:</strong> +234 800 GRIDCO</p>
                        <p><strong>Address:</strong> 123 Solar Avenue, Victoria Island, Lagos, Nigeria</p>
                    </div>
                </div>

                {/* Acknowledgment */}
                <div className="mt-6 bg-white rounded-2xl border border-gray-cool-200 p-6 shadow-sm">
                    <p className="text-sm text-gray-cool-600">
                        By placing an order or using our services, you acknowledge that you have read, understood, and agree 
                        to be bound by these Terms of Service. Your continued use of our website and services constitutes 
                        acceptance of any modifications to these terms.
                    </p>
                </div>
            </main>
        </div>
    )
}
