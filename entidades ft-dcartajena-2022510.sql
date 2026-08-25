create database entidadesCartajena_IN5CM;
use  entidadesCartajena_IN5CM;

create table reporte(
	id_reporte int primary key auto_increment not null,
    descripcion text not null
);

create table edificio(
	id_edificio int primary key auto_increment not null,
    edificio varchar(50)
);

create table salon(
	id_salon int primary key auto_increment not null,
    numero_salon varchar(10) not null,
    id_edificio int not null,
    constraint fk_id_edificio foreign key (id_edificio) references
    edificio(id_edificio) on delete cascade
);