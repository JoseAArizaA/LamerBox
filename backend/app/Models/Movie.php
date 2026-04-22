<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;
use App\Models\MovieList;
use App\Models\Review;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Movie extends Model
{
    use HasFactory;

    protected $fillable = [
        'tmdb_id',
        'title',
        'description',
        'year',
        'stars',
        'imageUrl',
        'genre'
    ];

   // En qué listas personalizadas aparece esta peli
    public function lists(): BelongsToMany
    {
        return $this->belongsToMany(MovieList::class, 'list_movie', 'movie_id', 'list_id');
    }

    // Sus reseñas
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    // Usuarios que tienen esta película en favoritos
    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'favorites');
    }

    // Usuarios que han visto esta película
    public function watchedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'watched');
    }

    // Usuarios que la tienen pendiente
    public function pendingBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'pending');
    }
}
