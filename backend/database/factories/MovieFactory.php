<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Movie;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Movie>
 */
class MovieFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tmdb_id'     => fake()->unique()->numberBetween(100, 999999), // El ID de la API externa
            'title'       => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'year'        => fake()->year(),
            'stars'       => fake()->randomFloat(1, 1, 10), // Puntuación (double)
            'imageUrl'    => 'https://image.tmdb.org/t/p/w500/6XJMpS6TSTfs9996mS6YUn37YfW.jpg', 
            'genre'       => fake()->randomElement(['Acción', 'Drama', 'Comedia', 'Terror']),
        ];
    }
}
