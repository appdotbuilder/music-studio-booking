import React from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardStats {
    total_bookings: number;
    pending_bookings: number;
    active_studios?: number;
    total_customers?: number;
    monthly_revenue?: number;
    pending_payments?: number;
    completed_bookings?: number;
    total_spent?: number;
}

interface Booking {
    id: number;
    booking_date: string;
    start_time: string;
    end_time: string;
    status: string;
    total_amount: number;
    studio: {
        name: string;
        location: string;
    };
    user?: {
        name: string;
        email: string;
    };
}

interface Payment {
    id: number;
    amount: number;
    payment_method: string;
    status: string;
    created_at: string;
    booking: {
        studio: {
            name: string;
        };
    };
    user: {
        name: string;
    };
}

interface Props {
    stats: DashboardStats;
    recentBookings?: Booking[];
    upcomingBookings?: Booking[];
    pendingPayments?: Payment[];
    [key: string]: unknown;
}

export default function Dashboard({ stats, recentBookings, upcomingBookings, pendingPayments }: Props) {
    const { auth } = usePage<{ auth: { user: { role: string; name: string } } }>().props;
    const isAdmin = auth.user.role === 'admin';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Welcome Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {isAdmin ? '🎛️ Admin Dashboard' : '🎵 Your Dashboard'}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {isAdmin ? 'Manage studios, bookings, and payments' : `Welcome back, ${auth.user.name}!`}
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        {isAdmin ? (
                            <>
                                <Link href={route('studios.create')}>
                                    <Button>🏢 Add Studio</Button>
                                </Link>
                                <Link href={route('bookings.index')}>
                                    <Button variant="outline">📋 All Bookings</Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href={route('bookings.create')}>
                                    <Button>🎤 Book Studio</Button>
                                </Link>
                                <Link href={route('bookings.index')}>
                                    <Button variant="outline">📋 My Bookings</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3 lg:grid-cols-4">
                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.total_bookings}</p>
                            </div>
                            <div className="text-3xl">📊</div>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending Bookings</p>
                                <p className="text-3xl font-bold text-orange-600">{stats.pending_bookings}</p>
                            </div>
                            <div className="text-3xl">⏳</div>
                        </div>
                    </div>

                    {isAdmin ? (
                        <>
                            <div className="rounded-xl border bg-white p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Active Studios</p>
                                        <p className="text-3xl font-bold text-green-600">{stats.active_studios}</p>
                                    </div>
                                    <div className="text-3xl">🏢</div>
                                </div>
                            </div>

                            <div className="rounded-xl border bg-white p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Customers</p>
                                        <p className="text-3xl font-bold text-blue-600">{stats.total_customers}</p>
                                    </div>
                                    <div className="text-3xl">👥</div>
                                </div>
                            </div>

                            <div className="rounded-xl border bg-white p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                                        <p className="text-3xl font-bold text-green-600">${stats.monthly_revenue?.toFixed(2) || '0.00'}</p>
                                    </div>
                                    <div className="text-3xl">💰</div>
                                </div>
                            </div>

                            <div className="rounded-xl border bg-white p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                                        <p className="text-3xl font-bold text-red-600">{stats.pending_payments}</p>
                                    </div>
                                    <div className="text-3xl">💳</div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="rounded-xl border bg-white p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Completed</p>
                                        <p className="text-3xl font-bold text-green-600">{stats.completed_bookings}</p>
                                    </div>
                                    <div className="text-3xl">✅</div>
                                </div>
                            </div>

                            <div className="rounded-xl border bg-white p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Spent</p>
                                        <p className="text-3xl font-bold text-purple-600">${stats.total_spent?.toFixed(2) || '0.00'}</p>
                                    </div>
                                    <div className="text-3xl">💸</div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Recent/Upcoming Bookings */}
                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {isAdmin ? '📋 Recent Bookings' : upcomingBookings?.length ? '🔜 Upcoming Bookings' : '📋 Recent Bookings'}
                            </h2>
                            <Link href={route('bookings.index')}>
                                <Button variant="outline" size="sm">View All</Button>
                            </Link>
                        </div>
                        
                        <div className="space-y-4">
                            {(upcomingBookings || recentBookings)?.slice(0, 5).map((booking) => (
                                <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">{booking.studio.name}</p>
                                        <p className="text-sm text-gray-600">
                                            📍 {booking.studio.location}
                                        </p>
                                        {isAdmin && booking.user && (
                                            <p className="text-sm text-gray-600">
                                                👤 {booking.user.name}
                                            </p>
                                        )}
                                        <p className="text-sm text-gray-500">
                                            📅 {new Date(booking.booking_date).toLocaleDateString()} at {booking.start_time}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">${booking.total_amount}</p>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                            booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            booking.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {booking.status === 'completed' ? '✅ Completed' :
                                             booking.status === 'paid' ? '💳 Paid' :
                                             booking.status === 'pending' ? '⏳ Pending' :
                                             '❌ Cancelled'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            
                            {(!upcomingBookings && !recentBookings) || (upcomingBookings?.length === 0 && recentBookings?.length === 0) ? (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="text-4xl mb-2">🎵</div>
                                    <p>No bookings yet</p>
                                    {!isAdmin && (
                                        <Link href={route('bookings.create')} className="mt-2 inline-block">
                                            <Button size="sm">Book Your First Studio</Button>
                                        </Link>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {/* Pending Payments (Admin only) */}
                    {isAdmin && pendingPayments && (
                        <div className="rounded-xl border bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">💳 Pending Payments</h2>
                                <Link href={route('payments.index')}>
                                    <Button variant="outline" size="sm">View All</Button>
                                </Link>
                            </div>
                            
                            <div className="space-y-4">
                                {pendingPayments.slice(0, 5).map((payment) => (
                                    <div key={payment.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">{payment.booking.studio.name}</p>
                                            <p className="text-sm text-gray-600">👤 {payment.user.name}</p>
                                            <p className="text-sm text-gray-500">
                                                📅 {new Date(payment.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">${payment.amount}</p>
                                            <p className="text-sm text-gray-600 capitalize">{payment.payment_method.replace('_', ' ')}</p>
                                            <Link href={route('payments.show', payment.id)}>
                                                <Button size="sm" variant="outline" className="mt-1">
                                                    Review
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                                
                                {pendingPayments.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <div className="text-4xl mb-2">✅</div>
                                        <p>No pending payments</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {/* Quick Actions for Customers */}
                    {!isAdmin && (
                        <div className="rounded-xl border bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">🚀 Quick Actions</h2>
                            
                            <div className="space-y-3">
                                <Link href={route('bookings.create')} className="block">
                                    <div className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                                        <div className="text-2xl mr-3">🎤</div>
                                        <div>
                                            <p className="font-medium text-gray-900">Book a New Studio</p>
                                            <p className="text-sm text-gray-600">Find and book your perfect studio</p>
                                        </div>
                                    </div>
                                </Link>
                                
                                <Link href={route('studios.index')} className="block">
                                    <div className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                        <div className="text-2xl mr-3">🏢</div>
                                        <div>
                                            <p className="font-medium text-gray-900">Browse Studios</p>
                                            <p className="text-sm text-gray-600">Explore available music studios</p>
                                        </div>
                                    </div>
                                </Link>
                                
                                <Link href={route('bookings.index')} className="block">
                                    <div className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                                        <div className="text-2xl mr-3">📋</div>
                                        <div>
                                            <p className="font-medium text-gray-900">My Booking History</p>
                                            <p className="text-sm text-gray-600">View all your past and current bookings</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}