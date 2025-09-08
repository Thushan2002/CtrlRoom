<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class UserController extends Controller
{
    // Update user profile
   public function updateProfile(Request $request)
{
    $user = Auth::user();

    $validated = $request->validate([
        'name' => 'sometimes|string|max:255',
        'email' => 'sometimes|email|unique:users,email,' . $user->id,
        'phone' => 'nullable|string|max:20',
        'location' => 'nullable|string|max:255',
        'bio' => 'nullable|string|max:500',
        'profile_picture' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    // Handle profile picture upload
    if ($request->hasFile('profile_picture')) {
        // Delete old profile picture if exists
        if ($user->profile_picture) {
            Storage::delete('public/profile_pictures/' . $user->profile_picture);
        }
        
        // Store new profile picture
        $imageName = time() . '.' . $request->profile_picture->extension();
        $request->profile_picture->storeAs('public/profile_pictures', $imageName);
        $validated['profile_picture'] = $imageName;
    }

    $user->update($validated);

    return response()->json([
        'message' => 'Profile updated successfully', 
        'user' => $user,
        'profile_picture_url' => $user->profile_picture_url
    ]);
}

    // Delete user account
    public function deleteAccount(Request $request)
    {
        $user = Auth::user();
        
        // Delete profile picture if exists
        if ($user->profile_picture) {
            Storage::delete('public/profile_pictures/' . $user->profile_picture);
        }
        
        $user->delete();
        Auth::logout();
        
        return response()->json(['message' => 'Account deleted successfully']);
    }

    // Fetch all users
    public function getAllUsers()
    {
        $users = User::all();
        return response()->json(['users' => $users]);
    }

    // Fetch user by id
    public function getUserById($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json(['user' => $user]);
    }
}