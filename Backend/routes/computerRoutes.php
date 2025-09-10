<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ComputerController;
use App\Http\Controllers\SoftwareController;

/*
|--------------------------------------------------------------------------
| Computer API Routes
|--------------------------------------------------------------------------
|
| Here are the API routes for computer management. These routes handle
| CRUD operations and additional functionality for computer resources.
|
*/

// Computer CRUD operations
Route::group(['prefix' => 'computers'], function () {
    // Basic CRUD routes
    Route::get('/', [ComputerController::class, 'index'])->name('computers.index');
    Route::post('/', [ComputerController::class, 'store'])->name('computers.store');
    Route::get('/{computer}', [ComputerController::class, 'show'])->name('computers.show');
    Route::put('/{computer}', [ComputerController::class, 'update'])->name('computers.update');
    Route::patch('/{computer}', [ComputerController::class, 'update'])->name('computers.patch');
    Route::delete('/{computer}', [ComputerController::class, 'destroy'])->name('computers.destroy');

    // Additional functionality routes
    Route::get('/status/{status}', [ComputerController::class, 'getByStatus'])->name('computers.by-status');
    Route::patch('/{computer}/status', [ComputerController::class, 'updateStatus'])->name('computers.update-status');
    Route::patch('/{computer}/complaints', [ComputerController::class, 'updateComplaints'])->name('computers.update-complaints');
    
    // Statistics route
    Route::get('/statistics/overview', [ComputerController::class, 'getStatistics'])->name('computers.statistics');
    
    // Software management routes for computers
    Route::group(['prefix' => '{computer}/software'], function () {
        // Public routes (students can view)
        Route::get('/', [SoftwareController::class, 'index'])->name('computers.software.index');
        Route::get('/{software}', [SoftwareController::class, 'show'])->name('computers.software.show');
        
        // Admin-only routes (CRUD operations)
        Route::middleware(['auth:sanctum', 'admin'])->group(function () {
            Route::post('/', [SoftwareController::class, 'store'])->name('computers.software.store');
            Route::put('/{software}', [SoftwareController::class, 'update'])->name('computers.software.update');
            Route::patch('/{software}', [SoftwareController::class, 'update'])->name('computers.software.patch');
            Route::delete('/{software}', [SoftwareController::class, 'destroy'])->name('computers.software.destroy');
        });
    });
});

// Software categories route
Route::get('/software/categories', [SoftwareController::class, 'getCategories'])->name('software.categories');

/*
|--------------------------------------------------------------------------
| Route Parameters
|--------------------------------------------------------------------------
|
| Available query parameters for GET /computers:
| - system_status: Filter by status (available, under_maintenance)
| - location: Filter by location (partial match)
| - search: Search in OS, processor, asset_tag, location
| - page: Pagination page number
| - per_page: Number of items per page (default: 15)
|
| Example requests:
| GET /api/computers?system_status=available
| GET /api/computers?location=Lab%201
| GET /api/computers?search=Intel
| GET /api/computers/status/available
| GET /api/computers/statistics/overview
|
*/
