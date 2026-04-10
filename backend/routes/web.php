<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MovieController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\WatchlistController;
use App\Http\Controllers\ReviewController;

Route::get('/', function () {
    return view('welcome');
});

Route::resource('movies', MovieController::class);
Route::resource('favorites', FavoriteController::class);
Route::resource('watchlist', WatchlistController::class);
Route::resource('reviews', ReviewController::class);