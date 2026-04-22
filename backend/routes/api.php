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

// --- RUTAS PÚBLICAS (Sin autenticación) ---
Route::get('movies/search', [MovieController::class, 'search']);
Route::apiResource('movies', MovieController::class)->only(['index', 'show']);


// --- RUTAS PROTEGIDAS (Cualquier usuario logueado) ---
Route::middleware('auth:sanctum')->group(function () {
    
    // Perfil del usuario actual
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Recursos para usuarios comunes
    Route::apiResource('favorites', FavoriteController::class);
    Route::apiResource('watched', WatchedController::class);
    Route::apiResource('pending', PendingController::class);
    Route::apiResource('lists', MovieListController::class);
    Route::apiResource('reviews', ReviewController::class)->except(['destroy']); // No pueden borrar reviews (o solo las suyas, según tu lógica de controller)

    // Gestión de películas en listas
    Route::post('lists/{id}/add-movie', [MovieListController::class, 'addMovie']);
    Route::delete('lists/{id}/remove-movie', [MovieListController::class, 'removeMovie']);
});


// --- RUTAS DE ADMINISTRACIÓN (Solo para usuarios con is_admin = 1) ---
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    
    // Gestión total de usuarios (Listar todos y eliminar)
    Route::apiResource('users', UserController::class)->only(['index', 'destroy']);
    
    // El admin sí puede borrar cualquier review
    Route::delete('admin/reviews/{review}', [ReviewController::class, 'destroy']);
    
    // Verificación de rol para el Frontend (React)
    Route::get('admin/check', function() {
        return response()->json(['isAdmin' => true], 200);
    });

    // Si decides añadir películas o editar el catálogo
    Route::apiResource('movies', MovieController::class)->except(['index', 'show']);
});