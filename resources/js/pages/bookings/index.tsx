import React from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Bookings',
        href: '/bookings',
    },
];

interface Booking {
    id: number;
    booking_date: string;
    start_time: string;
    end_time: string;
    duration_hours: number;
    total_amount: number;
    paid_amount: number;
    status: string;
    notes: string | null;
    admin_notes: string | null;
    created_at: string;
    updated_at: string;
    studio: {
        id: number;
        name: string;
        location: string;
        hourly_price: number;
    };
    user?: {
        id: number;
        name: string;
        email: string;
    };
    verified_by?: {
        id: number;
        name: string;
    };
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
    bookings: {
        data: Booking[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    [key: string]: unknown;
}

export default function BookingsIndex({ bookings }: Props) {
    const { auth } = usePage<{ auth: { user: { role: string } } }>().props;
    const isAdmin = auth.user?.role === 'admin';

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏳', label: 'Pending' },
            paid: { bg: 'bg-blue-100', text: 'text-blue-800', icon: '💳', label: 'Paid' },
            completed: { bg: 'bg-green-100', text: 'text-green-800', icon: '✅', label: 'Completed' },
            cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: '❌', label: 'Cancelled' },
        };
        
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {config.icon} {config.label}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTime = (timeString: string) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isAdmin ? 'All Bookings' : 'My Bookings'} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {isAdmin ? '📋 All Bookings' : '🎵 My Bookings'}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {isAdmin 
                                ? 'Manage all customer bookings and payments' 
                                : 'View and manage your studio bookings'
                            }
                        </p>
                    </div>
                    
                    <Link href={route('bookings.create')}>
                        <Button>
                            🎤 Book New Studio
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total</p>
                                <p className="text-2xl font-bold">{bookings.meta.total}</p>
                            </div>
                            <div className="text-2xl">📊</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {bookings.data.filter(b => b.status === 'pending').length}
                                </p>
                            </div>
                            <div className="text-2xl">⏳</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {bookings.data.filter(b => b.status === 'completed').length}
                                </p>
                            </div>
                            <div className="text-2xl">✅</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Revenue</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    ${bookings.data
                                        .filter(b => b.status === 'completed')
                                        .reduce((sum, b) => sum + b.total_amount, 0)
                                        .toFixed(0)
                                    }
                                </p>
                            </div>
                            <div className="text-2xl">💰</div>
                        </div>
                    </div>
                </div>

                {/* Bookings Table */}
                <div className="bg-white rounded-lg border">
                    {bookings.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Studio</th>
                                        {isAdmin && <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Customer</th>}
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Date & Time</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Duration</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Amount</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {bookings.data.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">{booking.studio.name}</p>
                                                    <p className="text-sm text-gray-600">📍 {booking.studio.location}</p>
                                                </div>
                                            </td>
                                            {isAdmin && booking.user && (
                                                <td className="px-4 py-4">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{booking.user.name}</p>
                                                        <p className="text-sm text-gray-600">{booking.user.email}</p>
                                                    </div>
                                                </td>
                                            )}
                                            <td className="px-4 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        📅 {formatDate(booking.booking_date)}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        ⏰ {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {booking.duration_hours} hour{booking.duration_hours > 1 ? 's' : ''}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">${booking.total_amount}</p>
                                                    {booking.paid_amount > 0 && (
                                                        <p className="text-sm text-green-600">
                                                            Paid: ${booking.paid_amount}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                {getStatusBadge(booking.status)}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex space-x-2">
                                                    <Link href={route('bookings.show', booking.id)}>
                                                        <Button variant="outline" size="sm">
                                                            👁️ View
                                                        </Button>
                                                    </Link>
                                                    {booking.status === 'pending' && (
                                                        <Link href={route('bookings.edit', booking.id)}>
                                                            <Button variant="ghost" size="sm">
                                                                ✏️ Edit
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🎵</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                            <p className="text-gray-600 mb-4">
                                {isAdmin 
                                    ? 'No customer bookings have been made yet.' 
                                    : "You haven't booked any studios yet."
                                }
                            </p>
                            {!isAdmin && (
                                <Link href={route('bookings.create')}>
                                    <Button>Book Your First Studio</Button>
                                </Link>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {bookings.links && bookings.links.length > 3 && (
                        <div className="border-t px-4 py-3">
                            <div className="flex justify-center">
                                <nav className="flex space-x-2">
                                    {bookings.links.map((link, index: number) => (
                                        link.url ? (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                                    link.active
                                                        ? 'bg-purple-600 text-white'
                                                        : 'bg-white text-gray-700 hover:bg-gray-50 border'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span
                                                key={index}
                                                className="px-3 py-2 rounded-md text-sm font-medium text-gray-400 bg-gray-100"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )
                                    ))}
                                </nav>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}