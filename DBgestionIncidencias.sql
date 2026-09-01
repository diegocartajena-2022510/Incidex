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

-- ////////////////////////////
-- Procedimientos de almacendo
-- ////////////////////////////

-- login

delimiter //

create procedure sp_agregarlogin(
    in p_correo varchar(100),
    in p_usuario varchar(50),
    in p_contrasena varchar(100),
    in p_rol varchar(30)
)
begin
    insert into login (
        correo_login,
        usuario_login,
        contrasena_login,
        rol_login
    )
    values (
        p_correo,
        p_usuario,
        p_contrasena,
        p_rol
    );
end //

create procedure sp_listarlogin()
begin
    select * from login;
end //

create procedure sp_actualizarlogin(
    in p_id int,
    in p_correo varchar(100),
    in p_usuario varchar(50),
    in p_contrasena varchar(100),
    in p_rol varchar(30),
    in p_estado boolean
)
begin
    update login
    set correo_login = p_correo,
        usuario_login = p_usuario,
        contrasena_login = p_contrasena,
        rol_login = p_rol,
        estado_login = p_estado
    where id_login = p_id;
end //

create procedure sp_eliminarlogin(
    in p_id int
)
begin
    delete from login
    where id_login = p_id;
end //

delimiter ;

-- departamentos

delimiter //

create procedure sp_agregardepartamento(
    in p_nombre varchar(80),
    in p_descripcion text
)
begin
    insert into departamentos (
        nombre_departamento,
        descripcion
    )
    values (
        p_nombre,
        p_descripcion
    );
end //

create procedure sp_listardepartamentos()
begin
    select * from departamentos;
end //

create procedure sp_actualizardepartamento(
    in p_id int,
    in p_nombre varchar(80),
    in p_descripcion text,
    in p_estado boolean
)
begin
    update departamentos
    set nombre_departamento = p_nombre,
        descripcion = p_descripcion,
        estado_departamento = p_estado
    where id_departamento = p_id;
end //

create procedure sp_eliminardepartamento(
    in p_id int
)
begin
    delete from departamentos
    where id_departamento = p_id;
end //

delimiter ;

-- usuarios

delimiter //

create procedure sp_agregarusuario(
    in p_id_login int,
    in p_id_departamento int,
    in p_nombre varchar(50),
    in p_apellido varchar(50),
    in p_telefono varchar(15)
)
begin
    insert into usuarios (
        id_login,
        id_departamento,
        nombre_usuario,
        apellido_usuario,
        telefono
    )
    values (
        p_id_login,
        p_id_departamento,
        p_nombre,
        p_apellido,
        p_telefono
    );
end //

create procedure sp_listarusuarios()
begin
    select
        u.id_usuario,
        u.nombre_usuario,
        u.apellido_usuario,
        u.telefono,
        u.estado_usuario,
        l.usuario_login,
        l.correo_login,
        l.rol_login,
        d.nombre_departamento
    from usuarios u
    left join login l on u.id_login = l.id_login
    left join departamentos d on u.id_departamento = d.id_departamento;
end //

create procedure sp_actualizarusuario(
    in p_id int,
    in p_id_login int,
    in p_id_departamento int,
    in p_nombre varchar(50),
    in p_apellido varchar(50),
    in p_telefono varchar(15),
    in p_estado boolean
)
begin
    update usuarios
    set id_login = p_id_login,
        id_departamento = p_id_departamento,
        nombre_usuario = p_nombre,
        apellido_usuario = p_apellido,
        telefono = p_telefono,
        estado_usuario = p_estado
    where id_usuario = p_id;
end //

create procedure sp_eliminarusuario(
    in p_id int
)
begin
    delete from usuarios
    where id_usuario = p_id;
end //

delimiter ;

-- categorias

delimiter //

create procedure sp_agregarcategoria(
    in p_id_departamento int,
    in p_nombre varchar(80),
    in p_descripcion text
)
begin
    insert into categorias (
        id_departamento,
        nombre_categoria,
        descripcion
    )
    values (
        p_id_departamento,
        p_nombre,
        p_descripcion
    );
end //

create procedure sp_listarcategorias()
begin
    select
        c.id_categoria,
        c.nombre_categoria,
        c.descripcion,
        c.estado_categoria,
        d.nombre_departamento
    from categorias c
    inner join departamentos d
        on c.id_departamento = d.id_departamento;
end //

create procedure sp_actualizarcategoria(
    in p_id int,
    in p_id_departamento int,
    in p_nombre varchar(80),
    in p_descripcion text,
    in p_estado boolean
)
begin
    update categorias
    set id_departamento = p_id_departamento,
        nombre_categoria = p_nombre,
        descripcion = p_descripcion,
        estado_categoria = p_estado
    where id_categoria = p_id;
end //

create procedure sp_eliminarcategoria(
    in p_id int
)
begin
    delete from categorias
    where id_categoria = p_id;
end //

delimiter ;

-- ubicaciones

delimiter //

create procedure sp_agregarubicacion(
    in p_nombre varchar(100),
    in p_nivel varchar(30),
    in p_descripcion text
)
begin
    insert into ubicaciones (
        nombre_ubicacion,
        nivel,
        descripcion
    )
    values (
        p_nombre,
        p_nivel,
        p_descripcion
    );
end //

create procedure sp_listarubicaciones()
begin
    select * from ubicaciones;
end //

create procedure sp_actualizarubicacion(
    in p_id int,
    in p_nombre varchar(100),
    in p_nivel varchar(30),
    in p_descripcion text,
    in p_estado boolean
)
begin
    update ubicaciones
    set nombre_ubicacion = p_nombre,
        nivel = p_nivel,
        descripcion = p_descripcion,
        estado_ubicacion = p_estado
    where id_ubicacion = p_id;
end //

create procedure sp_eliminarubicacion(
    in p_id int
)
begin
    delete from ubicaciones
    where id_ubicacion = p_id;
end //

delimiter ;

-- prioridades

delimiter //

create procedure sp_agregarprioridad(
    in p_nombre varchar(20),
    in p_descripcion text
)
begin
    insert into prioridades (
        nombre_prioridad,
        descripcion
    )
    values (
        p_nombre,
        p_descripcion
    );
end //

create procedure sp_listarprioridades()
begin
    select * from prioridades;
end //

create procedure sp_actualizarprioridad(
    in p_id int,
    in p_nombre varchar(20),
    in p_descripcion text,
    in p_estado boolean
)
begin
    update prioridades
    set nombre_prioridad = p_nombre,
        descripcion = p_descripcion,
        estado_prioridad = p_estado
    where id_prioridad = p_id;
end //

create procedure sp_eliminarprioridad(
    in p_id int
)
begin
    delete from prioridades
    where id_prioridad = p_id;
end //

delimiter ;


-- incidencias

delimiter //

create procedure sp_agregarincidencia(
    in p_id_usuario int,
    in p_id_categoria int,
    in p_id_ubicacion int,
    in p_id_prioridad int,
    in p_titulo varchar(100),
    in p_descripcion text
)
begin
    insert into incidencias (
        id_usuario,
        id_categoria,
        id_ubicacion,
        id_prioridad,
        titulo_incidencia,
        descripcion_incidencia
    )
    values (
        p_id_usuario,
        p_id_categoria,
        p_id_ubicacion,
        p_id_prioridad,
        p_titulo,
        p_descripcion
    );
end //

create procedure sp_listarincidencias()
begin
    select
        i.id_incidencia,
        i.titulo_incidencia,
        i.descripcion_incidencia,
        i.estado_incidencia,
        i.fecha_creacion,
        i.fecha_resolucion,
        concat(u.nombre_usuario, ' ', u.apellido_usuario) as usuario,
        c.nombre_categoria,
        ub.nombre_ubicacion,
        p.nombre_prioridad
    from incidencias i
    inner join usuarios u
        on i.id_usuario = u.id_usuario
    inner join categorias c
        on i.id_categoria = c.id_categoria
    inner join ubicaciones ub
        on i.id_ubicacion = ub.id_ubicacion
    inner join prioridades p
        on i.id_prioridad = p.id_prioridad;
end //

create procedure sp_actualizarincidencia(
    in p_id int,
    in p_id_usuario int,
    in p_id_categoria int,
    in p_id_ubicacion int,
    in p_id_prioridad int,
    in p_titulo varchar(100),
    in p_descripcion text,
    in p_estado varchar(30),
    in p_fecha_resolucion datetime
)
begin
    update incidencias
    set id_usuario = p_id_usuario,
        id_categoria = p_id_categoria,
        id_ubicacion = p_id_ubicacion,
        id_prioridad = p_id_prioridad,
        titulo_incidencia = p_titulo,
        descripcion_incidencia = p_descripcion,
        estado_incidencia = p_estado,
        fecha_resolucion = p_fecha_resolucion
    where id_incidencia = p_id;
end //

create procedure sp_eliminarincidencia(
    in p_id int
)
begin
    delete from incidencias
    where id_incidencia = p_id;
end //

delimiter ;

-- asignaciones

delimiter //

create procedure sp_agregarasignacion(
    in p_id_incidencia int,
    in p_id_usuario int,
    in p_observaciones text
)
begin
    insert into asignaciones (
        id_incidencia,
        id_usuario,
        observaciones
    )
    values (
        p_id_incidencia,
        p_id_usuario,
        p_observaciones
    );
end //

create procedure sp_listarasignaciones()
begin
    select
        a.id_asignacion,
        a.id_incidencia,
        a.id_usuario,
        concat(u.nombre_usuario, ' ', u.apellido_usuario) as usuario,
        i.titulo_incidencia,
        a.fecha_asignacion,
        a.fecha_finalizacion,
        a.observaciones,
        a.estado_asignacion
    from asignaciones a
    inner join usuarios u
        on a.id_usuario = u.id_usuario
    inner join incidencias i
        on a.id_incidencia = i.id_incidencia;
end //

create procedure sp_actualizarasignacion(
    in p_id int,
    in p_id_incidencia int,
    in p_id_usuario int,
    in p_fecha_finalizacion datetime,
    in p_observaciones text,
    in p_estado boolean
)
begin
    update asignaciones
    set id_incidencia = p_id_incidencia,
        id_usuario = p_id_usuario,
        fecha_finalizacion = p_fecha_finalizacion,
        observaciones = p_observaciones,
        estado_asignacion = p_estado
    where id_asignacion = p_id;
end //

create procedure sp_eliminarasignacion(
    in p_id int
)
begin
    delete from asignaciones
    where id_asignacion = p_id;
end //

delimiter ;

-- historialincidencias

delimiter //

create procedure sp_agregarhistorial(
    in p_id_incidencia int,
    in p_id_usuario int,
    in p_estado_anterior varchar(30),
    in p_estado_nuevo varchar(30),
    in p_comentario text
)
begin
    insert into historialincidencias (
        id_incidencia,
        id_usuario,
        estado_anterior,
        estado_nuevo,
        comentario
    )
    values (
        p_id_incidencia,
        p_id_usuario,
        p_estado_anterior,
        p_estado_nuevo,
        p_comentario
    );
end //

create procedure sp_listarhistorial()
begin
    select
        h.id_historial,
        h.id_incidencia,
        i.titulo_incidencia,
        h.id_usuario,
        concat(u.nombre_usuario, ' ', u.apellido_usuario) as usuario,
        h.estado_anterior,
        h.estado_nuevo,
        h.comentario,
        h.fecha_cambio
    from historialincidencias h
    inner join incidencias i
        on h.id_incidencia = i.id_incidencia
    inner join usuarios u
        on h.id_usuario = u.id_usuario;
end //

create procedure sp_actualizarhistorial(
    in p_id int,
    in p_id_incidencia int,
    in p_id_usuario int,
    in p_estado_anterior varchar(30),
    in p_estado_nuevo varchar(30),
    in p_comentario text
)
begin
    update historialincidencias
    set id_incidencia = p_id_incidencia,
        id_usuario = p_id_usuario,
        estado_anterior = p_estado_anterior,
        estado_nuevo = p_estado_nuevo,
        comentario = p_comentario
    where id_historial = p_id;
end //

create procedure sp_eliminarhistorial(
    in p_id int
)
begin
    delete from historialincidencias
    where id_historial = p_id;
end //

delimiter ;


-- comentarios

delimiter //

create procedure sp_agregarcomentario(
    in p_id_incidencia int,
    in p_id_usuario int,
    in p_comentario text
)
begin
    insert into comentarios (
        id_incidencia,
        id_usuario,
        comentario
    )
    values (
        p_id_incidencia,
        p_id_usuario,
        p_comentario
    );
end //

create procedure sp_listarcomentarios()
begin
    select
        c.id_comentario,
        c.id_incidencia,
        i.titulo_incidencia,
        c.id_usuario,
        concat(u.nombre_usuario, ' ', u.apellido_usuario) as usuario,
        c.comentario,
        c.fecha_comentario
    from comentarios c
    inner join incidencias i
        on c.id_incidencia = i.id_incidencia
    inner join usuarios u
        on c.id_usuario = u.id_usuario;
end //

create procedure sp_actualizarcomentario(
    in p_id int,
    in p_id_incidencia int,
    in p_id_usuario int,
    in p_comentario text
)
begin
    update comentarios
    set id_incidencia = p_id_incidencia,
        id_usuario = p_id_usuario,
        comentario = p_comentario
    where id_comentario = p_id;
end //

create procedure sp_eliminarcomentario(
    in p_id int
)
begin
    delete from comentarios
    where id_comentario = p_id;
end //

delimiter ;


-- adjuntos

delimiter //

create procedure sp_agregaradjunto(
    in p_id_incidencia int,
    in p_id_usuario int,
    in p_nombre_archivo varchar(100),
    in p_ruta_archivo varchar(255),
    in p_tipo_archivo varchar(50)
)
begin
    insert into adjuntos (
        id_incidencia,
        id_usuario,
        nombre_archivo,
        ruta_archivo,
        tipo_archivo
    )
    values (
        p_id_incidencia,
        p_id_usuario,
        p_nombre_archivo,
        p_ruta_archivo,
        p_tipo_archivo
    );
end //

create procedure sp_listaradjuntos()
begin
    select
        a.id_adjunto,
        a.id_incidencia,
        i.titulo_incidencia,
        a.id_usuario,
        concat(u.nombre_usuario, ' ', u.apellido_usuario) as usuario,
        a.nombre_archivo,
        a.ruta_archivo,
        a.tipo_archivo,
        a.fecha_archivo
    from adjuntos a
    inner join incidencias i
        on a.id_incidencia = i.id_incidencia
    inner join usuarios u
        on a.id_usuario = u.id_usuario;
end //

create procedure sp_actualizaradjunto(
    in p_id int,
    in p_id_incidencia int,
    in p_id_usuario int,
    in p_nombre_archivo varchar(100),
    in p_ruta_archivo varchar(255),
    in p_tipo_archivo varchar(50)
)
begin
    update adjuntos
    set id_incidencia = p_id_incidencia,
        id_usuario = p_id_usuario,
        nombre_archivo = p_nombre_archivo,
        ruta_archivo = p_ruta_archivo,
        tipo_archivo = p_tipo_archivo
    where id_adjunto = p_id;
end //

create procedure sp_eliminaradjunto(
    in p_id int
)
begin
    delete from adjuntos
    where id_adjunto = p_id;
end //

delimiter ;

CALL sp_agregarlogin('admin.general@cartagena.edu', 'admin_gral', 'pass1234', 'Administrador');
CALL sp_agregarlogin('tics.soporte1@cartagena.edu', 'tics_juan', 'pass1234', 'Personal TICS');
CALL sp_agregarlogin('tics.soporte2@cartagena.edu', 'tics_maria', 'pass1234', 'Personal TICS');
CALL sp_agregarlogin('prof.matematicas@cartagena.edu', 'prof_carlos', 'pass1234', 'Profesor');
CALL sp_agregarlogin('prof.historia@cartagena.edu', 'prof_ana', 'pass1234', 'Profesor');
CALL sp_agregarlogin('servicios.limpieza@cartagena.edu', 'serv_pedro', 'pass1234', 'Personal Servicios');
CALL sp_agregarlogin('servicios.mantenimiento@cartagena.edu', 'serv_luisa', 'pass1234', 'Personal Servicios');
CALL sp_agregarlogin('infra.redes@cartagena.edu', 'infra_jorge', 'pass1234', 'Personal Infraestructura');
CALL sp_agregarlogin('prof.ciencias@cartagena.edu', 'prof_sofia', 'pass1234', 'Profesor');
CALL sp_agregarlogin('infra.seguridad@cartagena.edu', 'infra_carmen', 'pass1234', 'Personal Infraestructura');

CALL sp_agregardepartamento('Dirección General', 'Departamento administrativo y de dirección superior');
CALL sp_agregardepartamento('Soporte TICS', 'Soporte técnico, equipos de cómputo y software institucional');
CALL sp_agregardepartamento('Infraestructura y Redes', 'Mantenimiento de redes, cableado y servidores');
CALL sp_agregardepartamento('Servicios Generales', 'Limpieza, conserjería y áreas comunes');
CALL sp_agregardepartamento('Académico - Matemáticas', 'Departamento de enseñanza de matemáticas y física');
CALL sp_agregardepartamento('Académico - Ciencias', 'Laboratorios y materias científicas');
CALL sp_agregardepartamento('Académico - Humanidades', 'Historia, literatura y ciencias sociales');
CALL sp_agregardepartamento('Mantenimiento Fiduciario', 'Reparaciones locativas, plomería y electricidad');
CALL sp_agregardepartamento('Recursos Humanos', 'Gestión de personal docente y administrativo');
CALL sp_agregardepartamento('Biblioteca', 'Gestión de libros, salas de lectura y recursos digitales');

CALL sp_agregarusuario(1, 1, 'Roberto', 'Mendoza', '5551-0101');
CALL sp_agregarusuario(2, 2, 'Juan', 'Pérez', '5551-0202');
CALL sp_agregarusuario(3, 2, 'María', 'Gómez', '5551-0303');
CALL sp_agregarusuario(4, 5, 'Carlos', 'López', '5551-0404');
CALL sp_agregarusuario(5, 7, 'Ana', 'Martínez', '5551-0505');
CALL sp_agregarusuario(6, 4, 'Pedro', 'Sánchez', '5551-0606');
CALL sp_agregarusuario(7, 8, 'Luisa', 'Fernández', '5551-0707');
CALL sp_agregarusuario(8, 3, 'Jorge', 'Ramírez', '5551-0808');
CALL sp_agregarusuario(9, 6, 'Sofía', 'Castillo', '5551-0909');
CALL sp_agregarusuario(10, 8, 'Carmen', 'Morales', '5551-1010');

CALL sp_agregarcategoria(2, 'Fallos de Hardware', 'Problemas con computadoras, pantallas o proyectores');
CALL sp_agregarcategoria(2, 'Problemas de Software', 'Errores en sistemas operativos o aplicaciones institucionales');
CALL sp_agregarcategoria(3, 'Conectividad Wi-Fi', 'Fallas en la señal inalámbrica del campus');
CALL sp_agregarcategoria(3, 'Cables de Red', 'Puntos de red dañados o sin conexión física');
CALL sp_agregarcategoria(4, 'Limpieza de Aula', 'Solicitud de limpieza en salones específicos');
CALL sp_agregarcategoria(8, 'Iluminación', 'Bombillas fundidas o problemas con interruptores');
CALL sp_agregarcategoria(8, 'Plomería y Fugas', 'Problemas en tuberías, baños o bebederos');
CALL sp_agregarcategoria(5, 'Material Didáctico', 'Falta de recursos en aulas de matemáticas');
CALL sp_agregarcategoria(6, 'Equipos de Laboratorio', 'Mal funcionamiento de microscopios o instrumentos');
CALL sp_agregarcategoria(10, 'Préstamo de Libros', 'Incidencias con el catálogo o sistema de biblioteca');

CALL sp_agregarubicacion('Edificio A - Aula 101', 'Nivel 1', 'Salón de clases principal planta baja');
CALL sp_agregarubicacion('Edificio A - Aula 202', 'Nivel 2', 'Salón de clases planta alta');
CALL sp_agregarubicacion('Edificio B - Laboratorio de Computación', 'Nivel 1', 'Sala de equipos y prácticas TICS');
CALL sp_agregarubicacion('Edificio B - Laboratorio de Ciencias', 'Nivel 2', 'Laboratorio de física y química');
CALL sp_agregarubicacion('Biblioteca Central', 'Nivel 1', 'Área de lectura y estanterías');
CALL sp_agregarubicacion('Oficinas Administrativas', 'Nivel 1', 'Dirección y secretaría general');
CALL sp_agregarubicacion('Salón de Profesores', 'Nivel 2', 'Área de descanso y planeación docente');
CALL sp_agregarubicacion('Área Deportiva - Gimnasio', 'Nivel 1', 'Gimnasio techado institucional');
CALL sp_agregarubicacion('Cafetería Estudiantil', 'Nivel 1', 'Área de comidas y descanso');
CALL sp_agregarubicacion('Centro de Servidores (DataCenter)', 'Nivel 1', 'Cuarto técnico de redes principal');

CALL sp_agregarprioridad('Baja', 'Incidencias menores que no afectan la operatividad inmediata');
CALL sp_agregarprioridad('Media', 'Incidencias que afectan parcialmente las labores cotidianas');
CALL sp_agregarprioridad('Alta', 'Problemas urgentes que detienen una actividad importante');
CALL sp_agregarprioridad('Critica', 'Emergencias absolutas que paralizan áreas completas o sistemas');

CALL sp_agregarincidencia(4, 1, 1, 2, 'Proyector sin video', 'El proyector del aula 101 no enciende al conectar la laptop');
CALL sp_agregarincidencia(5, 2, 2, 3, 'Error en plataforma virtual', 'No carga el módulo de calificaciones para el curso de historia');
CALL sp_agregarincidencia(4, 3, 3, 2, 'Sin señal de Wi-Fi en lab', 'Los equipos de computación no detectan la red institucional');
CALL sp_agregarincidencia(6, 5, 9, 1, 'Basura acumulada en cafetería', 'Se requiere recolección urgente de residuos en mesas exteriores');
CALL sp_agregarincidencia(7, 6, 7, 2, 'Lámpara fundida', 'La iluminación del salón de profesores parpadea constantemente');
CALL sp_agregarincidencia(8, 4, 10, 4, 'Caída del servidor principal', 'Inaccesibilidad total a los sistemas de red y carpetas compartidas');
CALL sp_agregarincidencia(9, 9, 4, 3, 'Microscopio dañado', 'El lente del microscopio número 4 está rayado');
CALL sp_agregarincidencia(4, 8, 1, 1, 'Pintura descascarada', 'Se observa daño estético en la pared lateral del aula 101');
CALL sp_agregarincidencia(5, 7, 5, 3, 'Fuga de agua en baños', 'Grifo roto en el baño principal de la biblioteca');
CALL sp_agregarincidencia(10, 10, 5, 2, 'Sistema de biblioteca lento', 'El software de búsqueda de libros presenta retrasos');

CALL sp_agregarasignacion(1, 2, 'Asignado a revisión técnica de proyector');
CALL sp_agregarasignacion(2, 3, 'Revisión de base de datos y credenciales de usuario');
CALL sp_agregarasignacion(3, 8, 'Inspección del Access Point del edificio B');
CALL sp_agregarasignacion(4, 6, 'Turno de limpieza asignado al personal de servicio');
CALL sp_agregarasignacion(5, 7, 'Cambio de balastro y bombilla programado');
CALL sp_agregarasignacion(6, 8, 'Atención inmediata por caída de servidores');
CALL sp_agregarasignacion(7, 3, 'Revisión de equipo especializado de laboratorio');
CALL sp_agregarasignacion(8, 7, 'Evaluación de daños estéticos');
CALL sp_agregarasignacion(9, 7, 'Reparación de tubería y grifería');
CALL sp_agregarasignacion(10, 2, 'Optimización de base de datos bibliotecaria');

CALL sp_agregarhistorial(1, 2, 'Pendiente', 'En Revision', 'Se recibe la incidencia y se verifica el equipo.');
CALL sp_agregarhistorial(2, 3, 'Pendiente', 'En Proceso', 'Se contacta al proveedor del software.');
CALL sp_agregarhistorial(3, 8, 'Pendiente', 'En Revision', 'Verificando estado del router principal.');
CALL sp_agregarhistorial(4, 6, 'Pendiente', 'En Proceso', 'Personal de limpieza enviado al área.');
CALL sp_agregarhistorial(5, 7, 'Pendiente', 'Resuelto', 'Lámpara sustituida con éxito.');
CALL sp_agregarhistorial(6, 8, 'Pendiente', 'Critica / En Proceso', 'Reinicio forzoso de servidores y respaldo.');
CALL sp_agregarhistorial(7, 3, 'Pendiente', 'En Revision', 'Revisando inventario de repuestos.');
CALL sp_agregarhistorial(8, 7, 'Pendiente', 'Pendiente', 'A la espera de presupuesto para pintura.');
CALL sp_agregarhistorial(9, 7, 'Pendiente', 'En Proceso', 'Cerrada llave de paso principal para reparación.');
CALL sp_agregarhistorial(10, 2, 'Pendiente', 'Resuelto', 'Servidor de biblioteca optimizado.');

CALL sp_agregarcomentario(1, 4, 'El cable VGA ya fue probado pero el puerto no responde.');
CALL sp_agregarcomentario(2, 5, 'Aún no puedo acceder con mi usuario institucional.');
CALL sp_agregarcomentario(3, 2, 'El punto de red ya da enlace intermitente.');
CALL sp_agregarcomentario(4, 6, 'Área limpia y despejada.');
CALL sp_agregarcomentario(5, 7, 'La iluminación quedó funcionando correctamente.');
CALL sp_agregarcomentario(6, 8, 'Servicios restaurados al 100%.');
CALL sp_agregarcomentario(7, 9, 'Se necesita cotizar repuesto con proveedor externo.');
CALL sp_agregarcomentario(8, 4, 'Esperando aprobación para iniciar trabajos de pintura.');
CALL sp_agregarcomentario(9, 7, 'Fuga controlada exitosamente.');
CALL sp_agregarcomentario(10, 10, 'El sistema responde mucho más rápido ahora.');

CALL sp_agregaradjunto(1, 4, 'error_proyector.png', '/uploads/incidencias/error_proyector.png', 'image/png');
CALL sp_agregaradjunto(2, 5, 'captura_error_login.jpg', '/uploads/incidencias/captura_error_login.jpg', 'image/jpeg');
CALL sp_agregaradjunto(3, 4, 'test_ping.log', '/uploads/incidencias/test_ping.log', 'text/plain');
CALL sp_agregaradjunto(4, 6, 'estado_cafeteria.jpg', '/uploads/incidencias/estado_cafeteria.jpg', 'image/jpeg');
CALL sp_agregaradjunto(5, 7, 'lampara_rota.jpg', '/uploads/incidencias/lampara_rota.jpg', 'image/jpeg');
CALL sp_agregaradjunto(6, 8, 'log_servidor.txt', '/uploads/incidencias/log_servidor.txt', 'text/plain');
CALL sp_agregaradjunto(7, 9, 'microscopio_daño.png', '/uploads/incidencias/microscopio_dano.png', 'image/png');
CALL sp_agregaradjunto(8, 4, 'pared_aula101.jpg', '/uploads/incidencias/pared_aula101.jpg', 'image/jpeg');
CALL sp_agregaradjunto(9, 7, 'fuga_bano.mp4', '/uploads/incidencias/fuga_bano.mp4', 'video/mp4');
CALL sp_agregaradjunto(10, 10, 'reporte_rendimiento.pdf', '/uploads/incidencias/reporte_rendimiento.pdf', 'application/pdf');