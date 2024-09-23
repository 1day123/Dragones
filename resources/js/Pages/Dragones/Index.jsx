//Importacion de componentes y hooks de inertia y primereact
import React, { useState, useRef } from 'react';
import { router, Head, usePage, useForm } from '@inertiajs/react';
import { Button } from 'primereact/button';
import { FloatLabel } from 'primereact/floatlabel';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Sidebar } from 'primereact/sidebar';
import { InputText } from 'primereact/inputtext';
import { Menu } from 'primereact/menu';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import CardTitle from '@/Components/CardTitle';


export default function Index() {

    const [visible, setVisible] = useState(false);

    //Traemos las propiedades que declaramos en nuestro controlador
    const { personas } = usePage().props;

    const toast = useRef();

    const menu = useRef();

    //declaramos nuestros objetos para manipular su actualizacion y registro
    const objPer = {
        id: 0,
        nombre: '',

    };

    const [selectedItem, setSelectedItem] = useState(objPer);

    //hook personalizado de inertia para nuestros formularios
    const { data, setData, post, put, reset } = useForm(objPer);

    const createPersona = () => {
        reset()
        setVisible(true)
    };

    const showMenu = (e, personas) => {
        setSelectedItem(personas)
        menu.current.toggle(e)
    };

    //Funcion para eliminar que traemos de nuestro controlador
    const eliminarPersona = (persona) => {
        confirmDialog({
            message: '¿Deseas eliminar este registro?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Aceptar',
            rejectLabel: 'Cancelar',
            accept: () => {
                router.delete(route('dragon.delete', persona), {
                    onSuccess: page => {
                        toast.current.show({ severity: "success", summary: "Ok", detail: "La razon ha sido eliminada" });
                    },
                    onError: errors => {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: 'No fue posible eliminar la información' });
                    }
                });

            }
        })
    };

    const items = [
        {
            label: 'Opciones',
            items: [
                {
                    label: 'Eliminar',
                    icon: 'pi pi-times',
                    command: () => {
                        eliminarPersona(selectedItem.id);

                    }
                }
            ]
        }
    ];

    //Funcion que sustituye nuestros datos ya registrados en nuestros registros
    const modificarPersona = (persona) => {

        setData({
            id: persona.id,
            nombre: persona.nombre || '',
        })

        setVisible(true)
    };

    //Funcion para guardar y actualizar que traemos de nuestro controlador
    const guardarPersona = () => {

        if (data.id > 0) {
            put(route('dragon.update', data.id), {
                onSuccess: page => {
                    toast.current.show({ severity: 'success', summary: 'Ok', detail: 'Registro actualizada' })
                    setVisible(false)
                },
                onError: errors => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'No ha sido posible actualizar la información' })
                }
            })
        } else {
            post(route('dragon.save'), {
                onSuccess: page => {
                    toast.current.show({ severity: 'success', summary: 'Ok', detail: 'Registrada' })
                    setVisible(false)
                },
                onError: errors => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'No ha sido posible registrar la información' })
                }
            })
        }
    };




    const actions = (personas) => {
        return (
            <div className="flex">
                <Menu model={items} onHide={() => setSelectedItem(objPer)} popup ref={menu} />

                <Button icon="pi pi-ellipsis-h" text rounded onClick={(e) => showMenu(e, personas)} size="small" aria-controls="popup_menu_table" aria-haspopup />
                <Button icon="pi pi-pencil" text rounded onClick={() => modificarPersona(personas)} size="small" />

            </div>
        )
    };


    return (
        <>


            <Head title="Dragones" />

            <ConfirmDialog />

            <Toast ref={toast} />

            {/*Barra lateral que muestra nuestro formulario */}
            <Sidebar visible={visible} onHide={() => setVisible(false)} position="right" className="w-full md:w-6 lg:w-4">
                <h2 className="text-primary">{data.id > 0 ? 'Modificar Persona' : 'Nueva Persona'}</h2>

                <div className="grid mt-1">

                    <div className="col-12 my-3">
                        <FloatLabel>
                            <InputText className="w-full"
                                name="nombre"
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                            />
                            <label htmlFor="nombre">Nombre</label>
                        </FloatLabel>
                    </div>

                </div>

                <div className="flex justify-content-center gap-1">
                    <Button label="Cancelar" icon="pi pi-times" severity="danger" onClick={() => setVisible(false)} text />
                    <Button label={data.id > 0 ? "Actualizar" : "Crear"} icon="pi pi-check" severity="success" text onClick={guardarPersona} />
                </div>
            </Sidebar>


            <div className="card p-4 border-round-xl">
                {/*Tabla que muestra lo que guardamos en nuestro formulario nuestro formulario */}
                <div className="col-12 mt-5">
                    <CardTitle label="Personas" />

                    <div className="flex justify-content-end">
                        <Button icon="pi pi-plus" severity="primary" rounded text label="Agregar persona" size="small" onClick={() => createPersona()} />
                    </div>

                    <div className="flex justify-content-end">
                        <Button icon="pi pi-sitemap" severity="primary" rounded text label="Ver Árbol" size="small" onClick={() => window.location.href = '/'} />
                    </div>

                    <DataTable value={personas} className="my-3">
                        <Column field="nombre" header="Nombre" />
                        <Column body={actions} key="actions" columnKey="actions" style={{ width: '3rem' }} />
                    </DataTable>
                </div>
            </div>


        </>


    );
}
