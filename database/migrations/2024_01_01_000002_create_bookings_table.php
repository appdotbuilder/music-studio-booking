<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('studio_id')->constrained()->onDelete('cascade');
            $table->date('booking_date')->comment('Date of the booking');
            $table->time('start_time')->comment('Start time of the session');
            $table->time('end_time')->comment('End time of the session');
            $table->integer('duration_hours')->comment('Duration in hours');
            $table->decimal('total_amount', 8, 2)->comment('Total amount to be paid');
            $table->decimal('paid_amount', 8, 2)->default(0)->comment('Amount already paid');
            $table->enum('status', ['pending', 'paid', 'cancelled', 'completed'])->default('pending')->comment('Booking status');
            $table->string('payment_proof_path')->nullable()->comment('Path to payment proof file');
            $table->text('notes')->nullable()->comment('Additional notes or requirements');
            $table->text('admin_notes')->nullable()->comment('Admin notes about the booking');
            $table->timestamp('payment_verified_at')->nullable()->comment('When payment was verified');
            $table->foreignId('verified_by')->nullable()->constrained('users');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('user_id');
            $table->index('studio_id');
            $table->index('booking_date');
            $table->index('status');
            $table->index(['studio_id', 'booking_date', 'start_time']);
            $table->unique(['studio_id', 'booking_date', 'start_time'], 'unique_studio_datetime');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};