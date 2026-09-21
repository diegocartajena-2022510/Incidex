export interface Departamento {
  id_departamento: number;
  nombre_departamento: string;
  descripcion: string | null;
  estado_departamento: boolean;
}

export interface Categoria {
  id_categoria: number;
  id_departamento: number;
  nombre_categoria: string;
  descripcion: string | null;
  estado_categoria: boolean;
  nombre_departamento?: string;
}

export interface Ubicacion {
  id_ubicacion: number;
  nombre_ubicacion: string;
  nivel: string | null;
  descripcion: string | null;
  estado_ubicacion: boolean;
}

export type NombrePrioridad = 'Baja' | 'Media' | 'Alta' | 'Critica';

export interface Prioridad {
  id_prioridad: number;
  nombre_prioridad: NombrePrioridad;
  descripcion: string | null;
  estado_prioridad: boolean;
}