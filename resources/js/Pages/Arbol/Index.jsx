
import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { OrganizationChart } from 'primereact/organizationchart';
import { Button } from 'primereact/button';
import { FloatLabel } from 'primereact/floatlabel';

export default function Index() {
    const { personas, hijos, parejas } = usePage().props;

    // Transformación de los datos 
    const transformToOrgChart = (personas, hijos, parejas) => {
        const hijosMap = {};
        const parejaMap = {};
        const nombrePorId = {};

        // Inicializar los mapas
        personas.forEach(persona => {
            nombrePorId[persona.id] = persona.nombre;
            hijosMap[persona.id] = [];
            parejaMap[persona.id] = parejas
                .filter(pareja => pareja.id_persona1 === persona.id || pareja.id_persona2 === persona.id)
                .map(pareja => ({
                    id_persona1: pareja.id_persona1,
                    id_persona2: pareja.id_persona2 || null // Manejo de id_persona2 o indefinido
                }));
        });

        // Llenar el mapa de hijos
        hijos.forEach(hijo => {
            if (hijosMap[hijo.id_padre]) {
                hijosMap[hijo.id_padre].push({
                    id: hijo.id_hijo,
                    nombre: nombrePorId[hijo.id_hijo],
                });
            }
        });

        // Función recursiva para construir la estructura del organigrama
        const buildOrgChart = (persona) => {
            const hijosDePersona = hijosMap[persona.id] || [];
            const parejasDePersona = parejaMap[persona.id] || [];

            const children = [];

            // Agregar parejas
            parejasDePersona.forEach(pareja => {
                const parejaId = pareja.id_persona1 === persona.id ? pareja.id_persona2 : pareja.id_persona1;

                if (parejaId && nombrePorId[parejaId]) {
                    children.push({
                        label: nombrePorId[parejaId],
                        className: 'bg-pink-500 text-white',
                        style: { borderRadius: '12px' },
                        children: []
                    });
                    // Mostrar un mensaje si no hay id_persona2
                } else {
                    children.push({
                        label: "Pareja no definida",
                        className: 'bg-pink-500 text-white',
                        style: { borderRadius: '12px' },
                        children: []
                    });
                }
            });

            // Agregar hijos
            hijosDePersona.forEach(hijo => {
                children.push({
                    label: hijo.nombre,
                    className: 'bg-teal-500 text-white',
                    style: { borderRadius: '12px' },
                    children: buildOrgChart({ id: hijo.id, nombre: hijo.nombre }).children || []
                });
            });

            return {
                label: persona.nombre,
                data: { id: persona.id, nombre: persona.nombre },
                className: 'bg-purple-500 text-white',
                style: { borderRadius: '12px' },
                children: children,
            };
        };

        // Construye el organigrama para cada persona que tiene hijos
        return personas
            .filter(persona => hijosMap[persona.id].length > 0)
            .map(persona => buildOrgChart(persona));
    };

    // Llama a la función para transformar los datos al formato esperado por el OrganizationChart
    const orgChartData = transformToOrgChart(personas, hijos, parejas);



    //Titulo raiz del OrganizationChart
    const [data] = useState([
        {
            label: "La casa del dragon",
            className: 'bg-indigo-500 text-white',
            style: { borderRadius: '12px' },
            children: orgChartData
        },
    ]);



    return (
        <>


            <div className="card flex justify-content-center">
                <FloatLabel className="mx-2"> {/* Clase para margen horizontal */}
                    <Button severity="info" label="Registrar Personas" onClick={() => window.location.href = '/personas'} />
                </FloatLabel>
                <FloatLabel className="mx-2">
                    <Button severity="warning" label="Registrar Hijos" onClick={() => window.location.href = '/hijos'} />
                </FloatLabel>
                <FloatLabel className="mx-2">
                    <Button severity="help" label="Registrar Parejas" onClick={() => window.location.href = '/parejas'} />
                </FloatLabel>
            </div>

            <div className="card overflow-x-auto">
                <OrganizationChart value={data} />
            </div>

        </>
    );
}
