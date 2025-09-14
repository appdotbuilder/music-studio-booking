<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudioRequest;
use App\Http\Requests\UpdateStudioRequest;
use App\Models\Studio;
use Inertia\Inertia;

class StudioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $studios = Studio::latest()->paginate(12);
        
        return Inertia::render('studios/index', [
            'studios' => $studios
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('studios/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStudioRequest $request)
    {
        $studio = Studio::create($request->validated());

        return redirect()->route('studios.show', $studio)
            ->with('success', 'Studio created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Studio $studio)
    {
        return Inertia::render('studios/show', [
            'studio' => $studio->load('bookings.user')
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Studio $studio)
    {
        return Inertia::render('studios/edit', [
            'studio' => $studio
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStudioRequest $request, Studio $studio)
    {
        $studio->update($request->validated());

        return redirect()->route('studios.show', $studio)
            ->with('success', 'Studio updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Studio $studio)
    {
        // Check if studio has active bookings
        $activeBookings = $studio->bookings()->whereNotIn('status', ['cancelled', 'completed'])->count();
        
        if ($activeBookings > 0) {
            return redirect()->back()
                ->with('error', 'Cannot delete studio with active bookings.');
        }

        $studio->delete();

        return redirect()->route('studios.index')
            ->with('success', 'Studio deleted successfully.');
    }
}