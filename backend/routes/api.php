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

// --- 1. RUTAS PÚBLICAS ---
// Estas rutas son accesibles sin necesidad de estar logueado.
Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);
Route::get('movies/search', [MovieController::class, 'search']);
Route::get('/movies/{id}/context', [MovieController::class, 'getMovieContext']);
Route::get('lists/view/{id}', [MovieListController::class, 'show']); 
Route::get('lists/public', [MovieListController::class, 'indexPublic']);
Route::apiResource('movies', MovieController::class)->only(['index', 'show']);
Route::get('/reviews', [ReviewController::class, 'index']);




// --- 2. RUTAS PROTEGIDAS (Usuarios Autenticados) ---
Route::middleware('auth:sanctum')->group(function () {
    
    // Perfil y Datos de Usuario
    Route::get('/user', function (Request $request) { return $request->user(); });
    Route::apiResource('users', UserController::class);

    // Tus Listas y Gestión de Películas
    Route::apiResource('lists', MovieListController::class);
    Route::post('lists/{id}/add-movie', [MovieListController::class, 'addMovie']);
    Route::delete('lists/{id}/remove-movie', [MovieListController::class, 'removeMovie']);

    // Colecciones (Favoritos, Vistos, Pendientes)
    Route::apiResource('favorites', FavoriteController::class);
    Route::apiResource('watched', WatchedController::class);
    Route::apiResource('pending', PendingController::class);

    // Reseñas: Crear, Editar y Borrar tus propios comentarios
    Route::apiResource('reviews', ReviewController::class)->except(['index']);
    
    
});


// RUTAS DE ADMINISTRACIÓN 
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    
    // Moderación de Reseñas: El admin puede borrar cualquier comentario inapropiado
    Route::delete('admin/reviews/{review}', [ReviewController::class, 'destroy']);
    
    // Mantenimiento del Catálogo: El admin crea, actualiza y borra películas
    // Excluimos index y show porque ya están en las rutas públicas
    Route::apiResource('movies', MovieController::class)->except(['index', 'show']);

    // Verificación de rol: Útil para que React decida si muestra el botón "Panel Admin"
    Route::get('admin/check', function() {
        return response()->json(['isAdmin' => true], 200);
    });
});
