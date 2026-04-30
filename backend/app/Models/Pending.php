<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pending extends Model
{
    protected $fillable = ['user_id', 'movie_id'];

    protected $table = 'pending';

    public function movie()
{
    return $this->belongsTo(Movie::class, 'movie_id');
}
}
