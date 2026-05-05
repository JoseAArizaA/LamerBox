<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // GET: Listar todos los usuarios (Solo para el Admin)
    public function index()
    {
        if (!Auth::user()->is_admin) {
            return response()->json(['message' => 'No tienes permisos'], 403);
        }
        return response()->json(User::all(), 200);
    }

    // GET: Ver el perfil de un usuario concreto
    public function show(string $id)
    {
        $user = User::with([
            'favoriteMovies',
            'watchedMovies',
            'pendingMovies',
            'movieLists.movies'    
        ])->find($id);

        if (!$user) return response()->json(['message' => 'Usuario no encontrado'], 404);
    
        return response()->json($user, 200);
    }

    // PUT: Actualizar datos)
    public function update(Request $request, string $id)
    {
        $user = User::find($id);
    
        if (Auth::id() != $id && !Auth::user()->is_admin) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $user->update($request->only(['nickname', 'email']));
        
        if ($request->password) {
            $user->password = Hash::make($request->password);
            $user->save();
        }

        return response()->json($user, 200);
    }

    // DELETE: Borrar cuenta
    public function destroy(string $id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['message' => 'No encontrado'], 404);
        
        if (Auth::id() != $id && !Auth::user()->is_admin) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $user->delete();
        return response()->json(['message' => 'Usuario eliminado'], 200);
    }

    // POST: Registro de nuevos usuarios
    public function register(Request $request) 
    {
        $fields = $request->validate([
            'nickname' => 'required|string|unique:users,nickname',
            'email' => 'required|string|unique:users,email',
            'password' => 'required|string|confirmed' 
        ]);

        $user = User::create([
            'nickname' => $fields['nickname'],
            'email' => $fields['email'],
            'password' => Hash::make($fields['password']),
            'is_admin' => false 
        ]);

        $token = $user->createToken('lamerbox_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 201);
    }

    // POST: Inicio de sesión
    public function login(Request $request) 
    {
        $fields = $request->validate([
            'email' => 'required|string',
            'password' => 'required|string'
        ]);

        $user = User::where('email', $fields['email'])->first();

        if (!$user || !Hash::check($fields['password'], $user->password)) {
            return response()->json([
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        $token = $user->createToken('lamerbox_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 200);
    }
}