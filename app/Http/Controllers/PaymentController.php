<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use App\Services\BookingAuthService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    /**
     * Display a listing of payments.
     */
    public function index()
    {
        $user = auth()->user();
        
        if ($user->isAdmin()) {
            $payments = Payment::with(['booking.studio', 'user', 'verifiedBy'])
                ->latest()
                ->paginate(20);
        } else {
            $payments = $user->payments()
                ->with(['booking.studio', 'verifiedBy'])
                ->latest()
                ->paginate(20);
        }
        
        return Inertia::render('payments/index', [
            'payments' => $payments
        ]);
    }

    /**
     * Store a newly created payment.
     */
    public function store(Request $request)
    {
        $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'amount' => 'required|numeric|min:0.01',
            'payment_method' => 'required|in:bank_transfer,qr_code,cash,card',
            'reference_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        $booking = Booking::findOrFail($request->booking_id);
        
        // Check if user can make payment for this booking
        if (auth()->user()->isCustomer() && $booking->user_id !== auth()->id()) {
            return redirect()->back()
                ->with('error', 'You can only make payments for your own bookings.');
        }

        $payment = Payment::create([
            'booking_id' => $booking->id,
            'user_id' => auth()->id(),
            'amount' => $request->amount,
            'payment_method' => $request->payment_method,
            'reference_number' => $request->reference_number,
            'notes' => $request->notes,
        ]);

        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Payment recorded successfully. Awaiting verification.');
    }

    /**
     * Display the specified payment.
     */
    public function show(Payment $payment)
    {
        if (!BookingAuthService::canViewPayment(auth()->user(), $payment)) {
            abort(403, 'Unauthorized');
        }
        
        return Inertia::render('payments/show', [
            'payment' => $payment->load(['booking.studio', 'user', 'verifiedBy'])
        ]);
    }

    /**
     * Update the specified payment status.
     */
    public function update(Request $request, Payment $payment)
    {
        if (!BookingAuthService::canManagePayment(auth()->user())) {
            abort(403, 'Unauthorized');
        }
        
        $request->validate([
            'status' => 'required|in:pending,verified,rejected',
        ]);

        if ($request->status === 'verified') {
            $payment->verify(auth()->id());
        } elseif ($request->status === 'rejected') {
            $payment->reject(auth()->id());
        }
        
        return redirect()->back()
            ->with('success', 'Payment status updated successfully.');
    }
}