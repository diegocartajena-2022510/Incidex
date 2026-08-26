drop database if exists DBgestionIncidencias_in5cm;
create database DBgestionIncidencias_in5cm;
use DBgestionIncidencias_in5cm;

-- ///// ENTIDADES ///// --
create table Login (
    id_login int auto_increment not null,
    correo_login varchar(100) not null unique,
    usuario_login varchar(50) not null unique,
    contrasena_login varchar(100) not null,
    rol_login enum('Administrador','Profesor','Personal TICS','Personal Servicios','Personal Infraestructura') not null,
    estado_login boolean default true,
    primary key (id_login)
);

create table Departamentos (
    id_departamento int auto_increment not null,
    nombre_departamento varchar(80) not null unique,
    descripcion text,
    estado_departamento boolean default true,
    primary key (id_departamento)
);

create table Usuarios (
    id_usuario int auto_increment not null,
    id_login int,
    id_departamento int,
    nombre_usuario varchar(50) not null,
    apellido_usuario varchar(50) not null,
    telefono varchar(15),
    estado_usuario boolean default true,
    primary key (id_usuario),

    constraint FK_usuario_login foreign key (id_login) references Login(id_login) on delete set null,
    constraint FK_usuario_departamento foreign key (id_departamento) references Departamentos(id_departamento) on delete set null
);

create table Categorias (
    id_categoria int auto_increment not null,
    id_departamento int not null,
    nombre_categoria varchar(80) not null,
    descripcion text,
    estado_categoria boolean default true,
    primary key (id_categoria),

    constraint FK_categoria_departamento foreign key (id_departamento) references Departamentos(id_departamento) on delete cascade
);

create table Ubicaciones (
    id_ubicacion int auto_increment not null,
    nombre_ubicacion varchar(100) not null,
    nivel varchar(30),
    descripcion text,
    estado_ubicacion boolean default true,
    primary key (id_ubicacion)
);

create table Prioridades (
    id_prioridad int auto_increment not null,
    nombre_prioridad enum('Baja','Media','Alta','Critica') not null unique,
    descripcion text,
    estado_prioridad boolean default true,
    primary key (id_prioridad)
);

create table Incidencias (
    id_incidencia int auto_increment not null,
    id_usuario int not null,
    id_categoria int not null,
    id_ubicacion int not null,
    id_prioridad int not null,
    titulo_incidencia varchar(100) not null,
    descripcion_incidencia text not null,
    estado_incidencia enum('Pendiente','En Revision','En Proceso','Resuelto','Cerrado') default 'Pendiente',
    fecha_creacion datetime default current_timestamp,
    fecha_resolucion datetime,
    primary key (id_incidencia),

    constraint FK_incidencia_usuario foreign key (id_usuario) references Usuarios(id_usuario) on delete cascade,
    constraint FK_incidencia_categoria foreign key (id_categoria) references Categorias(id_categoria) on delete cascade,
    constraint FK_incidencia_ubicacion foreign key (id_ubicacion) references Ubicaciones(id_ubicacion) on delete cascade,
    constraint FK_incidencia_prioridad foreign key (id_prioridad) references Prioridades(id_prioridad) on delete cascade
);

create table Asignaciones (
    id_asignacion int auto_increment not null,
    id_incidencia int not null,
    id_usuario int not null,
    fecha_asignacion datetime default current_timestamp,
    fecha_finalizacion datetime,
    observaciones text,
    estado_asignacion boolean default true,
    primary key (id_asignacion),

    constraint FK_asignacion_incidencia foreign key (id_incidencia) references Incidencias(id_incidencia) on delete cascade,
    constraint FK_asignacion_usuario foreign key (id_usuario) references Usuarios(id_usuario) on delete cascade
);

create table HistorialIncidencias (
    id_historial int auto_increment not null,
    id_incidencia int not null,
    id_usuario int not null,
    estado_anterior varchar(30),
    estado_nuevo varchar(30) not null,
    comentario text,
    fecha_cambio datetime default current_timestamp,
    primary key (id_historial),

    constraint FK_historial_incidencia foreign key (id_incidencia) references Incidencias(id_incidencia) on delete cascade,
    constraint FK_historial_usuario foreign key (id_usuario) references Usuarios(id_usuario) on delete cascade
);

create table Comentarios (
    id_comentario int auto_increment not null,
    id_incidencia int not null,
    id_usuario int not null,
    comentario text not null,
    fecha_comentario datetime default current_timestamp,
    primary key (id_comentario),

    constraint FK_comentario_incidencia foreign key (id_incidencia) references Incidencias(id_incidencia) on delete cascade,
    constraint FK_comentario_usuario foreign key (id_usuario) references Usuarios(id_usuario) on delete cascade
);

create table Adjuntos (
    id_adjunto int auto_increment not null,
    id_incidencia int not null,
    id_usuario int not null,
    nombre_archivo varchar(100) not null,
    ruta_archivo varchar(255) not null,
    tipo_archivo varchar(50),
    fecha_archivo datetime default current_timestamp,
    primary key (id_adjunto),

    constraint FK_adjunto_incidencia foreign key (id_incidencia) references Incidencias(id_incidencia) on delete cascade,
    constraint FK_adjunto_usuario foreign key (id_usuario) references Usuarios(id_usuario) on delete cascade
);