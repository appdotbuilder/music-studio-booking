import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Bookings',
        href: '/bookings',
    },
    {
        title: 'Create Booking',
        href: '/bookings/create',
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
}

interface Props {
    studios: Studio[];
    [key: string]: unknown;
}

export default function CreateBooking({ studios }: Props) {
    const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
    const [totalAmount, setTotalAmount] = useState(0);

    const { data, setData, post, processing, errors } = useForm({
        studio_id: '',
        booking_date: '',
        start_time: '',
        duration_hours: '',
        notes: '',
    });

    const handleStudioChange = (studioId: string) => {
        const studio = studios.find(s => s.id === parseInt(studioId));
        setSelectedStudio(studio || null);
        setData('studio_id', studioId);
        
        if (studio && data.duration_hours) {
            setTotalAmount(studio.hourly_price * parseInt(data.duration_hours as string));
        }
    };

    const handleDurationChange = (duration: string) => {
        const durationNum = parseInt(duration);
        setData('duration_hours', duration);
        
        if (selectedStudio && durationNum) {
            setTotalAmount(selectedStudio.hourly_price * durationNum);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('bookings.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Book a Studio" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">🎤 Book a Music Studio</h1>
                    <p className="text-gray-600 mt-1">Select your preferred studio, date, and time</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Booking Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg border p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Studio Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        🏢 Select Studio
                                    </label>
                                    <select
                                        value={data.studio_id}
                                        onChange={(e) => handleStudioChange(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Choose a studio...</option>
                                        {studios.map((studio) => (
                                            <option 
                                                key={studio.id} 
                                                value={studio.id}
                                                disabled={studio.status !== 'active'}
                                            >
                                                {studio.name} - ${studio.hourly_price}/hour
                                                {studio.status !== 'active' && ' (Unavailable)'}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.studio_id && (
                                        <p className="text-red-500 text-sm mt-1">{errors.studio_id}</p>
                                    )}
                                </div>

                                {/* Date & Time */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            📅 Booking Date
                                        </label>
                                        <input
                                            type="date"
                                            value={data.booking_date}
                                            onChange={(e) => setData('booking_date', e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            required
                                        />
                                        {errors.booking_date && (
                                            <p className="text-red-500 text-sm mt-1">{errors.booking_date}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            ⏰ Start Time
                                        </label>
                                        <input
                                            type="time"
                                            value={data.start_time}
                                            onChange={(e) => setData('start_time', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            required
                                        />
                                        {errors.start_time && (
                                            <p className="text-red-500 text-sm mt-1">{errors.start_time}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Duration */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        ⏱️ Duration (hours)
                                    </label>
                                    <select
                                        value={data.duration_hours}
                                        onChange={(e) => handleDurationChange(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Select duration...</option>
                                        {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((hours) => (
                                            <option key={hours} value={hours}>
                                                {hours} hour{hours > 1 ? 's' : ''}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.duration_hours && (
                                        <p className="text-red-500 text-sm mt-1">{errors.duration_hours}</p>
                                    )}
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        📝 Additional Notes (Optional)
                                    </label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={3}
                                        placeholder="Any special requirements or notes for your session..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                    />
                                    {errors.notes && (
                                        <p className="text-red-500 text-sm mt-1">{errors.notes}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end space-x-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="min-w-[120px]"
                                    >
                                        {processing ? 'Booking...' : '🎤 Book Studio'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Selected Studio Details */}
                        {selectedStudio && (
                            <div className="bg-white rounded-lg border p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">🏢 Selected Studio</h3>
                                
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{selectedStudio.name}</h4>
                                        <p className="text-gray-600 text-sm flex items-center">
                                            📍 {selectedStudio.location}
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-center py-2 border-t">
                                        <span className="text-gray-600">Hourly Rate:</span>
                                        <span className="font-semibold text-purple-600">${selectedStudio.hourly_price}</span>
                                    </div>

                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-600">Capacity:</span>
                                        <span className="font-medium">👥 {selectedStudio.capacity} people</span>
                                    </div>

                                    {selectedStudio.description && (
                                        <div className="pt-2 border-t">
                                            <p className="text-sm text-gray-600">{selectedStudio.description}</p>
                                        </div>
                                    )}

                                    {selectedStudio.equipment && (
                                        <div className="pt-2">
                                            <p className="text-sm font-medium text-gray-900 mb-1">🎛️ Equipment:</p>
                                            <p className="text-sm text-gray-600">{selectedStudio.equipment}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Booking Summary */}
                        <div className="bg-purple-50 rounded-lg border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Booking Summary</h3>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Studio:</span>
                                    <span className="font-medium">
                                        {selectedStudio ? selectedStudio.name : 'Not selected'}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Date:</span>
                                    <span className="font-medium">
                                        {data.booking_date || 'Not selected'}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Time:</span>
                                    <span className="font-medium">
                                        {data.start_time || 'Not selected'}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Duration:</span>
                                    <span className="font-medium">
                                        {data.duration_hours ? `${data.duration_hours} hours` : 'Not selected'}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center pt-3 border-t border-purple-200">
                                    <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                                    <span className="text-2xl font-bold text-purple-600">
                                        ${totalAmount.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {totalAmount > 0 && (
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        💡 <strong>Next steps:</strong> After booking, you'll be able to upload payment proof for admin verification.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Booking Tips */}
                        <div className="bg-gray-50 rounded-lg border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Booking Tips</h3>
                            
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-start">
                                    <span className="mr-2">✅</span>
                                    Book at least 24 hours in advance
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">💳</span>
                                    Payment proof required for confirmation
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">📞</span>
                                    Contact studio for special equipment needs
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">⏰</span>
                                    Arrive 15 minutes early for setup
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}