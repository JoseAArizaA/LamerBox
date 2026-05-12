<?php

namespace App\Http\Controllers;

use App\Models\Movie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Services\TMDBService;
use App\Models\Favorite;
use App\Models\Watched;
use App\Models\Pending;
use Illuminate\Support\Facades\Auth;
use App\Models\Review;

class MovieController extends Controller
{
    // GET: Listar todas las películas
    public function index()
    {
        return response()->json(Movie::paginate(20), 200);
    }

    // POST: Guardar una nueva película (Solo Admin)
    public function store(Request $request)
    {   
        $validator = Validator::make($request->all(), [
            'id' => 'required|unique:movies', 
            'title' => 'required|string',
        ]);

        if ($validator->fails()) return response()->json($validator->errors(), 400);

        $movie = Movie::create($request->all());
        return response()->json($movie, 201);
    }

    // GET: Ver detalle de una película con sus reseñas
    public function show(string $id)
    {
        $movie = Movie::with('reviews.user')->find($id);
        if (!$movie) return response()->json(['message' => 'Pelicula no encontrada'], 404);
        return response()->json($movie, 200);
    }

    // PUT: Actualizar datos de una película
    public function update(Request $request, string $id)
    {
        $movie = Movie::find($id);
        if (!$movie) return response()->json(['message' => 'No encontrada'], 404);
        
        $movie->update($request->all());
        return response()->json($movie, 200);
    }

    // DELETE: Borrar una película
    public function destroy(string $id)
    {
        $movie = Movie::find($id);
        if (!$movie) return response()->json(['message' => 'No encontrada'], 404);
        
        $movie->delete();
        return response()->json(['message' => 'Pelicula eliminada'], 200);
    }

    // GET: Buscar películas en TMDB
    public function search(Request $request, TMDBService $tmdbService)
    {
        $query = $request->query('query');
        
        if (!$query) {
            return response()->json(['message' => 'Falta el texto de búsqueda'], 400);
        }

        $results = $tmdbService->searchMovies($query);
        return response()->json($results);
    }

    // GET: Obtener contexto de una película para el usuario (favorita, vista, pendiente + reseñas)
    public function getMovieContext($id)
    {
        $userId = auth('sanctum')->id();
        
        $status = [
            'isFavorite' => $userId ? Favorite::where('user_id', $userId)->where('movie_id', $id)->exists() : false,
            'isWatched'  => $userId ? Watched::where('user_id', $userId)->where('movie_id', $id)->exists() : false,
            'isPending'  => $userId ? Pending::where('user_id', $userId)->where('movie_id', $id)->exists() : false,
        ];

        $reviews = Review::where('movie_id', $id)
                    ->with('user:id,nickname')
                    ->latest()
                    ->get();

        return response()->json([
            'status' => $status,
            'reviews' => $reviews
        ], 200);
    }
}