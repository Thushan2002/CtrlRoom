<?php

namespace App\Http\Controllers;

use App\Models\Software;
use App\Models\Computer;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class SoftwareController extends Controller
{
    /**
     * Display a listing of software for a specific computer.
     *
     * @param Request $request
     * @param int $computerId
     * @return JsonResponse
     */
    public function index(Request $request, int $computerId): JsonResponse
    {
        $computer = Computer::findOrFail($computerId);
        
        $query = $computer->software();

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Search in name, version, or vendor
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('version', 'like', '%' . $search . '%')
                  ->orWhere('vendor', 'like', '%' . $search . '%');
            });
        }

        $software = $query->orderBy('name', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $software,
        ]);
    }

    /**
     * Store a newly created software in storage.
     *
     * @param Request $request
     * @param int $computerId
     * @return JsonResponse
     */
    public function store(Request $request, int $computerId): JsonResponse
    {
        $computer = Computer::findOrFail($computerId);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'version' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'vendor' => 'nullable|string|max:255',
            'install_date' => 'nullable|date',
            'is_licensed' => 'boolean',
        ]);

        $validated['computer_id'] = $computerId;

        $software = Software::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Software added successfully',
            'data' => $software,
        ], 201);
    }

    /**
     * Display the specified software.
     *
     * @param int $computerId
     * @param int $softwareId
     * @return JsonResponse
     */
    public function show(int $computerId, int $softwareId): JsonResponse
    {
        $software = Software::where('computer_id', $computerId)
                           ->findOrFail($softwareId);

        return response()->json([
            'success' => true,
            'data' => $software,
        ]);
    }

    /**
     * Update the specified software in storage.
     *
     * @param Request $request
     * @param int $computerId
     * @param int $softwareId
     * @return JsonResponse
     */
    public function update(Request $request, int $computerId, int $softwareId): JsonResponse
    {
        $software = Software::where('computer_id', $computerId)
                           ->findOrFail($softwareId);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'version' => 'sometimes|required|string|max:255',
            'category' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'vendor' => 'nullable|string|max:255',
            'install_date' => 'nullable|date',
            'is_licensed' => 'boolean',
        ]);

        $software->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Software updated successfully',
            'data' => $software->fresh(),
        ]);
    }

    /**
     * Remove the specified software from storage.
     *
     * @param int $computerId
     * @param int $softwareId
     * @return JsonResponse
     */
    public function destroy(int $computerId, int $softwareId): JsonResponse
    {
        $software = Software::where('computer_id', $computerId)
                           ->findOrFail($softwareId);

        $software->delete();

        return response()->json([
            'success' => true,
            'message' => 'Software removed successfully',
        ]);
    }

    /**
     * Get software categories.
     *
     * @return JsonResponse
     */
    public function getCategories(): JsonResponse
    {
        $categories = Software::select('category')
                            ->whereNotNull('category')
                            ->distinct()
                            ->pluck('category')
                            ->filter()
                            ->values();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }
}
