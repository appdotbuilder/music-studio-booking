<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\StudioController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Music Studio Booking System - Main functionality on home page
Route::get('/', [StudioController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard routes
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Studio management routes (admin only)
    Route::resource('studios', StudioController::class);
    
    // Booking management routes
    Route::resource('bookings', BookingController::class);
    
    // Payment management routes
    Route::get('/payments', [PaymentController::class, 'index'])->name('payments.index');
    Route::post('/payments', [PaymentController::class, 'store'])->name('payments.store');
    Route::get('/payments/{payment}', [PaymentController::class, 'show'])->name('payments.show');
    Route::patch('/payments/{payment}', [PaymentController::class, 'update'])->name('payments.update');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
