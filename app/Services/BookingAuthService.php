<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Payment;
use App\Models\User;

class BookingAuthService
{
    /**
     * Check if user can view the booking.
     */
    public static function canView(User $user, Booking $booking): bool
    {
        return $user->isAdmin() || $user->id === $booking->user_id;
    }

    /**
     * Check if user can update the booking.
     */
    public static function canUpdate(User $user, Booking $booking): bool
    {
        if ($user->isAdmin()) {
            return true;
        }
        
        // Customers can only update their own pending bookings
        return $user->id === $booking->user_id && $booking->status === 'pending';
    }

    /**
     * Check if user can delete/cancel the booking.
     */
    public static function canDelete(User $user, Booking $booking): bool
    {
        if ($user->isAdmin()) {
            return true;
        }
        
        // Customers can only cancel their own non-completed bookings
        return $user->id === $booking->user_id && $booking->status !== 'completed';
    }

    /**
     * Check if user can manage booking statuses.
     */
    public static function canManage(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Check if user can view the payment.
     */
    public static function canViewPayment(User $user, Payment $payment): bool
    {
        return $user->isAdmin() || $user->id === $payment->user_id;
    }

    /**
     * Check if user can manage payments.
     */
    public static function canManagePayment(User $user): bool
    {
        return $user->isAdmin();
    }
}