import React from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Studios',
        href: '/studios',
    },
];

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

export default function StudiosIndex({ studios }: Props) {
    const { auth } = usePage<{ auth: { user: { role: string } } }>().props;
    const isAdmin = auth.user?.role === 'admin';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Studios" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">🏢 Music Studios</h1>
                        <p className="text-gray-600 mt-1">Browse and book professional music studios</p>
                    </div>
                    
                    <div className="flex space-x-3">
                        {isAdmin && (
                            <Link href={route('studios.create')}>
                                <Button>
                                    ➕ Add New Studio
                                </Button>
                            </Link>
                        )}
                        <Link href={route('bookings.create')}>
                            <Button variant="outline">
                                🎤 Book a Studio
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Studios Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {studios.data.map((studio) => (
                        <div key={studio.id} className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                            {studio.name}
                                        </h3>
                                        <p className="text-gray-600 flex items-center text-sm">
                                            📍 {studio.location}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                        studio.status === 'active' 
                                            ? 'bg-green-100 text-green-800' 
                                            : studio.status === 'maintenance'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {studio.status === 'active' && '✅ Available'}
                                        {studio.status === 'maintenance' && '🔧 Maintenance'}
                                        {studio.status === 'inactive' && '❌ Inactive'}
                                    </span>
                                </div>

                                {/* Price & Capacity */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-2xl font-bold text-purple-600">
                                        ${studio.hourly_price}/hour
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        👥 Up to {studio.capacity} people
                                    </div>
                                </div>

                                {/* Description */}
                                {studio.description && (
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {studio.description}
                                    </p>
                                )}

                                {/* Equipment Preview */}
                                {studio.equipment && (
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-900 mb-1">🎛️ Equipment:</p>
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {studio.equipment}
                                        </p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex space-x-2">
                                    <Link href={route('studios.show', studio.id)} className="flex-1">
                                        <Button variant="outline" className="w-full">
                                            👁️ View Details
                                        </Button>
                                    </Link>
                                    
                                    {studio.status === 'active' && (
                                        <Link href={route('bookings.create', { studio_id: studio.id })} className="flex-1">
                                            <Button className="w-full">
                                                🎵 Book Now
                                            </Button>
                                        </Link>
                                    )}
                                    
                                    {isAdmin && (
                                        <Link href={route('studios.edit', studio.id)}>
                                            <Button variant="ghost" size="sm">
                                                ✏️
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {studios.data.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🏢</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No studios found</h3>
                        <p className="text-gray-600 mb-4">There are no studios available at the moment.</p>
                        {isAdmin && (
                            <Link href={route('studios.create')}>
                                <Button>Add First Studio</Button>
                            </Link>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {studios.links && studios.links.length > 3 && (
                    <div className="flex justify-center">
                        <nav className="flex space-x-2">
                            {studios.links.map((link, index: number) => (
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
                )}

                {/* Stats */}
                <div className="bg-white rounded-lg border p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{studios.meta.total}</p>
                            <p className="text-sm text-gray-600">Total Studios</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-600">
                                {studios.data.filter(s => s.status === 'active').length}
                            </p>
                            <p className="text-sm text-gray-600">Available Now</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-yellow-600">
                                {studios.data.filter(s => s.status === 'maintenance').length}
                            </p>
                            <p className="text-sm text-gray-600">Under Maintenance</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-purple-600">
                                ${studios.data.length > 0 
                                    ? Math.min(...studios.data.map(s => s.hourly_price)).toFixed(0)
                                    : '0'}+
                            </p>
                            <p className="text-sm text-gray-600">Starting Price/Hour</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}