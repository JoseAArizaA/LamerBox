<?php

namespace App\Http\Controllers;

use App\Models\Wached; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WatchedController extends Controller
{
    // GET: Ver mis vistas
    public function index()
    {
        $userId = Auth::id();
        $favs = Watched::where('user_id', $userId)->with('movie')->get();
        return response()->json($favs, 200);
    }

    // POST: Añadir a vistas
    public function store(Request $request)
    {
        $fav = Watched::firstOrCreate([
            'user_id' => Auth::id(),
            'movie_id' => $request->movie_id
        ]);
        return response()->json($fav, 201);
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