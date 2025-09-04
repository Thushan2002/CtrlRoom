<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // Student Registration
    public function registerStudent(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email|regex:/^.+@std\.foc\.sab\.ac\.lk$/',
            'password' => 'required|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => strtolower($request->email),
            'password' => Hash::make($request->password),
            'role' => 'student',
        ]);

        return response()->json(['message' => 'Student registered successfully.'], 201);
    }

    // Admin Registration
    public function registerAdmin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => strtolower($request->email),
            'password' => Hash::make($request->password),
            'role' => 'admin',
        ]);

        return response()->json(['message' => 'Admin registered successfully.'], 201);
    }

    // Login (shared for both)
   public function login(Request $request)
{
    $validator = Validator::make($request->all(), [
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 422);
    }

    if (
        $request->email === env('ADMIN_EMAIL') &&
        $request->password === env('ADMIN_PASSWORD')
    ) {
        // Create a fake user object for admin (not in DB)
        $user = (object) [
            'id' => 0,
            'name' => 'Super Admin',
            'email' => env('ADMIN_EMAIL'),
            'role' => 'admin',
        ];

        // Issue token manually for ENV admin
        $dbUser = User::where('email', env('ADMIN_EMAIL'))->first();
        if (!$dbUser) {
            // Optionally persist ENV admin in DB to use Sanctum
            $dbUser = User::create([
                'name' => 'Super Admin',
                'email' => env('ADMIN_EMAIL'),
                'password' => Hash::make(env('ADMIN_PASSWORD')),
                'role' => 'admin',
            ]);
        }

        $token = $dbUser->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful (ENV Admin)',
            'user' => $user,
            'role' => 'admin',
            'token' => $token,
        ]);
    }

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'message' => 'Login successful',
        'user' => $user,
        'role' => $user->role,
        'token' => $token,
    ]);
}

    public function logout(Request $request)
    {
    if ($request->user() && $request->user()->currentAccessToken()) {
        $request->user()->currentAccessToken()->delete();
    }
    return response()->json(['message' => 'Logged out successfully'], 200);
    }
}
