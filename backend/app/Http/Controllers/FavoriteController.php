<?php

namespace App\Http\Controllers;

use App\Models\Favorite; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Movie; 
use Illuminate\Support\Facades\Log;

class FavoriteController extends Controller
{
    // GET: Ver mis favoritos
    public function index()
    {
        return response()->json(Auth::user()->favoriteMovies, 200);
    }

    // POST: Añadir a favoritos
    public function store(Request $request)
    {
        Movie::updateOrCreate(
        ['id' => $request->movie_id],
        [
            'title' => $request->title ?? 'Sin título',
            'imageUrl' => $request->poster_path ?? ''
        ]
    );

    $favorite = Favorite::firstOrCreate([
        'user_id' => Auth::id(),
        'movie_id' => $request->movie_id
    ]);
        return response()->json($favorite, 201);
    }

    // DELETE: Quitar de favoritos (se usa el movie_id)
    public function destroy(string $movieId)
    {
        Favorite::where('user_id', Auth::id())
                ->where('movie_id', $movieId)
                ->delete();
        return response()->json(['message' => 'Eliminado de favoritos'], 200);
    }
}