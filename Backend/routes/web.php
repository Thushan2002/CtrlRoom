<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| API-only backend: no web routes are defined here.
|
*/
Route::get('/', function () {
    return response()->json([
        'message' => 'Backend is running',
    ]);
});
