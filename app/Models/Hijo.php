<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Hijo extends Model
{
    use HasFactory;
    
    protected $table = 'hijos';//nombre de la tabla
    protected $fillable = ['id_padre','id_hijo'];//campos de la tabla
    public $timestamps = false;

        // Relación con el padre
        public function padre(): BelongsTo
        {
            return $this->belongsTo(Persona::class, 'id_padre');
        }

          // Relación con el hijo (la persona que es el hijo)
        public function hijo(): BelongsTo
        {
            return $this->belongsTo(Persona::class, 'id_hijo');
        }
}
