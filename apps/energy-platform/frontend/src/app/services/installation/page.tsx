import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
    Wrench, 
    ClipboardCheck, 
    Ruler, 
    Hammer, 
    CheckCircle2, 
    Award, 
    MapPin, 
    Calculator,
    Phone,
    Mail
} from 'lucide-react'

export default function InstallationPage() {
    const processSteps = [
        {
            icon: ClipboardCheck,
            title: 'Site Assessment',
            description: 'Our certified technicians visit your property to evaluate roof structure, electrical system, sun exposure, and optimal panel placement. We measure everything and identify any modifications needed.',
            duration: '1-2 hours'
        },
        {
            icon: Ruler,
            title: 'System Design',
            description: 'Based on the assessment, we create a detailed installation plan including panel layout, inverter placement, cable routing, and battery location. You receive a complete blueprint before work begins.',
            duration: '2-3 days'
        },
        {
            icon: Hammer,
            title: 'Professional Installation',
            description: 'Our installation team mounts panels, installs inverters and batteries, runs wiring, and connects everything according to electrical codes. All work is supervised by a certified electrician.',
            duration: '1-3 days'
        },
        {
            icon: CheckCircle2,
            title: 'Commissioning & Testing',
            description: 'We test the entire system under load, verify all safety mechanisms, configure inverter settings, and ensure optimal performance. Every connection is inspected and certified.',
            duration: '2-4 hours'
        },
        {
            icon: Award,
            title: 'Handover & Training',
            description: 'You receive complete documentation, warranty cards, and hands-on training on system operation, monitoring, and basic maintenance. We don\'t leave until you\'re confident using your system.',
            duration: '1 hour'
        }
    ]

    const serviceAreas = [
        { city: 'Lagos', status: 'Available' },
        { city: 'Abuja', status: 'Available' },
        { city: 'Port Harcourt', status: 'Available' },
        { city: 'Ibadan', status: 'Available' },
        { city: 'Kano', status: 'Available' },
        { city: 'Benin City', status: 'Expanding' },
        { city: 'Enugu', status: 'Expanding' },
        { city: 'Calabar', status: 'Expanding' }
    ]

    const whyChooseUs = [
        {
            icon: Award,
            title: 'Certified Technicians',
            description: 'All installers are SETA-certified and undergo continuous training on latest solar technologies.'
        },
        {
            icon: CheckCircle2,
            title: '1-Year Workmanship Warranty',
            description: 'Every installation is guaranteed for 1 year. Any issues related to our work are fixed free of charge.'
        },
        {
            icon: ClipboardCheck,
            title: 'Code Compliance',
            description: 'All installations meet Nigerian electrical codes and safety standards. Documentation provided for permits.'
        },
        {
            icon: Phone,
            title: 'Ongoing Support',
            description: 'Post-installation support via phone, email, and WhatsApp. Annual maintenance packages available.'
        }
    ]

    return (
        <div className="min-h-screen bg-gray-warm-50">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
                {/* Hero */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
                        <Wrench className="w-12 h-12 text-orange-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-cool-900 mb-4">
                        Professional Installation
                    </h1>
                    <p className="text-lg text-gray-cool-600 max-w-2xl mx-auto">
                        Expert solar installation services across Nigeria. From residential rooftops to commercial facilities, 
                        we ensure your system is installed safely and performs optimally.
                    </p>
                </div>

                {/* Process Steps */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-cool-900 mb-8 text-center">Our Installation Process</h2>
                    <div className="space-y-6">
                        {processSteps.map((step, index) => (
                            <div 
                                key={index}
                                className="bg-white rounded-2xl border border-gray-cool-200 p-8 shadow-sm hover:shadow-lg transition-shadow"
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 bg-orange-50 rounded-xl flex items-center justify-center">
                                                <step.icon className="h-8 w-8 text-orange-600" />
                                            </div>
                                            <div className="md:hidden">
                                                <h3 className="text-xl font-bold text-gray-cool-900">{step.title}</h3>
                                                <p className="text-sm text-orange-600 font-medium">{step.duration}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-grow">
                                        <div className="hidden md:flex items-center justify-between mb-3">
                                            <h3 className="text-2xl font-bold text-gray-cool-900">{step.title}</h3>
                                            <span className="text-sm text-orange-600 font-medium bg-orange-50 px-3 py-1 rounded-full">
                                                {step.duration}
                                            </span>
                                        </div>
                                        <p className="text-gray-cool-700 leading-relaxed">{step.description}</p>
                                    </div>
                                    <div className="hidden md:flex items-center">
                                        <div className="text-6xl font-bold text-gray-cool-100">
                                            {index + 1}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Why Choose Us */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-cool-900 mb-8 text-center">Why Choose Our Installation Service</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {whyChooseUs.map((item, index) => (
                            <div 
                                key={index}
                                className="bg-white rounded-2xl border border-gray-cool-200 p-6 shadow-sm text-center hover:shadow-lg transition-shadow"
                            >
                                <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-50 rounded-xl mb-4">
                                    <item.icon className="h-7 w-7 text-emerald-600" />
                                </div>
                                <h3 className="font-bold text-gray-cool-900 mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-cool-600">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Service Areas */}
                <div className="bg-white rounded-2xl border border-gray-cool-200 p-8 md:p-12 shadow-sm mb-12">
                    <div className="flex items-center gap-3 mb-8">
                        <MapPin className="h-8 w-8 text-emerald-600" />
                        <h2 className="text-3xl font-bold text-gray-cool-900">Service Areas</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {serviceAreas.map((area, index) => (
                            <div 
                                key={index}
                                className="flex items-center justify-between p-4 bg-gray-warm-50 rounded-xl"
                            >
                                <span className="font-medium text-gray-cool-900">{area.city}</span>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                    area.status === 'Available' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {area.status}
                                </span>
                            </div>
                        ))}
                    </div>
                    <p className="text-gray-cool-600 text-center">
                        <span className="font-semibold">Expanding nationwide!</span> Don't see your city? 
                        Contact us — we may be able to arrange installation in your area.
                    </p>
                </div>

                {/* Installation Calculator Coming Soon */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 md:p-12 text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <Calculator className="h-8 w-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-cool-900 mb-3">
                        Installation Cost Calculator
                    </h2>
                    <p className="text-gray-cool-700 mb-6 max-w-2xl mx-auto">
                        We're building an interactive tool to estimate installation costs based on your system size, 
                        roof type, location, and complexity. Check back soon!
                    </p>
                    <Button disabled className="bg-blue-600 text-white">
                        Coming Soon
                    </Button>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 md:p-12 text-white text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="text-emerald-50 mb-8 max-w-2xl mx-auto">
                        Schedule a free site assessment or speak with our installation team to discuss your project. 
                        We'll help you design the perfect solar solution for your property.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/contact">
                            <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50">
                                <ClipboardCheck className="h-5 w-5 mr-2" />
                                Request Consultation
                            </Button>
                        </Link>
                        <a href="tel:+2348000000000">
                            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                                <Phone className="h-5 w-5 mr-2" />
                                Call Us Now
                            </Button>
                        </a>
                    </div>
                </div>
            </main>
        </div>
    )
}
