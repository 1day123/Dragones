<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Persona extends Model
{
    protected $table = 'persona';//nombre de la tabla
    protected $fillable = ['nombre'];//campos de la tabla
    public $timestamps = false;

        // Relación con la pareja
        public function pareja(): HasOne
        {
            return $this->hasOne(Pareja::class, 'id_persona1'); 
        }

        // Relación con los hijos
        public function hijos(): HasMany
        {
            return $this->hasMany(Hijo::class, 'id_padre'); 
        }
}



