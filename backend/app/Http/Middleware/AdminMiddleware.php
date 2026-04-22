<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Verificamos si el usuario está logueado Y si es administrador
        if (auth()->user() && auth()->user()->is_admin) {
            return $next($request);
        }

        // Si no cumple, devolvemos un error 403 (Prohibido)
        return response()->json([
            'message' => 'Acceso denegado. Solo administradores.'
        ], 403);
    }
}