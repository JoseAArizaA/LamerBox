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
        $userId = Auth::id();
        $favs = Favorite::where('user_id', $userId)->with('movie')->get();
        return response()->json($favs, 200);
    }

    // POST: Añadir a favoritos
    public function store(Request $request)
    {
        // Primero: Creamos o buscamos la película en nuestra tabla local
        Movie::firstOrCreate(
        ['id' => $request->movie_id],
        ['title' => $request->title ?? 'Sin título']
    );

    // Segundo: Ahora ya podemos guardar que el usuario la ha visto
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