<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;

// user registration and login routes
Route::post('/register/student', [AuthController::class, 'registerStudent']);
Route::post('/register/admin', [AuthController::class, 'registerAdmin']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        $user = $request->user();
        return response()->json([
            'user' => $user,
            'role' => $user ? $user->role : null,
        ]);
    });

    // User profile update and delete
    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    Route::delete('/user/account', [UserController::class, 'deleteAccount']);
});

// Computer management routes
require __DIR__.'/computerRoutes.php';