<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pareja extends Model
{
    use HasFactory;
    
    protected $table = 'parejas'; //nombre de la tabla
    protected $fillable = ['id_persona1', 'id_persona2']; //campos de la tabla
    public $timestamps = false;

     // Relación con la persona
     public function persona(): BelongsTo
     {
         return $this->belongsTo(Persona::class, 'id_persona1'); 
     }
}
