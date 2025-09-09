<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'profile_picture', 'phone', 'location', 'bio',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];
    
    // Accessor to get the full URL for the profile picture
    public function getProfilePictureUrlAttribute()
    {
        if ($this->profile_picture) {
            return asset('storage/profile_pictures/' . $this->profile_picture);
        }
        
        return asset('images/default-avatar.png');
    }
}