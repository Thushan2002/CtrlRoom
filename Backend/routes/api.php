<?php
use App\Http\Controllers\AuthController;

// user registration and login routes
Route::post('/register/student', [AuthController::class, 'registerStudent']);
Route::post('/register/admin', [AuthController::class, 'registerAdmin']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Computer management routes
require __DIR__.'/computerRoutes.php';