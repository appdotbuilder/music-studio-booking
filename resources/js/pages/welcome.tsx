import React from 'react';
import { usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface Studio {
    id: number;
    name: string;
    location: string;
    hourly_price: number;
    status: string;
    description: string | null;
    equipment: string | null;
    capacity: number;
    created_at: string;
    updated_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationMeta {
    total: number;
    per_page: number;
    current_page: number;
}

interface Props {
    studios: {
        data: Studio[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    [key: string]: unknown;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export default function Welcome({ studios }: Props) {
    const { auth } = usePage<{ auth: { user: User | null } }>().props;
    const user = auth.user;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="text-2xl font-bold text-purple-600">🎵</div>
                            <h1 className="text-xl font-bold text-gray-900">StudioBook</h1>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-700">Welcome, {user.name}!</span>
                                    <Link href={route('dashboard')}>
                                        <Button variant="outline" size="sm">
                                            📊 Dashboard
                                        </Button>
                                    </Link>
                                    <Link href={route('logout')} method="post" as="button">
                                        <Button variant="ghost" size="sm">
                                            Logout
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Link href={route('login')}>
                                        <Button variant="outline" size="sm">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link href={route('register')}>
                                        <Button size="sm">
                                            Get Started
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
                        🎵 Professional Music Studio Booking
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Book premium music studios with state-of-the-art equipment. Perfect for recording, 
                        rehearsals, and music production. Simple booking, secure payments, professional results.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        {user ? (
                            <Link href={route('bookings.create')}>
                                <Button size="lg" className="text-lg px-8 py-3">
                                    🎤 Book a Studio Now
                                </Button>
                            </Link>
                        ) : (
                            <Link href={route('register')}>
                                <Button size="lg" className="text-lg px-8 py-3">
                                    🎤 Start Booking Studios
                                </Button>
                            </Link>
                        )}
                        <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                            🎧 View Available Studios
                        </Button>
                    </div>

                    {/* Feature highlights */}
                    <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        <div className="text-center p-6 rounded-lg bg-white shadow-sm">
                            <div className="text-3xl mb-3">⚡</div>
                            <h3 className="font-semibold text-gray-900 mb-2">Instant Booking</h3>
                            <p className="text-sm text-gray-600">Real-time availability and instant confirmations</p>
                        </div>
                        <div className="text-center p-6 rounded-lg bg-white shadow-sm">
                            <div className="text-3xl mb-3">💳</div>
                            <h3 className="font-semibold text-gray-900 mb-2">Secure Payment</h3>
                            <p className="text-sm text-gray-600">Multiple payment methods with proof verification</p>
                        </div>
                        <div className="text-center p-6 rounded-lg bg-white shadow-sm">
                            <div className="text-3xl mb-3">🎛️</div>
                            <h3 className="font-semibold text-gray-900 mb-2">Pro Equipment</h3>
                            <p className="text-sm text-gray-600">Industry-standard recording and mixing gear</p>
                        </div>
                        <div className="text-center p-6 rounded-lg bg-white shadow-sm">
                            <div className="text-3xl mb-3">📱</div>
                            <h3 className="font-semibold text-gray-900 mb-2">Easy Management</h3>
                            <p className="text-sm text-gray-600">Track bookings, payments, and history online</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Available Studios Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">🏢 Available Studios</h2>
                        <p className="text-lg text-gray-600">Choose from our collection of professional music studios</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {studios.data.slice(0, 6).map((studio) => (
                            <div key={studio.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">{studio.name}</h3>
                                        <p className="text-gray-600 flex items-center mt-1">
                                            📍 {studio.location}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                        studio.status === 'active' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {studio.status === 'active' ? '✅ Available' : '🔧 Maintenance'}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <p className="text-2xl font-bold text-purple-600">
                                        ${studio.hourly_price}/hour
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        👥 Capacity: {studio.capacity} people
                                    </p>
                                    {studio.description && (
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {studio.description}
                                        </p>
                                    )}
                                </div>

                                {user && studio.status === 'active' ? (
                                    <Link href={route('bookings.create', { studio_id: studio.id })}>
                                        <Button className="w-full">
                                            🎵 Book This Studio
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button variant="outline" className="w-full" disabled={studio.status !== 'active'}>
                                        {studio.status === 'active' ? '🎵 Login to Book' : '🔧 Under Maintenance'}
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    {studios.data.length > 6 && (
                        <div className="text-center mt-12">
                            <Link href={route('studios.index')}>
                                <Button variant="outline" size="lg">
                                    View All Studios ({studios.meta.total})
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* How it Works Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">🔄 How It Works</h2>
                        <p className="text-lg text-gray-600">Simple steps to book your perfect studio</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                1️⃣
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Studios</h3>
                            <p className="text-gray-600">Explore our available studios with detailed information and pricing</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                2️⃣
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Date & Time</h3>
                            <p className="text-gray-600">Choose your preferred date, time, and duration for your session</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                3️⃣
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Make Payment</h3>
                            <p className="text-gray-600">Secure payment with proof upload and admin verification</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                4️⃣
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Creating</h3>
                            <p className="text-gray-600">Arrive at your booked studio and start making music!</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            {!user && (
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-purple-600">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            🚀 Ready to Book Your Studio?
                        </h2>
                        <p className="text-xl text-purple-100 mb-8">
                            Join thousands of musicians who trust StudioBook for their recording needs
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href={route('register')}>
                                <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                                    🎵 Create Account - Free
                                </Button>
                            </Link>
                            <Link href={route('login')}>
                                <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-purple-600">
                                    🔑 Login to Existing Account
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <div className="text-2xl">🎵</div>
                            <h3 className="text-xl font-bold">StudioBook</h3>
                        </div>
                        <p className="text-gray-400 mb-4">
                            Professional music studio booking made simple
                        </p>
                        <div className="flex justify-center space-x-6 text-sm text-gray-400">
                            <span>🎤 Professional Studios</span>
                            <span>💳 Secure Payments</span>
                            <span>📱 Easy Booking</span>
                            <span>🎛️ Pro Equipment</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}