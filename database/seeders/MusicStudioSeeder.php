<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Studio;
use App\Models\User;
use Illuminate\Database\Seeder;

class MusicStudioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::factory()->admin()->create([
            'name' => 'Admin User',
            'email' => 'admin@studiobook.com',
            'phone' => '+1-555-0100',
        ]);

        // Create some customer users
        $customers = User::factory()->customer()->count(10)->create();

        // Create sample studios
        $studios = [
            [
                'name' => 'Studio A - Professional Recording',
                'location' => '123 Music Row, Nashville, TN',
                'hourly_price' => 150.00,
                'status' => 'active',
                'description' => 'State-of-the-art recording studio with vintage Neve console and premium outboard gear. Perfect for professional recordings, mixing, and mastering.',
                'equipment' => 'Neve 8078 Console, Pro Tools HDX, Neumann U87, AKG C414, SSL G-Comp, Lexicon 480L, Yamaha NS10M',
                'capacity' => 6,
            ],
            [
                'name' => 'Studio B - Rehearsal Space',
                'location' => '456 Band Ave, Los Angeles, CA',
                'hourly_price' => 75.00,
                'status' => 'active',
                'description' => 'Spacious rehearsal room with full backline and professional monitoring. Great for band practice and pre-production.',
                'equipment' => 'Marshall JCM900, Fender Twin Reverb, DW Drum Kit, Ampeg SVT Bass Rig, Shure SM57/58 Mics',
                'capacity' => 8,
            ],
            [
                'name' => 'Studio C - Vocal Booth',
                'location' => '789 Singer St, New York, NY',
                'hourly_price' => 100.00,
                'status' => 'active',
                'description' => 'Intimate vocal recording studio with pristine acoustics and top-tier microphone selection. Perfect for vocals, voice-overs, and acoustic instruments.',
                'equipment' => 'Neumann U67, Telefunken ELA M 251, Avalon VT-737sp, Universal Audio 1176, Acoustic Treatment',
                'capacity' => 3,
            ],
            [
                'name' => 'Studio D - Production Suite',
                'location' => '321 Producer Blvd, Atlanta, GA',
                'hourly_price' => 125.00,
                'status' => 'active',
                'description' => 'Modern production studio equipped with the latest software and hardware for beat making, arrangement, and production.',
                'equipment' => 'Ableton Live, Native Instruments Maschine, Moog Sub 37, Roland Jupiter-8, KRK Rokit monitors',
                'capacity' => 4,
            ],
            [
                'name' => 'Studio E - Mixing & Mastering',
                'location' => '654 Mix Lane, Chicago, IL',
                'hourly_price' => 200.00,
                'status' => 'active',
                'description' => 'Professional mixing and mastering suite with world-class monitoring and analog processing.',
                'equipment' => 'SSL 4000G+, Genelec 1037C, Manley Massive Passive, Tube-Tech CL 1B, Empirical Labs Distressor',
                'capacity' => 2,
            ],
            [
                'name' => 'Studio F - Live Room',
                'location' => '987 Live St, Austin, TX',
                'hourly_price' => 175.00,
                'status' => 'maintenance',
                'description' => 'Large live room perfect for full band recordings with natural reverb and spacious feel.',
                'equipment' => 'Coles 4038, AKG C12, Neumann KM184, SSL E-Series EQ, Empirical Labs EL8 Distressor',
                'capacity' => 10,
            ],
        ];

        foreach ($studios as $studioData) {
            Studio::create($studioData);
        }

        $createdStudios = Studio::all();

        // Create sample bookings
        foreach ($customers->take(5) as $customer) {
            // Create 2-3 bookings per customer
            $bookingCount = random_int(2, 3);
            
            for ($i = 0; $i < $bookingCount; $i++) {
                $studio = $createdStudios->where('status', 'active')->random();
                $bookingDate = fake()->dateTimeBetween('now', '+30 days')->format('Y-m-d');
                $startHour = random_int(9, 18);
                $durationHours = random_int(2, 4);
                $endHour = $startHour + $durationHours;
                
                // Ensure no overlapping bookings for the same studio
                $startTime = sprintf('%02d:00', $startHour);
                $endTime = sprintf('%02d:00', $endHour);
                
                if ($studio->isAvailable($bookingDate, $startTime, $endTime)) {
                    Booking::create([
                        'user_id' => $customer->id,
                        'studio_id' => $studio->id,
                        'booking_date' => $bookingDate,
                        'start_time' => $startTime,
                        'end_time' => $endTime,
                        'duration_hours' => $durationHours,
                        'total_amount' => $studio->hourly_price * $durationHours,
                        'paid_amount' => fake()->boolean(60) ? $studio->hourly_price * $durationHours : 0,
                        'status' => fake()->randomElement(['pending', 'paid', 'completed']),
                        'notes' => fake()->optional()->sentence(),
                        'payment_verified_at' => fake()->optional(0.4)->dateTimeThisMonth(),
                        'verified_by' => fake()->boolean(40) ? $admin->id : null,
                    ]);
                }
            }
        }
    }
}