<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Studio;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index()
    {
        $user = auth()->user();
        
        if ($user->isAdmin()) {
            return $this->adminDashboard();
        }
        
        return $this->customerDashboard();
    }

    /**
     * Display the admin dashboard.
     */
    protected function adminDashboard()
    {
        $stats = [
            'total_bookings' => Booking::count(),
            'pending_bookings' => Booking::where('status', 'pending')->count(),
            'active_studios' => Studio::where('status', 'active')->count(),
            'total_customers' => User::customers()->count(),
            'monthly_revenue' => Booking::where('status', 'completed')
                ->whereMonth('created_at', now()->month)
                ->sum('total_amount'),
            'pending_payments' => Payment::where('status', 'pending')->count(),
        ];

        $recentBookings = Booking::with(['user', 'studio'])
            ->latest()
            ->take(10)
            ->get();

        $pendingPayments = Payment::with(['booking.studio', 'user'])
            ->where('status', 'pending')
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recentBookings' => $recentBookings,
            'pendingPayments' => $pendingPayments,
        ]);
    }

    /**
     * Display the customer dashboard.
     */
    protected function customerDashboard()
    {
        $user = auth()->user();
        
        $stats = [
            'total_bookings' => $user->bookings()->count(),
            'pending_bookings' => $user->bookings()->where('status', 'pending')->count(),
            'completed_bookings' => $user->bookings()->where('status', 'completed')->count(),
            'total_spent' => $user->bookings()->where('status', 'completed')->sum('total_amount'),
        ];

        $recentBookings = $user->bookings()
            ->with(['studio'])
            ->latest()
            ->take(5)
            ->get();

        $upcomingBookings = $user->bookings()
            ->with(['studio'])
            ->where('booking_date', '>=', now()->toDateString())
            ->where('status', '!=', 'cancelled')
            ->orderBy('booking_date')
            ->orderBy('start_time')
            ->take(5)
            ->get();

        return Inertia::render('customer/dashboard', [
            'stats' => $stats,
            'recentBookings' => $recentBookings,
            'upcomingBookings' => $upcomingBookings,
        ]);
    }
}