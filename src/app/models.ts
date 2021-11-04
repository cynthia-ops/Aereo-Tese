export interface Usuario {
    nombre: string;
    uid: string;
}

export interface Proveedor {
    idFirebase: String;
    empresa: String;
    rfc: String;
    nom_prov: String;
    app_prov: String;
    telefono: String,
    calle: String;
    colonia: String;
    municipio: String;
    ciudad: String;
}

export interface Productos {
    provedor: String
    producto: String;
    costo: number;
    stock: number;
    idFirebase: String;
}


export interface PedidoCarrito {
    id: string;
    usuario: Usuario;
    producto: ProductoPedido[];
    precioTotal: number
    estado: EstadoPedido

}


export interface ProductoPedido {
    producto: Producto;
    cantidad: number;
}

export interface Producto {
    marca: string;
    modelo: string;
    descripcion: string;
    precio: number;
    procesador: string;
    camara: string;
    rom: number;
    etiqueta: String
    existencias: number
    calificacion: number;
    url: string;
    idFirebsase: string;
}

export type EstadoPedido = 'Enviado' | 'En Camino' | 'Entregado' | 'En Proceso de Envio'