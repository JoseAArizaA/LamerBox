<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Importación de todos los controladores
use App\Http\Controllers\UserController;
use App\Http\Controllers\MovieController;
use App\Http\Controllers\MovieListController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\WatchedController;
use App\Http\Controllers\PendingController;

/*
|--------------------------------------------------------------------------
| API Routes - LamerBox
|--------------------------------------------------------------------------
*/

// 1. RUTAS ESPECÍFICAS (Debe ir arriba para que no choque con los IDs de los resources)
Route::get('movies/search', [MovieController::class, 'search']);
// Ruta para que los usuarios inicien sesión
Route::post('/login', [UserController::class, 'login']);
// Ruta para que los usuarios se registren
Route::post('/register', [UserController::class, 'register']);


// 2. RUTAS AUTOMÁTICAS (apiResource) PARA LAS 7 ENTIDADES
Route::apiResource('users', UserController::class);
Route::apiResource('movies', MovieController::class);



// 3. RUTAS PERSONALIZADAS PARA GESTIONAR PELÍCULAS DENTRO DE LAS LISTAS
// Estas permiten añadir o quitar una peli específica de una lista de usuario
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
    Route::post('/reviews', [ReviewController::class, 'store']);

    Route::get('/movies/{id}/status', [MovieController::class, 'getUserStatus']);
});

// Ruta de prueba para verificar que el usuario está autenticado (vanguardia de Laravel)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');