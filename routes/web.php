<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ControllerDragon;
use App\Http\Controllers\ControllerParejas;
use App\Http\Controllers\ControllerHijos;

//ruta para arbol
Route::get('/', [ControllerDragon::class, 'arbol'])->name('dragones.arbol');

//rutas para personas
Route::get('/personas', [ControllerDragon::class, 'index'])->name('dragones.index');
Route::post('/persona', [ControllerDragon::class, 'save'])->name('dragon.save');
Route::put('/persona/{persona}', [ControllerDragon::class, 'update'])->name('dragon.delete');
Route::delete('/persona/{persona}', [ControllerDragon::class, 'delete'])->name('dragon.update');



// Rutas para Parejas
Route::post('/parejas', [ControllerParejas::class, 'save'])->name('parejas.save');
Route::put('/parejas/{pareja}', [ControllerParejas::class, 'update'])->name('parejas.update');
Route::delete('/parejas/{pareja}', [ControllerParejas::class, 'delete'])->name('parejas.delete');

// Rutas para Hijos
Route::get('/hijos', [ControllerHijos::class, 'index'])->name('parejas.index');
Route::post('/hijos', [ControllerHijos::class, 'save'])->name('hijos.save');
Route::put('/hijos/{hijo}', [ControllerHijos::class, 'update'])->name('hijos.update');
Route::delete('/hijos/{hijo}', [ControllerHijos::class, 'delete'])->name('hijos.delete');