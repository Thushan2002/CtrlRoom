<?php

namespace App\Http\Controllers;

use App\Models\Computer;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class ComputerController extends Controller
{
    /**
     * Display a listing of the computers.
     *
     * @param Request $request
     * @return JsonResponse
     */
   public function index(Request $request): JsonResponse
{
    $query = Computer::query();

    // Filter by system status
    if ($request->has('system_status')) {
        $query->where('system_status', $request->system_status);
    }

    // Filter by location
    if ($request->has('location')) {
        $query->where('location', 'like', '%' . $request->location . '%');
    }

    // Search in OS, processor, or asset tag
    if ($request->has('search')) {
        $search = $request->search;
        $query->where(function ($q) use ($search) {
            $q->where('os', 'like', '%' . $search . '%')
              ->orWhere('processor', 'like', '%' . $search . '%')
              ->orWhere('asset_tag', 'like', '%' . $search . '%')
              ->orWhere('location', 'like', '%' . $search . '%');
        });
    }

    // Get per_page from request or use default (15) and cast to integer
    $perPage = (int) $request->get('per_page', 15);
    
    // Validate per_page to prevent excessively large numbers
    $perPage = min($perPage, 100); // Maximum 100 items per page
    $perPage = max($perPage, 1);   // Minimum 1 item per page

    $computers = $query->orderBy('created_at', 'desc')->paginate($perPage);

    return response()->json([
        'success' => true,
        'data' => $computers,
    ]);
}
    /**
     * Store a newly created computer in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'system_status' => ['required', Rule::in(Computer::getSystemStatuses())],
            'complaints' => 'nullable|array',
            'os' => 'nullable|string|max:255',
            'processor' => 'nullable|string|max:255',
            'ram' => 'nullable|string|max:255',
            'storage' => 'nullable|string|max:255',
            'graphics_card' => 'nullable|string|max:255',
            'motherboard' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'asset_tag' => 'nullable|string|max:255|unique:computers,asset_tag',
        ]);

        $computer = Computer::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Computer created successfully',
            'data' => $computer,
        ], 201);
    }

    /**
     * Display the specified computer.
     *
     * @param Computer $computer
     * @return JsonResponse
     */
    public function show(Computer $computer): JsonResponse
    {
        $computer->load('software');
        
        return response()->json([
            'success' => true,
            'data' => $computer,
        ]);
    }

    /**
     * Update the specified computer in storage.
     *
     * @param Request $request
     * @param Computer $computer
     * @return JsonResponse
     */
    public function update(Request $request, Computer $computer): JsonResponse
    {
        $validated = $request->validate([
            'system_status' => ['sometimes', Rule::in(Computer::getSystemStatuses())],
            'complaints' => 'nullable|array',
            'os' => 'nullable|string|max:255',
            'processor' => 'nullable|string|max:255',
            'ram' => 'nullable|string|max:255',
            'storage' => 'nullable|string|max:255',
            'graphics_card' => 'nullable|string|max:255',
            'motherboard' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'asset_tag' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('computers', 'asset_tag')->ignore($computer->id)
            ],
        ]);

        $computer->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Computer updated successfully',
            'data' => $computer->fresh(),
        ]);
    }

    /**
     * Remove the specified computer from storage.
     *
     * @param Computer $computer
     * @return JsonResponse
     */
    public function destroy(Computer $computer): JsonResponse
    {
        $computer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Computer deleted successfully',
        ]);
    }

    /**
     * Get computers by system status.
     *
     * @param string $status
     * @return JsonResponse
     */
    public function getByStatus(string $status): JsonResponse
    {
        if (!in_array($status, Computer::getSystemStatuses())) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid system status',
            ], 400);
        }

        $computers = Computer::where('system_status', $status)
                           ->orderBy('created_at', 'desc')
                           ->get();

        return response()->json([
            'success' => true,
            'data' => $computers,
        ]);
    }

    /**
     * Update computer system status.
     *
     * @param Request $request
     * @param Computer $computer
     * @return JsonResponse
     */
    public function updateStatus(Request $request, Computer $computer): JsonResponse
    {
        $validated = $request->validate([
            'system_status' => ['required', Rule::in(Computer::getSystemStatuses())],
        ]);

        $computer->update(['system_status' => $validated['system_status']]);

        return response()->json([
            'success' => true,
            'message' => 'Computer status updated successfully',
            'data' => $computer->fresh(),
        ]);
    }

    /**
     * Add or update complaints for a computer.
     *
     * @param Request $request
     * @param Computer $computer
     * @return JsonResponse
     */
    public function updateComplaints(Request $request, Computer $computer): JsonResponse
    {
        $validated = $request->validate([
            'complaints' => 'required|array',
            'complaints.*' => 'string|max:500',
        ]);

        $computer->update(['complaints' => $validated['complaints']]);

        return response()->json([
            'success' => true,
            'message' => 'Computer complaints updated successfully',
            'data' => $computer->fresh(),
        ]);
    }

    /**
     * Get computer statistics.
     *
     * @return JsonResponse
     */
    public function getStatistics(): JsonResponse
    {
        $totalComputers = Computer::count();
        $availableComputers = Computer::where('system_status', Computer::STATUS_AVAILABLE)->count();
        $underMaintenanceComputers = Computer::where('system_status', Computer::STATUS_UNDER_MAINTENANCE)->count();
        $computersWithComplaints = Computer::whereNotNull('complaints')->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_computers' => $totalComputers,
                'available_computers' => $availableComputers,
                'under_maintenance_computers' => $underMaintenanceComputers,
                'computers_with_complaints' => $computersWithComplaints,
                'availability_percentage' => $totalComputers > 0 ? round(($availableComputers / $totalComputers) * 100, 2) : 0,
            ],
        ]);
    }
}
