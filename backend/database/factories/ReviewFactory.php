<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Movie;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class ReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id'  => User::all()->random()->id, // Coge un usuario al azar
            'movie_id' => Movie::all()->random()->id, // Coge una peli al azar
            'comment'  => fake()->paragraph(),
            'rating'   => fake()->numberBetween(1, 10),
        ];
    }
}
