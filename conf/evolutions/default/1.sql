--- Created by Ebean DDL
--- To stop Ebean DDL generation, remove this comment and start using Evolutions

--- !Ups

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

create table mensaje (
  id                        integer primary key AUTOINCREMENT,
  fecha_envio               timestamp not null,
  texto                     varchar(255) not null,
  remitente_id              integer,
  destinatario_id           integer)
;

create table recorrido (
  id                        integer primary key AUTOINCREMENT,
  ruta_id                   integer)
;

create table ruta (
  id                        integer primary key AUTOINCREMENT,
  origen_id                 integer,
  destino_id                integer)
;

create table servicio (
  id                        integer primary key AUTOINCREMENT,
  nombre                    varchar(255) not null,
  descripcion               varchar(255) not null,
  horario                   varchar(255) not null,
  precio                    float not null,
  telefono                  varchar(255),
  domicilios                integer(1) not null,
  proveedor_id              integer,
  categoria_id              integer,
  ubicacion_id              integer)
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

-- Sintaxis ALTER TABLE inválida para SQLite
-- alter table historico_recorrido add constraint fk_historico_recorrido_usuario_1 foreign key (ciclista_id) references usuario (id);
create index ix_historico_recorrido_usuario_1 on historico_recorrido (ciclista_id);
-- alter table historico_recorrido add constraint fk_historico_recorrido_recorri_2 foreign key (recorrido_id) references recorrido (id);
create index ix_historico_recorrido_recorri_2 on historico_recorrido (recorrido_id);
-- alter table mensaje add constraint fk_mensaje_remitente_3 foreign key (remitente_id) references usuario (id);
create index ix_mensaje_remitente_3 on mensaje (remitente_id);
-- alter table mensaje add constraint fk_mensaje_destinatario_4 foreign key (destinatario_id) references usuario (id);
create index ix_mensaje_destinatario_4 on mensaje (destinatario_id);
-- alter table recorrido add constraint fk_recorrido_ruta_5 foreign key (ruta_id) references ruta (id);
create index ix_recorrido_ruta_5 on recorrido (ruta_id);
-- alter table ruta add constraint fk_ruta_origen_6 foreign key (origen_id) references ubicacion (id);
create index ix_ruta_origen_6 on ruta (origen_id);
-- alter table ruta add constraint fk_ruta_destino_7 foreign key (destino_id) references ubicacion (id);
create index ix_ruta_destino_7 on ruta (destino_id);
-- alter table servicio add constraint fk_servicio_proveedor_8 foreign key (proveedor_id) references usuario (id);
create index ix_servicio_proveedor_8 on servicio (proveedor_id);
-- alter table servicio add constraint fk_servicio_categoria_9 foreign key (categoria_id) references categoria (id);
create index ix_servicio_categoria_9 on servicio (categoria_id);
-- alter table servicio add constraint fk_servicio_ubicacion_10 foreign key (ubicacion_id) references usuario (id);
create index ix_servicio_ubicacion_10 on servicio (ubicacion_id);



--- !Downs

PRAGMA foreign_keys = OFF;

drop table categoria;

drop table historico_recorrido;

drop table mensaje;

drop table recorrido;

drop table ruta;

drop table servicio;

drop table ubicacion;

drop table usuario;

PRAGMA foreign_keys = ON;

