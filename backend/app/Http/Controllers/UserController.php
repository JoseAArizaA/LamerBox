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
        // Solo si el usuario que pregunta es admin
        if (!Auth::user()->is_admin) {
            return response()->json(['message' => 'No tienes permisos'], 403);
        }
        return response()->json(User::all(), 200);
    }

    // GET: Ver el perfil de un usuario concreto
    public function show(string $id)
    {
        $user = User::with(['favoriteMovies', 'movieLists'])->find($id);
        if (!$user) return response()->json(['message' => 'Usuario no encontrado'], 404);
        return response()->json($user, 200);
    }

    // PUT: Actualizar datos (Nickname o Email)
    public function update(Request $request, string $id)
    {
        $user = User::find($id);
        
        // Seguridad: Solo puedes editarte a ti mismo o ser Admin
        if (Auth::id() != $id && !Auth::user()->is_admin) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $user->update($request->only(['nickname', 'email']));
        
        // Si quieren cambiar la contraseña
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
        
        // Seguridad: Solo tú o un Admin podéis borrar la cuenta
        if (Auth::id() != $id && !Auth::user()->is_admin) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $user->delete();
        return response()->json(['message' => 'Usuario eliminado'], 200);
    }

    // POST: Registro de nuevos usuarios
    public function register(Request $request) 
    {
        // 1. Validamos los datos de entrada
        $fields = $request->validate([
            'nickname' => 'required|string|unique:users,nickname',
            'email' => 'required|string|unique:users,email',
            'password' => 'required|string|confirmed' // Requiere password_confirmation en el front
        ]);

        // 2. Creamos el usuario en la base de datos
        $user = User::create([
            'nickname' => $fields['nickname'],
            'email' => $fields['email'],
            'password' => Hash::make($fields['password']),
            'is_admin' => false // Por defecto no son admin
        ]);

        // 3. Generamos el token de acceso
        $token = $user->createToken('lamerbox_token')->plainTextToken;

        // 4. Devolvemos la respuesta
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

        // Comprobar email
        $user = User::where('email', $fields['email'])->first();

        // Comprobar contraseña
        if (!$user || !Hash::check($fields['password'], $user->password)) {
            return response()->json([
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        // Generar token
        $token = $user->createToken('lamerbox_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 200);
    }
}