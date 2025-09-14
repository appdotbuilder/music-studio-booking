<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'booking_id' => Booking::factory(),
            'user_id' => User::factory(),
            'amount' => fake()->randomFloat(2, 50, 500),
            'payment_method' => fake()->randomElement(['bank_transfer', 'qr_code', 'cash', 'card']),
            'status' => fake()->randomElement(['pending', 'verified', 'rejected']),
            'reference_number' => fake()->optional()->regexify('[A-Z0-9]{10}'),
            'notes' => fake()->optional()->sentence(),
        ];
    }

    /**
     * Indicate that the payment is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'verified_by' => null,
            'verified_at' => null,
        ]);
    }

    /**
     * Indicate that the payment is verified.
     */
    public function verified(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'verified',
            'verified_by' => User::factory()->admin(),
            'verified_at' => fake()->dateTimeThisMonth(),
        ]);
    }

    /**
     * Indicate that the payment is rejected.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'verified_by' => User::factory()->admin(),
            'verified_at' => fake()->dateTimeThisMonth(),
        ]);
    }
}