<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * GET: Listar todos los usuarios.
     * Acceso: Solo Administradores (Protegido por middleware 'admin' en rutas).
     */
    public function index()
    {
        // Al estar protegido por el middleware 'admin' en api.php, 
        // ya no necesitamos el 'if' manual aquí.
        return response()->json(User::all(), 200);
    }

    /**
     * GET: Ver perfil detallado.
     */
    public function show(string $id)
    {
        $user = User::with(['favoriteMovies', 'movieLists'])->find($id);
        
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        return response()->json($user, 200);
    }

    /**
     * PUT: Actualizar datos (Nickname, Email o Password).
     */
    public function update(Request $request, string $id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['message' => 'No encontrado'], 404);

        // Seguridad: Solo el dueño o un Admin pueden editar
        if (Auth::id() != $id && !Auth::user()->is_admin) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        // Validamos los datos nuevos asegurando que el email/nickname sea único 
        // excepto para el usuario que se está editando.
        $request->validate([
            'nickname' => ['sometimes', 'string', Rule::unique('users')->ignore($user->id)],
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'sometimes|string|min:6'
        ]);

        // Actualizamos nickname y email
        $user->update($request->only(['nickname', 'email']));
        
        // Si se envió una contraseña nueva, la encriptamos
        if ($request->password) {
            $user->password = Hash::make($request->password);
            $user->save();
        }

        return response()->json([
            'message' => 'Datos actualizados correctamente',
            'user' => $user
        ], 200);
    }

    /**
     * DELETE: Borrar cuenta (Admin o Dueño).
     */
    public function destroy(string $id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['message' => 'Usuario no encontrado'], 404);
        
        // El Admin puede borrar a cualquiera, el Usuario solo a sí mismo
        if (Auth::id() != $id && !Auth::user()->is_admin) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $user->delete();
        return response()->json(['message' => 'Cuenta eliminada con éxito'], 200);
    }

    /**
     * POST: Registro de nuevos usuarios.
     */
    public function register(Request $request) 
    {
        $fields = $request->validate([
            'nickname' => 'required|string|unique:users,nickname',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|confirmed|min:6'
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

    /**
     * POST: Inicio de sesión.
     */
    public function login(Request $request) 
    {
        $fields = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string'
        ]);

        $user = User::where('email', $fields['email'])->first();

        if (!$user || !Hash::check($fields['password'], $user->password)) {
            return response()->json(['message' => 'Credenciales incorrectas'], 401);
        }

        $token = $user->createToken('lamerbox_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 200);
    }
}