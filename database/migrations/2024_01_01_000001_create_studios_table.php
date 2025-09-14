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
        Schema::create('studios', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Studio name');
            $table->string('location')->comment('Studio location/address');
            $table->decimal('hourly_price', 8, 2)->comment('Price per hour in currency');
            $table->enum('status', ['active', 'inactive', 'maintenance'])->default('active')->comment('Studio operational status');
            $table->text('description')->nullable()->comment('Studio description and features');
            $table->text('equipment')->nullable()->comment('Available equipment list');
            $table->integer('capacity')->default(1)->comment('Maximum number of people');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('name');
            $table->index('status');
            $table->index(['status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('studios');
    }
};