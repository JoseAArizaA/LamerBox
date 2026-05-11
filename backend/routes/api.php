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
Route::get('/reviews', [ReviewController::class, 'index']); // Público general para reviews

Route::get('/movies/{id}', [MovieController::class, 'show']);

// --- 2. RUTAS PROTEGIDAS (Usuarios Autenticados) ---
// Requieren un token válido generado por Sanctum.
Route::middleware('auth:sanctum')->group(function () {
    
    // Perfil y Datos de Usuario (Arregla el "Cargando...")
    Route::get('/user', function (Request $request) { return $request->user(); });
    Route::apiResource('users', UserController::class);

    // Tus Listas y Gestión de Películas
    Route::apiResource('lists', MovieListController::class);
    Route::post('lists/{id}/add-movie', [MovieListController::class, 'addMovie']);
    Route::delete('lists/{id}/remove-movie', [MovieListController::class, 'removeMovie']);

    // Tus Colecciones (Favoritos, Vistos, Pendientes)
    Route::apiResource('favorites', FavoriteController::class);
    Route::apiResource('watched', WatchedController::class);
    Route::apiResource('pending', PendingController::class);
    
    // Reseñas y Estado de Película
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);
    Route::get('/movies/{id}/status', [MovieController::class, 'getUserStatus']);

// Ruta de prueba para verificar autenticación
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

});


// --- 3. RUTAS DE ADMINISTRACIÓN (Solo usuarios con is_admin = 1) ---
// Estas rutas requieren estar logueado Y superar el middleware 'admin'.
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    
    // Panel de Usuarios
    Route::apiResource('users', UserController::class);
    
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
