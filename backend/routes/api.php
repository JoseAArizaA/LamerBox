<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MovieController;
use App\Http\Controllers\MovieListController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\WatchedController;
use App\Http\Controllers\PendingController;

Route::get('movies/search', [MovieController::class, 'search']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);
Route::get('/reviews', [ReviewController::class, 'index']);

Route::apiResource('movies', MovieController::class);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('lists', MovieListController::class);
    Route::post('lists/{id}/add-movie', [MovieListController::class, 'addMovie']);
    Route::delete('lists/{id}/remove-movie', [MovieListController::class, 'removeMovie']);
});

Route::middleware('auth:sanctum')->group(function () {
    // Rutas para Favoritos
    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{movieId}', [FavoriteController::class, 'destroy']);

    // Rutas para Películas Vistas
    Route::post('/watched', [WatchedController::class, 'store']);
    Route::delete('/watched/{movieId}', [WatchedController::class, 'destroy']);

    // Rutas para Pendientes
    Route::post('/pending', [PendingController::class, 'store']);
    Route::delete('/pending/{movieId}', [PendingController::class, 'destroy']);
    
    // Rutas para Reseñas
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);
    Route::post('/reviews', [ReviewController::class, 'store']);

    // Ruta para obtener el estado de una película
    Route::get('/movies/{id}/status', [MovieController::class, 'getUserStatus']);

    // Rutas para Usuarios
    Route::apiResource('users', UserController::class);
});

// Ruta de prueba para verificar que el usuario está autenticado (vanguardia de Laravel)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');