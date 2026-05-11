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

Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);
Route::get('movies/search', [MovieController::class, 'search']);
Route::get('/reviews', [ReviewController::class, 'index']);

Route::get('/movies/{id}', [MovieController::class, 'show']);

Route::get('/lists/public', [MovieListController::class, 'indexPublic']);

/* --- 2. RUTAS PROTEGIDAS (Un solo grupo para todo) --- */
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
    Route::get('/movies/{id}/context', [MovieController::class, 'getMovieContext']);
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
