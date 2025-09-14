<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Booking
 *
 * @property int $id
 * @property int $user_id
 * @property int $studio_id
 * @property string $booking_date
 * @property string $start_time
 * @property string $end_time
 * @property int $duration_hours
 * @property float $total_amount
 * @property float $paid_amount
 * @property string $status
 * @property string|null $payment_proof_path
 * @property string|null $notes
 * @property string|null $admin_notes
 * @property \Illuminate\Support\Carbon|null $payment_verified_at
 * @property int|null $verified_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @property-read \App\Models\Studio $studio
 * @property-read \App\Models\User|null $verifiedBy
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Payment> $payments
 * @property-read int|null $payments_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Booking newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Booking newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Booking query()
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereAdminNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereBookingDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereDurationHours($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereEndTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking wherePaidAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking wherePaymentProofPath($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking wherePaymentVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereStartTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereStudioId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereTotalAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereVerifiedBy($value)
 * @method static \Database\Factories\BookingFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Booking extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'studio_id',
        'booking_date',
        'start_time',
        'end_time',
        'duration_hours',
        'total_amount',
        'paid_amount',
        'status',
        'payment_proof_path',
        'notes',
        'admin_notes',
        'payment_verified_at',
        'verified_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'booking_date' => 'date',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'duration_hours' => 'integer',
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'payment_verified_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user who made this booking.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the studio for this booking.
     */
    public function studio(): BelongsTo
    {
        return $this->belongsTo(Studio::class);
    }

    /**
     * Get the admin who verified the payment.
     */
    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /**
     * Get all payments for this booking.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Get the remaining amount to be paid.
     *
     * @return float
     */
    public function getRemainingAmountAttribute(): float
    {
        return $this->total_amount - $this->paid_amount;
    }

    /**
     * Check if the booking is fully paid.
     *
     * @return bool
     */
    public function isFullyPaid(): bool
    {
        return $this->paid_amount >= $this->total_amount;
    }

    /**
     * Update the booking status and handle related operations.
     *
     * @param string $status
     * @param int|null $verifiedBy
     * @return void
     */
    public function updateStatus(string $status, ?int $verifiedBy = null): void
    {
        $this->status = $status;
        
        if ($status === 'paid' && $verifiedBy) {
            $this->payment_verified_at = now();
            $this->verified_by = $verifiedBy;
        }
        
        $this->save();
    }
}