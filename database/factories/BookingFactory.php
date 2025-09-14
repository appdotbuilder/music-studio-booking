<?php

namespace Database\Factories;

use App\Models\Studio;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startHour = fake()->numberBetween(9, 18);
        $durationHours = fake()->numberBetween(1, 4);
        $endHour = $startHour + $durationHours;
        $hourlyPrice = fake()->randomFloat(2, 50, 300);
        
        return [
            'user_id' => User::factory(),
            'studio_id' => Studio::factory(),
            'booking_date' => fake()->dateTimeBetween('now', '+30 days')->format('Y-m-d'),
            'start_time' => sprintf('%02d:00', $startHour),
            'end_time' => sprintf('%02d:00', $endHour),
            'duration_hours' => $durationHours,
            'total_amount' => $hourlyPrice * $durationHours,
            'paid_amount' => fake()->randomFloat(2, 0, $hourlyPrice * $durationHours),
            'status' => fake()->randomElement(['pending', 'paid', 'cancelled', 'completed']),
            'payment_proof_path' => fake()->optional()->filePath(),
            'notes' => fake()->optional()->sentence(),
            'admin_notes' => fake()->optional()->sentence(),
        ];
    }

    /**
     * Indicate that the booking is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'paid_amount' => 0,
        ]);
    }

    /**
     * Indicate that the booking is paid.
     */
    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'paid',
            'paid_amount' => $attributes['total_amount'],
            'payment_verified_at' => fake()->dateTimeThisMonth(),
            'verified_by' => User::factory()->admin(),
        ]);
    }

    /**
     * Indicate that the booking is cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
        ]);
    }

    /**
     * Indicate that the booking is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'paid_amount' => $attributes['total_amount'],
            'payment_verified_at' => fake()->dateTimeThisMonth(),
            'verified_by' => User::factory()->admin(),
        ]);
    }
}