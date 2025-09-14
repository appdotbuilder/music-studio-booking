<?php

namespace App\Http\Requests;

use App\Models\Studio;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'studio_id' => 'required|exists:studios,id',
            'booking_date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'duration_hours' => 'required|integer|min:1|max:12',
            'notes' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            if (!$validator->errors()->any()) {
                $this->validateStudioAvailability($validator);
            }
        });
    }

    /**
     * Validate that the studio is available for the requested time slot.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    protected function validateStudioAvailability(Validator $validator): void
    {
        $studio = Studio::find($this->studio_id);
        
        if (!$studio || $studio->status !== 'active') {
            $validator->errors()->add('studio_id', 'The selected studio is not available for booking.');
            return;
        }

        $startTime = $this->start_time;
        $durationHours = $this->duration_hours;
        $endTime = date('H:i', strtotime($startTime . ' + ' . $durationHours . ' hours'));

        if (!$studio->isAvailable($this->booking_date, $startTime, $endTime)) {
            $validator->errors()->add('start_time', 'The studio is not available for the selected date and time.');
        }
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'studio_id.required' => 'Please select a studio.',
            'studio_id.exists' => 'The selected studio does not exist.',
            'booking_date.required' => 'Please select a booking date.',
            'booking_date.date' => 'Please provide a valid date.',
            'booking_date.after_or_equal' => 'Booking date cannot be in the past.',
            'start_time.required' => 'Please select a start time.',
            'start_time.date_format' => 'Please provide a valid time format (HH:MM).',
            'duration_hours.required' => 'Please specify the duration.',
            'duration_hours.integer' => 'Duration must be a whole number of hours.',
            'duration_hours.min' => 'Minimum booking duration is 1 hour.',
            'duration_hours.max' => 'Maximum booking duration is 12 hours.',
        ];
    }
}