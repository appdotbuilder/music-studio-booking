<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStudioRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:500',
            'hourly_price' => 'required|numeric|min:0|max:9999.99',
            'status' => 'required|in:active,inactive,maintenance',
            'description' => 'nullable|string|max:1000',
            'equipment' => 'nullable|string|max:1000',
            'capacity' => 'required|integer|min:1|max:50',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Studio name is required.',
            'location.required' => 'Studio location is required.',
            'hourly_price.required' => 'Hourly price is required.',
            'hourly_price.numeric' => 'Hourly price must be a valid number.',
            'hourly_price.min' => 'Hourly price cannot be negative.',
            'status.required' => 'Studio status is required.',
            'status.in' => 'Studio status must be active, inactive, or maintenance.',
            'capacity.required' => 'Studio capacity is required.',
            'capacity.integer' => 'Capacity must be a whole number.',
            'capacity.min' => 'Capacity must be at least 1 person.',
        ];
    }
}