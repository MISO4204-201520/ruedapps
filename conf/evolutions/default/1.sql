# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table categoria (
  id                        integer primary key AUTOINCREMENT,
  nombre                    varchar(255) not null,
  descripcion               varchar(255) not null,
  constraint uq_categoria_nombre unique (nombre))
;

create table historico_recorrido (
  id                        integer primary key AUTOINCREMENT,
  ciclista_id               integer not null,
  recorrido_id              integer,
  fecha                     timestamp,
  duracion                  integer)
;

create table recorrido (
  id                        integer primary key AUTOINCREMENT,
  ruta_id                   integer)
;

create table ruta (
  id                        integer primary key AUTOINCREMENT,
  origen_id                 integer,
  destino_id                integer,
  constraint uq_ruta_origen_id unique (origen_id),
  constraint uq_ruta_destino_id unique (destino_id))
;

create table servicio (
  id                        integer primary key AUTOINCREMENT,
  nombre                    varchar(255) not null,
  descripcion               varchar(255) not null,
  horario                   varchar(255) not null,
  precio                    float not null,
  telefono                  varchar(255),
  domicilios                integer(1) not null,
  proveedor_id              integer)
;

create table ubicacion (
  id                        integer primary key AUTOINCREMENT,
  nombre                    varchar(255) not null,
  latitud                   float not null,
  longitud                  float not null)
;

create table usuario (
  dtype                     varchar(31) not null,
  id                        integer primary key AUTOINCREMENT,
  nombres                   varchar(255) not null,
  apellidos                 varchar(255) not null,
  correo_electronico        varchar(255) not null,
  contrasenia               varchar(255) not null,
  ciudad                    varchar(255),
  celular                   varchar(255) not null,
  fecha_nacimiento          timestamp not null,
  sexo                      varchar(255) not null,
  nit                       varchar(255) not null,
  nombre_negocio            varchar(255) not null,
  constraint uq_usuario_correo_electronico unique (correo_electronico),
  constraint uq_usuario_ciudad unique (ciudad),
  constraint uq_usuario_celular unique (celular))
;

alter table historico_recorrido add constraint fk_historico_recorrido_usuario_1 foreign key (ciclista_id) references usuario (id);
create index ix_historico_recorrido_usuario_1 on historico_recorrido (ciclista_id);
alter table historico_recorrido add constraint fk_historico_recorrido_recorri_2 foreign key (recorrido_id) references recorrido (id);
create index ix_historico_recorrido_recorri_2 on historico_recorrido (recorrido_id);
alter table recorrido add constraint fk_recorrido_ruta_3 foreign key (ruta_id) references ruta (id);
create index ix_recorrido_ruta_3 on recorrido (ruta_id);
alter table ruta add constraint fk_ruta_origen_4 foreign key (origen_id) references ubicacion (id);
create index ix_ruta_origen_4 on ruta (origen_id);
alter table ruta add constraint fk_ruta_destino_5 foreign key (destino_id) references ubicacion (id);
create index ix_ruta_destino_5 on ruta (destino_id);
alter table servicio add constraint fk_servicio_proveedor_6 foreign key (proveedor_id) references usuario (id);
create index ix_servicio_proveedor_6 on servicio (proveedor_id);



# --- !Downs

PRAGMA foreign_keys = OFF;

drop table categoria;

drop table historico_recorrido;

drop table recorrido;

drop table ruta;

drop table servicio;

drop table ubicacion;

drop table usuario;

PRAGMA foreign_keys = ON;

