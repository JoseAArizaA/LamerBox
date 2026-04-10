<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Watched;
use App\Models\Pending;

class WatchlistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Aquí podrías listar películas vistas o pendientes
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $userId = auth()->id();
        $movieId = $request->movie_id;
        $status = $request->status; // 'watched' o 'pending'

        if ($status === 'watched') {

            // Guardar en vistos
            Watched::create([
                'user_id' => $userId,
                'movie_id' => $movieId
            ]);

            // Quitar de pendientes si existe
            Pending::where('user_id', $userId)
                ->where('movie_id', $movieId)
                ->delete();

        } elseif ($status === 'pending') {

            // Guardar en pendientes
            Pending::create([
                'user_id' => $userId,
                'movie_id' => $movieId
            ]);

            // Quitar de vistos si existe
            Watched::where('user_id', $userId)
                ->where('movie_id', $movieId)
                ->delete();
        }

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Podrías usar esto para quitar de ambas listas
        $userId = auth()->id();

        Watched::where('user_id', $userId)
            ->where('movie_id', $id)
            ->delete();

        Pending::where('user_id', $userId)
            ->where('movie_id', $id)
            ->delete();

        return back();
    }
}