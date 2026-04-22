<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Review;
use App\Models\Movie;
use Database\Factories\UserFactory;
use Database\Factories\MovieFactory;
use Database\Factories\ReviewFactory;  

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'nickname' => 'Admin',
            'email' => 'admin@lamerbox.com',
            'password' => Hash::make('123456'),
            'is_admin' => true,
        ]);

        User::factory(5)->create();

        $this->call([
        MovieSeeder::class,
        ]);

        Review::factory(30)->create();
    }
}
