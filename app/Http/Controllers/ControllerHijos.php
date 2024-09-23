<?php

namespace App\Http\Controllers;

use App\Models\Hijo; // Asegúrate de tener un modelo para la tabla hijos
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Persona;
use App\Models\Pareja; 

class ControllerHijos extends Controller
{

    public function index()
    {
         //Con render mostramos la vista de nuestra interfaz
        return Inertia::render('Hijos/Index',[
             //Mandamos a traer las relaciones de nuestro modelo
            'personas' => Persona::orderBy('nombre')
            ->get(),

            'hijos' => Hijo::select('id', 'id_hijo','id_padre')
            ->orderBy('id_hijo')
            ->get(),

            'parejas' => Pareja::select('id', 'id_persona2','id_persona1')
            ->orderBy('id_persona1')
            ->get(),
    
   

        ]
    
    
    );
    }


    public function save(Request $request)
    {
        // Definir las reglas de validación
        $validated = $request->validate([
            'id_padre' => 'required|integer|exists:persona,id|different:id_hijo',  // id_padre no puede ser igual a id_hijo
            'id_hijo' => 'required|integer|exists:persona,id',
        ]);
    
        // Verificar que el hijo no tenga más de dos padres
        $padresDelHijo = Hijo::where('id_hijo', $validated['id_hijo'])->count();
        
        if ($padresDelHijo >= 2) {
            return back()->withErrors('Este hijo ya tiene 2 padres registrados.');
        }
    
        // Verificar que los padres no sean la misma persona (por redundancia, ya está en las reglas de validación)
        if ($validated['id_padre'] == $validated['id_hijo']) {
            return back()->withErrors('El padre no puede ser el mismo que el hijo.');
        }
    
        // Verificar que el id del hijo no sea igual a los padres o la pareja
        $pareja = Pareja::where(function($query) use ($validated) {
            $query->where('id_persona1', $validated['id_padre'])
                  ->orWhere('id_persona2', $validated['id_padre']);
        })->first();
    
        if ($pareja && ($pareja->id_persona1 == $validated['id_hijo'] || $pareja->id_persona2 == $validated['id_hijo'])) {
            return back()->withErrors('El hijo no puede ser el mismo que la pareja de sus padres.');
        }
    
        // Si pasa todas las validaciones, crear el registro del hijo
        Hijo::create($validated);
    
        return back();
    }

    public function delete(Hijo $hijo)
    {
        $hijo->delete();

        return back();
    }

    public function update(Hijo $hijo, Request $request)
{
    // Definir las reglas de validación
    $validated = $request->validate([
        'id_padre' => 'required|integer|exists:persona,id|different:id_hijo',  // id_padre no puede ser igual a id_hijo
        'id_hijo' => 'required|integer|exists:persona,id',
    ]);

    // Verificar que el hijo no tenga más de dos padres, excluyendo el padre actual
    $padresDelHijo = Hijo::where('id_hijo', $validated['id_hijo'])
                         ->where('id', '!=', $hijo->id)  // Excluir el padre actual
                         ->count();
    
    if ($padresDelHijo >= 2) {
        return back()->withErrors('Este hijo ya tiene 2 padres registrados.');
    }

    // Verificar que los padres no sean la misma persona (redundante con la regla anterior)
    if ($validated['id_padre'] == $validated['id_hijo']) {
        return back()->withErrors('El padre no puede ser el mismo que el hijo.');
    }

    // Verificar que el id del hijo no sea igual a los padres o la pareja
    $pareja = Pareja::where(function($query) use ($validated) {
        $query->where('id_persona1', $validated['id_padre'])
              ->orWhere('id_persona2', $validated['id_padre']);
    })->first();

    if ($pareja && ($pareja->id_persona1 == $validated['id_hijo'] || $pareja->id_persona2 == $validated['id_hijo'])) {
        return back()->withErrors('El hijo no puede ser el mismo que la pareja de sus padres.');
    }

    // Si pasa todas las validaciones, actualizar el registro del hijo
    $hijo->update($validated);

    return back();
}
}
