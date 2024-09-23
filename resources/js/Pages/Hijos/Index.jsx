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
    const { personas, hijos } = usePage().props;

    const toast = useRef();

    const menu = useRef();

    //declaramos nuestros objetos para manipular su actualizacion y registro
    const objhijo = {
        id: 0,
        id_padre: '',
        id_hijo: '',
    };

    const [selectedItem, setSelectedItem] = useState(objhijo);

    //hook personalizado de inertia para nuestros formularios
    const { data, setData, post, put, reset } = useForm(objhijo);

    const createHijo = () => {
        reset()
        setVisible(true)
    };

    const showMenu = (e, hijos) => {
        setSelectedItem(hijos)
        menu.current.toggle(e)
    };

    //Funcion para eliminar que traemos de nuestro controlador
    const eliminarHijo = (hijos) => {
        confirmDialog({
            message: '¿Deseas eliminar este registro?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Aceptar',
            rejectLabel: 'Cancelar',
            accept: () => {
                router.delete(route('hijos.delete', hijos), {
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
                        eliminarHijo(selectedItem.id);

                    }
                }
            ]
        }
    ];

    //Funcion que sustituye nuestros datos ya registrados en nuestros registros
    const modificarHijo = (hijos) => {

        setData({
            id: hijos.id,
            id_padre: hijos.id_padre || '',
            id_hijo: hijos.id_hijo || '',

        })

        setVisible(true)
    };

    //Funcion para guardar y actualizar que traemos de nuestro controlador
    const guardarHijo = () => {

        if (data.id > 0) {
            put(route('hijos.update', data.id), {
                onSuccess: page => {
                    toast.current.show({ severity: 'success', summary: 'Ok', detail: 'Registro actualizado' })
                    setVisible(false)
                },
                onError: errors => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se puede hacer la actualizacion: Una de las personas ya tiene padre o es su pareja' })
                }
            })
        } else {
            post(route('hijos.save'), {
                onSuccess: page => {
                    toast.current.show({ severity: 'success', summary: 'Ok', detail: 'Hijo registrado' })
                    setVisible(false)
                },
                onError: errors => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se puede hacer el registro: Una de las personas ya tiene padre o es su pareja' })
                }
            })
        }
    };

    const actions = (hijos) => {
        return (
            <div className="flex">
                <Menu model={items} onHide={() => setSelectedItem(objhijo)} popup ref={menu} />

                <Button icon="pi pi-ellipsis-h" text rounded onClick={(e) => showMenu(e, hijos)} size="small" aria-controls="popup_menu_table" aria-haspopup />
                <Button icon="pi pi-pencil" text rounded onClick={() => modificarHijo(hijos)} size="small" />

            </div>
        )
    };

    return (
        <>

            <Head title="Hijos" />

            <ConfirmDialog />
            <Toast ref={toast} />

            {/*Barra lateral que muestra nuestro formulario */}
            <Sidebar visible={visible} onHide={() => setVisible(false)} position="right" className="w-full md:w-6 lg:w-4">
                <h2 className="text-primary">{data.id > 0 ? 'Modificar Hijos' : 'Nueva Hijos'}</h2>

                <div className="grid mt-1">

                    <div className="col-12 my-3">
                        <FloatLabel>
                            <Dropdown
                                className="w-full"
                                name="id_padre"
                                value={data.id_padre}
                                onChange={(e) => setData('id_padre', e.target.value)}
                                options={personas}
                                optionLabel="nombre"
                                optionValue="id" />
                            <label htmlFor="id_padre">id_padre</label>
                        </FloatLabel>
                    </div>
                    <div className="col-12 my-3">
                        <FloatLabel>
                            <Dropdown
                                className="w-full"
                                name="id_hijo"
                                value={data.id_hijo}
                                onChange={(e) => setData('id_hijo', e.target.value)}
                                options={personas}
                                optionLabel="nombre"
                                optionValue="id" />
                            <label htmlFor="id_hijo">id_hijo</label>
                        </FloatLabel>
                    </div>
                </div>

                <div className="flex justify-content-center gap-1">
                    <Button label="Cancelar" icon="pi pi-times" severity="danger" onClick={() => setVisible(false)} text />
                    <Button label={data.id > 0 ? "Actualizar" : "Crear"} icon="pi pi-check" severity="success" text onClick={guardarHijo} />
                </div>
            </Sidebar>

            <div className="card p-4 border-round-xl">
                {/*Tabla que muestra lo que guardamos en nuestro formulario nuestro formulario */}
                <div className="col-12 mt-5">
                    <CardTitle label="Hijos" />

                    <div className="flex justify-content-end">
                        <Button icon="pi pi-plus" severity="primary" rounded text label="Agregar hijo" size="small" onClick={() => createHijo()} />
                    </div>

                    <div className="flex justify-content-end">
                        <Button icon="pi pi-sitemap" severity="primary" rounded text label="Ver Árbol" size="small" onClick={() => window.location.href = '/'} />
                    </div>

                    <DataTable value={hijos} className="my-3">
                        <Column field="id_hijo" header="Hijo" body={(rowData) => personas.find(c => c.id === rowData.id_hijo)?.nombre} />
                        <Column field="id_padre" header="Padre" body={(rowData) => personas.find(c => c.id === rowData.id_padre)?.nombre} />
                        <Column body={actions} key="actions" columnKey="actions" style={{ width: '3rem' }} />
                    </DataTable>
                </div>
            </div>
        </>


    );
}
