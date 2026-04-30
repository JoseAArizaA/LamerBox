<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Importación de controladores
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

// --- 1. RUTAS PÚBLICAS ---
// Estas rutas son accesibles sin necesidad de estar logueado.
Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);
Route::get('movies/search', [MovieController::class, 'search']);

// El público general solo puede ver la lista de películas y el detalle de una.
Route::apiResource('movies', MovieController::class)->only(['index', 'show']);


// --- 2. RUTAS PROTEGIDAS (Usuarios Autenticados) ---
// Requieren un token válido generado por Sanctum.
Route::middleware('auth:sanctum')->group(function () {
    
    // Datos del perfil del usuario logueado
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Gestión personal: Favoritos, Vistas, Pendientes y Listas
    Route::apiResource('favorites', FavoriteController::class);
    Route::apiResource('watched', WatchedController::class);
    Route::apiResource('pending', PendingController::class);
    Route::apiResource('lists', MovieListController::class);
    
    // Gestión de películas dentro de las listas creadas por el usuario
    Route::post('lists/{id}/add-movie', [MovieListController::class, 'addMovie']);
    Route::delete('lists/{id}/remove-movie', [MovieListController::class, 'removeMovie']);

    // Reseñas: Los usuarios pueden verlas y crearlas, pero no eliminarlas (restricción de Miguel)
    Route::apiResource('reviews', ReviewController::class)->except(['destroy']);
});


// --- 3. RUTAS DE ADMINISTRACIÓN (Solo usuarios con is_admin = 1) ---
// Estas rutas requieren estar logueado Y superar el middleware 'admin'.
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    
    // Panel de Usuarios: El admin lista a todos (index) y puede borrarlos (destroy)
    Route::apiResource('users', UserController::class)->only(['index', 'destroy']);
    
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