<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

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

    // Forgot Password
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $recipientEmail = strtolower($request->email);
        $user = User::where('email', $recipientEmail)->first();

        if ($user) {
            // Generate a random token
            $token = Str::random(64);

            // Store the token in the password_resets table
            DB::table('password_resets')->updateOrInsert(
                ['email' => $recipientEmail],
                [
                    'email' => $recipientEmail,
                    'token' => Hash::make($token),
                    'created_at' => now()
                ]
            );

            // Send email with reset link to the provided email
            $resetUrl = config('app.frontend_url') . '/reset-password?token=' . $token . '&email=' . urlencode($recipientEmail);

            try {
                Mail::send('emails.password-reset', [
                    'user' => $user,
                    'resetUrl' => $resetUrl,
                    'token' => $token
                ], function ($message) use ($recipientEmail) {
                    $message->to($recipientEmail)
                            ->subject('Password Reset Request - CtrlRoom');
                });
            } catch (\Exception $e) {
                // Log the error but don't expose it to the user
                \Log::error('Password reset email failed: ' . $e->getMessage());
            }
        } else {
            // Send a generic email to the provided address without revealing account existence
            try {
                Mail::send('emails.password-reset-generic', [
                    'recipientEmail' => $recipientEmail,
                ], function ($message) use ($recipientEmail) {
                    $message->to($recipientEmail)
                            ->subject('Password Reset Information - CtrlRoom');
                });
            } catch (\Exception $e) {
                \Log::error('Password reset generic email failed: ' . $e->getMessage());
            }
        }

        return response()->json(['message' => 'If an account with that email exists, we have sent a password reset message.'], 200);
    }

    // Reset Password
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Find the password reset record
        $passwordReset = DB::table('password_resets')
            ->where('email', $request->email)
            ->first();

        if (!$passwordReset || !Hash::check($request->token, $passwordReset->token)) {
            return response()->json(['message' => 'Invalid or expired reset token'], 400);
        }

        // Check if token is expired (60 minutes)
        $createdAt = $passwordReset->created_at instanceof \DateTimeInterface
            ? Carbon::instance($passwordReset->created_at)
            : Carbon::parse($passwordReset->created_at);
        if (Carbon::now()->diffInMinutes($createdAt) > 60) {
            return response()->json(['message' => 'Reset token has expired'], 400);
        }

        // Find the user
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Update the user's password
        $user->password = Hash::make($request->password);
        $user->save();

        // Delete the password reset record
        DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Password has been reset successfully'], 200);
    }
}
