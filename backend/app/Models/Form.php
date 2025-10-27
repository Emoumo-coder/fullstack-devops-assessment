<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'structure',
    ];

    protected $casts = [
        'structure' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
