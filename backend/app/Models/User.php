<?php

namespace App\Models;

// --- ESTAS TRES LÍNEAS SON LAS QUE FALTABAN ---
use Illuminate\Database\Eloquent\Factories\HasFactory; 
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
// ----------------------------------------------

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Movie;
use App\Models\MovieList;
use App\Models\Review;

class User extends Authenticatable
{
    // Añadimos HasApiTokens para que funcione con React/Sanctum
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nickname', // Asegúrate de que en tu DB se llame nickname y no name
        'email',
        'password',
        'is_admin',
    ];

    // Relación con sus listas personalizadas
    public function movieLists(): HasMany
    {
        return $this->hasMany(MovieList::class);
    }

    // Películas favoritas (Muchos a Muchos)
    public function favoriteMovies(): BelongsToMany
    {
        return $this->belongsToMany(Movie::class, 'favorites');
    }

    // Películas vistas (Muchos a Muchos)
    public function watchedMovies(): BelongsToMany
    {
        return $this->belongsToMany(Movie::class, 'watched');
    }

    // Películas pendientes (Muchos a Muchos)
    public function pendingMovies(): BelongsToMany
    {
        return $this->belongsToMany(Movie::class, 'pending');
    }

    // Reseñas escritas por el usuario
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}