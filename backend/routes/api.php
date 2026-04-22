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

// --- 1. RUTAS PÚBLICAS (Lo que añadió Jose + Búsqueda) ---
Route::get('movies/search', [MovieController::class, 'search']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);

// Ver películas (público), pero no gestionarlas
Route::apiResource('movies', MovieController::class)->only(['index', 'show']);


// --- 2. RUTAS PROTEGIDAS (Cualquier usuario logueado - Tu estructura) ---
Route::middleware('auth:sanctum')->group(function () {
    
    // Perfil del usuario actual
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Recursos para usuarios comunes (Listas, Favoritos, etc.)
    Route::apiResource('favorites', FavoriteController::class);
    Route::apiResource('watched', WatchedController::class);
    Route::apiResource('pending', PendingController::class);
    Route::apiResource('lists', MovieListController::class);
    
    // Pueden escribir reviews, pero no borrarlas (protección de Miguel)
    Route::apiResource('reviews', ReviewController::class)->except(['destroy']);

    // Gestión de películas en listas
    Route::post('lists/{id}/add-movie', [MovieListController::class, 'addMovie']);
    Route::delete('lists/{id}/remove-movie', [MovieListController::class, 'removeMovie']);
});


// --- 3. RUTAS DE ADMINISTRACIÓN (Solo para usuarios con is_admin = 1 - Tu creación) ---
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    
    // El Admin puede ver la lista de todos los usuarios y borrarlos
    Route::apiResource('users', UserController::class)->only(['index', 'destroy']);
    
    // El Admin tiene el poder de borrar cualquier review
    Route::delete('admin/reviews/{review}', [ReviewController::class, 'destroy']);
    
    // El Admin puede crear, editar o borrar películas del catálogo
    Route::apiResource('movies', MovieController::class)->except(['index', 'show']);

    // Ruta espejo para que React sepa que el usuario tiene acceso al panel
    Route::get('admin/check', function() {
        return response()->json(['isAdmin' => true], 200);
    });
});