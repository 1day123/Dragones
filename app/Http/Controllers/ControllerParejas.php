<?php

namespace App\Http\Controllers;

use App\Models\Pareja; // Asegúrate de tener un modelo para la tabla parejas
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Persona;
use App\Models\Hijo;


class ControllerParejas extends Controller
{

    
    public function index()
    {
        //Con render mostramos la vista de nuestra interfaz
        return Inertia::render('Parejas/Index',[
            'personas' => Persona::orderBy('nombre')
            ->get(),
            //Mandamos a traer las relaciones de nuestro modelo
            'hijos' => Hijo::select('id', 'id_hijo','id_padre')
            ->orderBy('id_hijo')
            ->get(),

            'parejas' => Pareja::select('id', 'id_persona2','id_persona1')
            ->orderBy('id_persona1')
            ->get(),
   

        ]
    
    
    );
    }

    //funcion para guaradar parejas
    public function save(Request $request)
    {
        // Definir las reglas de validación
        $validated = $request->validate([
            'id_persona1' => 'required|integer|exists:persona,id|different:id_persona2', // persona1 no puede ser igual a persona2
            'id_persona2' => 'required|integer|exists:persona,id',
         ]);

         // Verificar si alguna de las personas ya tiene una pareja
        $persona1_tiene_pareja = Pareja::where('id_persona1', $validated['id_persona1'])
        ->orWhere('id_persona2', $validated['id_persona1'])
        ->exists();

        $persona2_tiene_pareja = Pareja::where('id_persona1', $validated['id_persona2'])
        ->orWhere('id_persona2', $validated['id_persona2'])
        ->exists();


    if ($persona1_tiene_pareja || $persona2_tiene_pareja) {
        return back()->withErrors('Una de las personas ya tiene una pareja asignada.');
    }


        // Crear un nuevo registro en la tabla parejas con los datos validados
        Pareja::create($validated);

        //retorna al mismo sitio
        return back();
    }

     //funcion para eliminar parejas
    public function delete(Pareja $pareja)
    {
        $pareja->delete();

        return back();
    }

    //funcion para actualizar parejas
public function update(Pareja $pareja, Request $request)
{
    // Definir las reglas de validación
    $validated = $request->validate([
        'id_persona1' => 'required|integer|exists:persona,id|different:id_persona2',
        'id_persona2' => 'required|integer|exists:persona,id',
    ]);

    // Verificar si alguna de las personas ya tiene otra pareja (excluyendo la pareja actual)
    $persona1_tiene_pareja = Pareja::where(function($query) use ($validated) {
                                        $query->where('id_persona1', $validated['id_persona1'])
                                              ->orWhere('id_persona2', $validated['id_persona1']);
                                    })
                                    ->where('id', '!=', $pareja->id)
                                    ->exists();

    $persona2_tiene_pareja = Pareja::where(function($query) use ($validated) {
                                        $query->where('id_persona1', $validated['id_persona2'])
                                              ->orWhere('id_persona2', $validated['id_persona2']);
                                    })
                                    ->where('id', '!=', $pareja->id)
                                    ->exists();

    if ($persona1_tiene_pareja || $persona2_tiene_pareja) {
        return back()->withErrors('Una de las personas ya tiene una pareja asignada.');
    }

    // Actualizar el registro en la tabla parejas
    $pareja->update($validated);

    return back();
}
}
