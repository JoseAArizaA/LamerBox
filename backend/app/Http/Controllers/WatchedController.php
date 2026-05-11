<?php

namespace App\Http\Controllers;

use App\Models\Watched; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Movie;
use Illuminate\Support\Facades\Log;

class WatchedController extends Controller
{
    // GET: Ver mis vistas
    public function index()
    {
        return response()->json(Auth::user()->watchedMovies, 200);
    }

    // POST: Añadir a vistas
    public function store(Request $request)
    {
        Movie::updateOrCreate(
        ['id' => $request->movie_id],
        [
            'title' => $request->title ?? 'Sin título',
            'imageUrl' => $request->poster_path ?? ''
        ]
    );

    $watched = Watched::firstOrCreate([
        'user_id' => Auth::id(),
        'movie_id' => $request->movie_id
    ]);
        return response()->json($watched, 201);
    }

    // DELETE: Quitar de vistas (se usa el movie_id)
    public function destroy(string $movieId)
    {
        Watched::where('user_id', Auth::id())
                ->where('movie_id', $movieId)
                ->delete();
        return response()->json(['message' => 'Eliminado de vistas'], 200);
    }
}