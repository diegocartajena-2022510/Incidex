drop database if exists DBgestionIncidencias_in5cm;
create database DBgestionIncidencias_in5cm;
use DBgestionIncidencias_in5cm;

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