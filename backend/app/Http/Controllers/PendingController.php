<?php

namespace App\Http\Controllers;

use App\Models\Pending; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Movie;
use Illuminate\Support\Facades\Log;

class PendingController extends Controller
{
    // GET: Ver mis pendientes
    public function index()
    {
        return response()->json(Auth::user()->pendingMovies, 200);
    }

    // POST: Añadir a pendientes
    public function store(Request $request)
    {
        Movie::updateOrCreate(
        ['id' => $request->movie_id],
        [
            'title' => $request->title ?? 'Sin título',
            'imageUrl' => $request->poster_path ?? ''
        ]
    );

    $pending = Pending::firstOrCreate([
        'user_id' => Auth::id(),
        'movie_id' => $request->movie_id
    ]);
        return response()->json($pending, 201);
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