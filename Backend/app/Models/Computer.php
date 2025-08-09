<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Computer extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'system_status',
        'complaints',
        'os',
        'processor',
        'ram',
        'storage',
        'graphics_card',
        'motherboard',
        'location',
        'asset_tag',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'complaints' => 'array',
        'system_info' => 'array',
    ];

    /**
     * System status constants
     */
    const STATUS_AVAILABLE = 'available';
    const STATUS_UNDER_MAINTENANCE = 'under_maintenance';

    /**
     * Get all possible system statuses
     *
     * @return array
     */
    public static function getSystemStatuses()
    {
        return [
            self::STATUS_AVAILABLE,
            self::STATUS_UNDER_MAINTENANCE,
        ];
    }

    /**
     * Check if computer is available
     *
     * @return bool
     */
    public function isAvailable()
    {
        return $this->system_status === self::STATUS_AVAILABLE;
    }

    /**
     * Check if computer is under maintenance
     *
     * @return bool
     */
    public function isUnderMaintenance()
    {
        return $this->system_status === self::STATUS_UNDER_MAINTENANCE;
    }

    /**
     * Get formatted system information
     *
     * @return array
     */
    public function getSystemInfoAttribute()
    {
        return [
            'os' => $this->os,
            'processor' => $this->processor,
            'ram' => $this->ram,
            'storage' => $this->storage,
            'graphics_card' => $this->graphics_card,
            'motherboard' => $this->motherboard,
        ];
    }
}
