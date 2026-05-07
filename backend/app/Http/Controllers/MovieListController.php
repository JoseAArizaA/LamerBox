<?php

namespace App\Http\Controllers;

use App\Models\MovieList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Movie;

class MovieListController extends Controller
{
    // GET: Ver todas mis listas personalizadas
    public function index()
    {
        $lists = auth()->user()->movieLists()->withCount('movies')->get();
        return response()->json($lists, 200);
    }

    // POST: Crear una nueva lista 
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'is_public' => 'boolean'
        ]);

        $list = MovieList::create([
            'name' => $request->name,
            'is_public' => $request->is_public ?? true,
            'user_id' => Auth::id()
        ]);

        return response()->json($list, 201);
    }

    // GET: Ver una lista concreta con todas sus películas
    public function show(string $id)
    {
       $list = MovieList::with(['user', 'movies'])->findOrFail($id);
        
        if (!$list || ($list->user_id !== Auth::id() && !$list->is_public)) {
            return response()->json(['message' => 'Lista no encontrada o privada'], 404);
        }

        return response()->json($list, 200);
    }

    // PUT: Cambiar el nombre de la lista o su privacidad
    public function update(Request $request, string $id)
    {
        $list = MovieList::where('user_id', Auth::id())->find($id);
        if (!$list) return response()->json(['message' => 'No encontrada'], 404);

        $list->update($request->only(['name', 'is_public']));
        return response()->json($list, 200);
    }

    // DELETE: Borrar la lista entera
    public function destroy(string $id)
    {
        $list = MovieList::where('user_id', Auth::id())->find($id);
        if (!$list) return response()->json(['message' => 'No encontrada'], 404);

        $list->delete();
        return response()->json(['message' => 'Lista eliminada'], 200);
    }

    // --- MÉTODOS EXTRA PARA GESTIONAR LAS PELIS DENTRO DE LA LISTA ---

    // Añadir una peli a la lista
    public function addMovie(Request $request, $listId)
    {
            $movie = Movie::updateOrCreate(
                ['id' => $request->movie_id],
                [
                    'title' => $request->title ?? 'Sin título',
                    'imageUrl' => $request->poster_path ?? ''
                ]
            );

        $list = MovieList::where('user_id', Auth::id())->findOrFail($listId);
        $list->movies()->syncWithoutDetaching([$movie->id]);
        return response()->json(['message' => 'Película añadida a la lista'], 200);
    }

    // Quitar una peli de la lista
    public function removeMovie(Request $request, $listId)
    {
        $list = MovieList::where('user_id', Auth::id())->findOrFail($listId);
        $list->movies()->detach($request->movie_id);
        
        return response()->json(['message' => 'Película quitada de la lista'], 200);
    }
}