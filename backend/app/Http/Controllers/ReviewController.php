<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\Movie;

class ReviewController extends Controller
{
    // GET: Ver reseñas de una película específica o todas (para el admin)
    public function index(Request $request)
    {
        // Si hay movie_id, filtramos por película. Si no, devolvemos todas con su usuario.
        if ($request->has('movie_id')) {
            $reviews = Review::where('movie_id', $request->movie_id)->with('user')->get();
        } else {
            $reviews = Review::with('user')->orderBy('created_at', 'desc')->get();
        }
        return response()->json($reviews, 200);
    }

    // POST: Guardar reseña
    public function store(Request $request)
    {
       $request->validate([
        'movie_id' => 'required|integer',
        'comment' => 'required',
        'rating' => 'required|integer|min:1|max:10',
        'title' => 'nullable|string'
    ]);

    Movie::firstOrCreate(
        ['id' => $request->movie_id],
        ['title' => $request->title ?? 'Sin título']
    );

    $review = Review::create([
        'user_id' => Auth::id(),
        'movie_id' => $request->movie_id,
        'comment' => $request->comment,
        'rating' => $request->rating
    ]);

    return response()->json($review, 201);
    }

    /**
     * DELETE: Borrar reseña.
     * Permitido para el autor de la reseña O para un administrador.
     */
    public function destroy(string $id)
    {
        $review = Review::find($id);

        // Si la reseña no existe, devolvemos 404
        if (!$review) {
            return response()->json(['message' => 'Reseña no encontrada'], 404);
        }

        // CAPA DE SEGURIDAD MÓDULO ADMIN/USER:
        // Permitimos borrar si el user_id coincide con el autenticado
        // O si el usuario autenticado es administrador (is_admin == 1)
        if ($review->user_id === Auth::id() || Auth::user()->is_admin == 1) {
            $review->delete();
            return response()->json(['message' => 'Reseña borrada correctamente'], 200);
        }

        // Si no es el dueño ni es admin, denegamos el acceso
        return response()->json(['message' => 'No autorizado para borrar esta reseña'], 403);
    }
}