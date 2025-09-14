<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Studio
 *
 * @property int $id
 * @property string $name
 * @property string $location
 * @property float $hourly_price
 * @property string $status
 * @property string|null $description
 * @property string|null $equipment
 * @property int $capacity
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Booking> $bookings
 * @property-read int|null $bookings_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Studio newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Studio newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Studio query()
 * @method static \Illuminate\Database\Eloquent\Builder|Studio whereCapacity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Studio whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Studio whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Studio whereEquipment($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Studio whereHourlyPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Studio whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Studio whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Studio whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Studio whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Studio whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Studio active()
 * @method static \Database\Factories\StudioFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Studio extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'location',
        'hourly_price',
        'status',
        'description',
        'equipment',
        'capacity',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'hourly_price' => 'decimal:2',
        'capacity' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get all bookings for this studio.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Scope a query to only include active studios.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Check if the studio is available for a specific date and time range.
     *
     * @param string $date
     * @param string $startTime
     * @param string $endTime
     * @param int|null $excludeBookingId
     * @return bool
     */
    public function isAvailable(string $date, string $startTime, string $endTime, ?int $excludeBookingId = null): bool
    {
        $query = $this->bookings()
            ->where('booking_date', $date)
            ->where('status', '!=', 'cancelled')
            ->where(function ($q) use ($startTime, $endTime) {
                $q->whereBetween('start_time', [$startTime, $endTime])
                  ->orWhereBetween('end_time', [$startTime, $endTime])
                  ->orWhere(function ($subQ) use ($startTime, $endTime) {
                      $subQ->where('start_time', '<=', $startTime)
                           ->where('end_time', '>=', $endTime);
                  });
            });

        if ($excludeBookingId) {
            $query->where('id', '!=', $excludeBookingId);
        }

        return $query->count() === 0;
    }
}