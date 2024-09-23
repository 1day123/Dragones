<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Persona;
use App\Models\Pareja;
use App\Models\Hijo;

class ControllerDragon extends Controller
{
    public function index()
    {
        return Inertia::render('Dragones/Index',[
            'personas' => Persona::orderBy('nombre')
            ->get(),

            'hijos' => Hijo::select('id', 'id_hijo','id_padre')
            ->orderBy('id_hijo')
            ->get(),

            'parejas' => Pareja::select('id', 'id_persona1','id_persona1')
            ->orderBy('id_persona1')
            ->get(),
   

        ]
    
    
    );
    }

    //Funcion para mostrar nuestro arbol 
      public function Arbol()
    {
        return Inertia::render('Arbol/Index',[
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
                'nombre' => 'required|string|max:255',  // nombre es obligatorio
            ]);

            // Crear una nueva persona con los datos validados
            Persona::create($validated);

            return back();
        }

        public function delete(Persona $persona)
        {
            $persona->delete();
    
            return back();
        }

        public function update(Persona $persona, Request $request)
        {
            // Definir las reglas de validación
            $validated = $request->validate([
                'nombre' => 'required|string|max:255',  // nombre es obligatorio
            ]);
        
            // Actualizar la persona con los datos validados
            $persona->update($validated);
        
            return back();
        }

}

