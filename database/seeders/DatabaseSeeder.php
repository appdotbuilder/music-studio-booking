<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            MusicStudioSeeder::class,
        ]);

        // Keep the test user for development
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'role' => 'customer',
        ]);
    }
}
