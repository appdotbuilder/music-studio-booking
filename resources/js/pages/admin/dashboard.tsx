import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/dashboard',
    },
];

interface DashboardStats {
    total_bookings: number;
    pending_bookings: number;
    active_studios: number;
    total_customers: number;
    monthly_revenue: number;
    pending_payments: number;
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
    user: {
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
    recentBookings: Booking[];
    pendingPayments: Payment[];
    [key: string]: unknown;
}

export default function AdminDashboard({ stats, recentBookings, pendingPayments }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Welcome Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">🎛️ Admin Dashboard</h1>
                        <p className="text-gray-600 mt-1">Manage studios, bookings, and payments</p>
                    </div>
                    <div className="flex space-x-3">
                        <Link href={route('studios.create')}>
                            <Button>🏢 Add Studio</Button>
                        </Link>
                        <Link href={route('bookings.index')}>
                            <Button variant="outline">📋 All Bookings</Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3 lg:grid-cols-6">
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
                                <p className="text-sm font-medium text-gray-600">Pending</p>
                                <p className="text-3xl font-bold text-orange-600">{stats.pending_bookings}</p>
                            </div>
                            <div className="text-3xl">⏳</div>
                        </div>
                    </div>

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
                                <p className="text-sm font-medium text-gray-600">Customers</p>
                                <p className="text-3xl font-bold text-blue-600">{stats.total_customers}</p>
                            </div>
                            <div className="text-3xl">👥</div>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                                <p className="text-3xl font-bold text-green-600">${stats.monthly_revenue.toFixed(0)}</p>
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
                </div>

                {/* Recent Activity */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Recent Bookings */}
                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">📋 Recent Bookings</h2>
                            <Link href={route('bookings.index')}>
                                <Button variant="outline" size="sm">View All</Button>
                            </Link>
                        </div>
                        
                        <div className="space-y-4">
                            {recentBookings.slice(0, 5).map((booking) => (
                                <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">{booking.studio.name}</p>
                                        <p className="text-sm text-gray-600">👤 {booking.user.name}</p>
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
                            
                            {recentBookings.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="text-4xl mb-2">📋</div>
                                    <p>No bookings yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pending Payments */}
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
                </div>
            </div>
        </AppLayout>
    );
}