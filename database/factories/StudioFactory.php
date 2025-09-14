<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Studio>
 */
class StudioFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Studio ' . fake()->randomLetter() . random_int(1, 99),
            'location' => fake()->address(),
            'hourly_price' => fake()->randomFloat(2, 50, 300),
            'status' => fake()->randomElement(['active', 'inactive', 'maintenance']),
            'description' => fake()->paragraph(),
            'equipment' => fake()->words(10, true),
            'capacity' => fake()->numberBetween(1, 8),
        ];
    }

    /**
     * Indicate that the studio is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }

    /**
     * Indicate that the studio is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'inactive',
        ]);
    }

    /**
     * Indicate that the studio is under maintenance.
     */
    public function maintenance(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'maintenance',
        ]);
    }
}