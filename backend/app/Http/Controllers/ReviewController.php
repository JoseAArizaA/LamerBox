<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Aquí podrías listar todas las reviews
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Formulario para crear review (si usas vistas)
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Review::create([
            'user_id' => auth()->id(),
            'movie_id' => $request->movie_id,
            'comment' => $request->comment,
            'rating' => $request->rating
        ]);

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Mostrar una review concreta
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        // Formulario de edición
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Actualizar review
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Eliminar review
    }
}