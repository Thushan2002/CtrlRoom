<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Software extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'computer_id',
        'name',
        'version',
        'category',
        'description',
        'vendor',
        'install_date',
        'is_licensed',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'install_date' => 'date',
        'is_licensed' => 'boolean',
    ];

    /**
     * Get the computer that owns the software.
     */
    public function computer(): BelongsTo
    {
        return $this->belongsTo(Computer::class);
    }

    /**
     * Get formatted software information
     *
     * @return array
     */
    public function getFormattedInfoAttribute()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'version' => $this->version,
            'category' => $this->category,
            'vendor' => $this->vendor,
            'install_date' => $this->install_date ? $this->install_date->format('Y-m-d') : null,
            'is_licensed' => $this->is_licensed,
        ];
    }
}
