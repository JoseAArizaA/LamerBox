<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class TMDBService
{
    protected $baseUrl;
    protected $token;

    public function __construct()
    {
        $this->baseUrl = config('services.tmdb.base_url');
        $this->token = config('services.tmdb.token');
    }

    /**
     * Buscar películas por texto
     */
    public function searchMovies(string $query)
    {
        $response = Http::withToken($this->token)
            ->get("{$this->baseUrl}/search/movie", [
                'query' => $query,
                'language' => 'es-ES',
                'page' => 1
            ]);

        return $response->json();
    }

    /**
     * Obtener las películas más populares del momento
     */
    public function getPopularMovies()
    {
        $response = Http::withToken($this->token)
            ->get("{$this->baseUrl}/movie/popular", [
                'language' => 'es-ES',
                'page' => 1
            ]);

        return $response->json();
    }

    /**
     * Obtener detalles de una película concreta por su ID de TMDB
     */
    public function getMovieDetails(int $tmdbId)
    {
        $response = Http::withToken($this->token)
            ->get("{$this->baseUrl}/movie/{$tmdbId}", [
                'language' => 'es-ES'
            ]);

        return $response->json();
    }
}