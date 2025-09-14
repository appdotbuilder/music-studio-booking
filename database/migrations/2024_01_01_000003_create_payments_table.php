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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 8, 2)->comment('Payment amount');
            $table->enum('payment_method', ['bank_transfer', 'qr_code', 'cash', 'card'])->comment('Payment method used');
            $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending')->comment('Payment verification status');
            $table->string('reference_number')->nullable()->comment('Transaction reference number');
            $table->text('notes')->nullable()->comment('Payment notes or details');
            $table->foreignId('verified_by')->nullable()->constrained('users');
            $table->timestamp('verified_at')->nullable()->comment('When payment was verified');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('booking_id');
            $table->index('user_id');
            $table->index('status');
            $table->index('payment_method');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};