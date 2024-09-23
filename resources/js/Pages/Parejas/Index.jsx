//Importacion de componentes y hooks de inertia y primereact
import React, { useState, useRef } from 'react';
import { router, Head, usePage, useForm } from '@inertiajs/react';
import { Button } from 'primereact/button';
import { FloatLabel } from 'primereact/floatlabel';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Sidebar } from 'primereact/sidebar';
import { Menu } from 'primereact/menu';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dropdown } from 'primereact/dropdown';
import CardTitle from '@/Components/CardTitle';



export default function Index() {

    const [visible, setVisible] = useState(false);

    //Traemos las propiedades que declaramos en nuestro controlador
    const { personas, parejas } = usePage().props;

    const toast = useRef();

    const menu = useRef();

    //declaramos nuestros objetos para manipular su actualizacion y registro
    const objPareja = {
        id: 0,
        id_persona1: '',
        id_persona2: '',

    };

    const [selectedItem, setSelectedItem] = useState(objPareja);

    //hook personalizado de inertia para nuestros formularios
    const { data, setData, post, put, reset } = useForm(objPareja);

    const createPareja = () => {
        reset()
        setVisible(true)
    };

    const showMenu = (e, parejas) => {
        setSelectedItem(parejas)
        menu.current.toggle(e)
    };


    //Funcion para eliminar que traemos de nuestro controlador
    const eliminarPareja = (parejas) => {
        confirmDialog({
            message: '¿Deseas eliminar este registro?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Aceptar',
            rejectLabel: 'Cancelar',
            accept: () => {
                router.delete(route('parejas.delete', parejas), {
                    onSuccess: page => {
                        toast.current.show({ severity: "success", summary: "Ok", detail: "El registro ha sido eliminado" });
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
                        eliminarPareja(selectedItem.id);

                    }
                }
            ]
        }
    ];

    //Funcion que sustituye nuestros datos ya registrados en nuestros registros
    const modificarPareja = (parejas) => {
        setData({
            id: parejas.id,
            id_persona1: parejas.id_persona1 || '',
            id_persona2: parejas.id_persona2 || '',

        })
        setVisible(true)
    };

    //Funcion para guardar y actualizar que traemos de nuestro controlador
    const guardarPareja = () => {

        if (data.id > 0) {
            put(route('parejas.update', data.id), {
                onSuccess: page => {
                    toast.current.show({ severity: 'success', summary: 'Ok', detail: 'Registro actualizado' })
                    setVisible(false)
                },
                onError: errors => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se puede hacer la actualizacion: Una de las personas ya tiene pareja o son las mismas ' })
                }
            })
        } else {
            post(route('parejas.save'), {
                onSuccess: page => {
                    toast.current.show({ severity: 'success', summary: 'Ok', detail: 'Registrado' })
                    setVisible(false)
                },
                onError: errors => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se puede hacer el registro: Una de las personas ya tiene pareja o son las mismas' })
                }
            })
        }
    };



    const actions = (parejas) => {
        return (
            <div className="flex">
                <Menu model={items} onHide={() => setSelectedItem(objPareja)} popup ref={menu} />

                <Button icon="pi pi-ellipsis-h" text rounded onClick={(e) => showMenu(e, parejas)} size="small" aria-controls="popup_menu_table" aria-haspopup />
                <Button icon="pi pi-pencil" text rounded onClick={() => modificarPareja(parejas)} size="small" />

            </div>
        )
    };


    return (
        <>

            <Head title="Parejas" />

            <ConfirmDialog />

            <Toast ref={toast} />

            {/*Barra lateral que muestra nuestro formulario */}
            <Sidebar visible={visible} onHide={() => setVisible(false)} position="right" className="w-full md:w-6 lg:w-4">
                <h2 className="text-primary">{data.id > 0 ? 'Modificar Parejas' : 'Nueva Pareja'}</h2>

                <div className="grid mt-1">

                    <div className="col-12 my-3">
                        <FloatLabel>
                            <Dropdown
                                className="w-full"
                                name="id_persona1"
                                value={data.id_persona1}
                                onChange={(e) => setData('id_persona1', e.target.value)}
                                options={personas}
                                optionLabel="nombre"
                                optionValue="id" />
                            <label htmlFor="id_persona1">id_persona1</label>
                        </FloatLabel>

                    </div>
                    <div className="col-12 my-3">
                        <FloatLabel>
                            <Dropdown
                                className="w-full"
                                name="id_persona2"
                                value={data.id_persona2}
                                onChange={(e) => setData('id_persona2', e.target.value)}
                                options={personas}
                                optionLabel="nombre"
                                optionValue="id" />
                            <label htmlFor="id_persona2">id_persona2</label>
                        </FloatLabel>
                    </div>


                </div>

                <div className="flex justify-content-center gap-1">
                    <Button label="Cancelar" icon="pi pi-times" severity="danger" onClick={() => setVisible(false)} text />
                    <Button label={data.id > 0 ? "Actualizar" : "Crear"} icon="pi pi-check" severity="success" text onClick={guardarPareja} />
                </div>
            </Sidebar>

            <div className="card p-4 border-round-xl">
                {/*Tabla que muestra lo que guardamos en nuestro formulario nuestro formulario */}
                <div className="col-12 mt-5">
                    <CardTitle label="Parejas" />

                    <div className="flex justify-content-end">
                        <Button icon="pi pi-plus" severity="primary" rounded text label="Agregar parejas" size="small" onClick={() => createPareja()} />
                    </div>

                    <div className="flex justify-content-end">
                        <Button icon="pi pi-sitemap" severity="primary" rounded text label="Ver Árbol" size="small" onClick={() => window.location.href = '/'} />
                    </div>

                    <DataTable value={parejas} className="my-3">
                        <Column field="id_persona1" header="Pareja 1" body={(rowData) => personas.find(c => c.id === rowData.id_persona1)?.nombre} />
                        <Column field="id_persona2" header="Pareja 2" body={(rowData) => personas.find(c => c.id === rowData.id_persona2)?.nombre} />
                        <Column body={actions} key="actions" columnKey="actions" style={{ width: '3rem' }} />
                    </DataTable>
                </div>
            </div>
        </>


    );
}
