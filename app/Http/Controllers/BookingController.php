<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Models\Booking;
use App\Models\Studio;
use App\Services\BookingAuthService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        
        if ($user->isAdmin()) {
            $bookings = Booking::with(['user', 'studio', 'verifiedBy'])
                ->latest()
                ->paginate(20);
        } else {
            $bookings = $user->bookings()
                ->with(['studio', 'verifiedBy'])
                ->latest()
                ->paginate(20);
        }
        
        return Inertia::render('bookings/index', [
            'bookings' => $bookings
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $studios = Studio::active()->get();
        
        return Inertia::render('bookings/create', [
            'studios' => $studios
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBookingRequest $request)
    {
        $studio = Studio::findOrFail($request->studio_id);
        $startTime = $request->start_time;
        $durationHours = $request->duration_hours;
        $endTime = date('H:i', strtotime($startTime . ' + ' . $durationHours . ' hours'));
        
        $booking = Booking::create([
            'user_id' => auth()->id(),
            'studio_id' => $studio->id,
            'booking_date' => $request->booking_date,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'duration_hours' => $durationHours,
            'total_amount' => $studio->hourly_price * $durationHours,
            'notes' => $request->notes,
        ]);

        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Booking created successfully! Please proceed with payment.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Booking $booking)
    {
        if (!BookingAuthService::canView(auth()->user(), $booking)) {
            abort(403, 'Unauthorized');
        }
        
        return Inertia::render('bookings/show', [
            'booking' => $booking->load(['user', 'studio', 'verifiedBy', 'payments'])
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Booking $booking)
    {
        if (!BookingAuthService::canUpdate(auth()->user(), $booking)) {
            abort(403, 'Unauthorized');
        }
        
        $studios = Studio::active()->get();
        
        return Inertia::render('bookings/edit', [
            'booking' => $booking,
            'studios' => $studios
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Booking $booking)
    {
        if (!BookingAuthService::canUpdate(auth()->user(), $booking)) {
            abort(403, 'Unauthorized');
        }
        
        // Handle payment proof upload
        if ($request->hasFile('payment_proof')) {
            $request->validate([
                'payment_proof' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120', // 5MB max
            ]);

            if ($booking->status !== 'pending') {
                return redirect()->back()
                    ->with('error', 'Payment proof can only be uploaded for pending bookings.');
            }

            $file = $request->file('payment_proof');
            $path = $file->store('payment-proofs', 'public');
            
            $booking->update([
                'payment_proof_path' => $path,
            ]);

            return redirect()->back()
                ->with('success', 'Payment proof uploaded successfully. Awaiting admin verification.');
        }
        
        // Handle admin status update
        if ($request->has('status') && auth()->user()->isAdmin()) {
            $request->validate([
                'status' => 'required|in:pending,paid,cancelled,completed',
                'admin_notes' => 'nullable|string|max:1000',
            ]);

            $booking->admin_notes = $request->admin_notes;
            $booking->updateStatus($request->status, auth()->id());

            return redirect()->back()
                ->with('success', 'Booking status updated successfully.');
        }
        
        // Handle regular booking update
        $request->validate([
            'studio_id' => 'required|exists:studios,id',
            'booking_date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'duration_hours' => 'required|integer|min:1|max:12',
            'notes' => 'nullable|string|max:1000',
        ]);
        
        if ($booking->status !== 'pending') {
            return redirect()->back()
                ->with('error', 'Only pending bookings can be modified.');
        }

        $studio = Studio::findOrFail($request->studio_id);
        $startTime = $request->start_time;
        $durationHours = $request->duration_hours;
        $endTime = date('H:i', strtotime($startTime . ' + ' . $durationHours . ' hours'));
        
        $booking->update([
            'studio_id' => $studio->id,
            'booking_date' => $request->booking_date,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'duration_hours' => $durationHours,
            'total_amount' => $studio->hourly_price * $durationHours,
            'notes' => $request->notes,
        ]);

        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Booking updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Booking $booking)
    {
        if (!BookingAuthService::canDelete(auth()->user(), $booking)) {
            abort(403, 'Unauthorized');
        }
        
        if ($booking->status === 'completed') {
            return redirect()->back()
                ->with('error', 'Completed bookings cannot be cancelled.');
        }

        $booking->updateStatus('cancelled');

        return redirect()->route('bookings.index')
            ->with('success', 'Booking cancelled successfully.');
    }


}