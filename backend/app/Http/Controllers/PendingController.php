<?php

namespace App\Http\Controllers;

use App\Models\Pending; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PendingController extends Controller
{
    // GET: Ver mis pendientes
    public function index()
    {
        $userId = Auth::id();
        $favs = Pending::where('user_id', $userId)->with('movie')->get();
        return response()->json($favs, 200);
    }

    // POST: Añadir a pendientes
    public function store(Request $request)
    {
        $fav = Pending::firstOrCreate([
            'user_id' => Auth::id(),
            'movie_id' => $request->movie_id
        ]);
        return response()->json($fav, 201);
    }

    // DELETE: Quitar de pendientes (se usa el movie_id)
    public function destroy(string $movieId)
    {
        Pending::where('user_id', Auth::id())
                ->where('movie_id', $movieId)
                ->delete();
        return response()->json(['message' => 'Eliminado de pendientes'], 200);
    }
}