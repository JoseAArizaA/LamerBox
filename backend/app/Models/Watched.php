<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Watched extends Model
{
    protected $fillable = ['user_id', 'movie_id'];

    protected $table = 'watched';

    public function movie()
{
    return $this->belongsTo(Movie::class, 'movie_id');
}
}
