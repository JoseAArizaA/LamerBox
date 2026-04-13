<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    // GET: Ver reseñas de una película específica
    public function index(Request $request)
    {
        $reviews = Review::where('movie_id', $request->movie_id)->with('user')->get();
        return response()->json($reviews, 200);
    }

    // POST: Guardar reseña
    public function store(Request $request)
    {
        $request->validate([
            'movie_id' => 'required|exists:movies,id',
            'comment' => 'required',
            'rating' => 'required|integer|min:1|max:10'
        ]);

        $review = Review::create([
            'user_id' => Auth::id(),
            'movie_id' => $request->movie_id,
            'comment' => $request->comment,
            'rating' => $request->rating
        ]);

        return response()->json($review, 201);
    }

    // DELETE: El usuario borra su propia reseña
    public function destroy(string $id)
    {
        $review = Review::find($id);
        if ($review->user_id !== Auth::id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }
        $review->delete();
        return response()->json(['message' => 'Reseña borrada'], 200);
    }
}