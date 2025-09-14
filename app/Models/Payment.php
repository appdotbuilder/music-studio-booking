<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Payment
 *
 * @property int $id
 * @property int $booking_id
 * @property int $user_id
 * @property float $amount
 * @property string $payment_method
 * @property string $status
 * @property string|null $reference_number
 * @property string|null $notes
 * @property int|null $verified_by
 * @property \Illuminate\Support\Carbon|null $verified_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Booking $booking
 * @property-read \App\Models\User $user
 * @property-read \App\Models\User|null $verifiedBy
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Payment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Payment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Payment query()
 * @method static \Illuminate\Database\Eloquent\Builder|Payment whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Payment whereBookingId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Payment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Payment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Payment whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Payment wherePaymentMethod($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Payment whereReferenceNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Payment whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Payment whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Payment whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Payment whereVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Payment whereVerifiedBy($value)
 * @method static \Database\Factories\PaymentFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Payment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'booking_id',
        'user_id',
        'amount',
        'payment_method',
        'status',
        'reference_number',
        'notes',
        'verified_by',
        'verified_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
        'verified_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the booking this payment belongs to.
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    /**
     * Get the user who made this payment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the admin who verified this payment.
     */
    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /**
     * Verify this payment.
     *
     * @param int $adminId
     * @return void
     */
    public function verify(int $adminId): void
    {
        $this->status = 'verified';
        $this->verified_by = $adminId;
        $this->verified_at = now();
        $this->save();

        // Update booking paid amount
        $this->booking->increment('paid_amount', $this->amount);
        
        // Update booking status if fully paid
        if ($this->booking->isFullyPaid()) {
            $this->booking->updateStatus('paid', $adminId);
        }
    }

    /**
     * Reject this payment.
     *
     * @param int $adminId
     * @return void
     */
    public function reject(int $adminId): void
    {
        $this->status = 'rejected';
        $this->verified_by = $adminId;
        $this->verified_at = now();
        $this->save();
    }
}