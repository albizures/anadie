-- phpMyAdmin SQL Dump
-- version 4.1.4
-- http://www.phpmyadmin.net
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-10-2015 a las 20:51:19
-- Versión del servidor: 5.6.15-log
-- Versión de PHP: 5.5.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de datos: `db_anadie_ja`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_del_cat_ambito`( IN pid int )
    DETERMINISTIC
delete from cat_ambito WHERE id = pid$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_del_cat_depto_geo`(IN
piddeptogeo int )
delete from cat_depto_geo where id = piddeptogeo$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_del_cat_ice`( IN pidice int )
delete from cat_ice where id = pidice$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_del_cat_municipio`(IN
pidmunic int )
delete from cat_municipio where id = pidmunic$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_del_cat_organizacion`( in pid int )
delete from cat_organizacion where id = pid$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_del_cat_pais`(IN pidpais int)
delete from cat_pais where id = pidpais$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_del_cat_sector`( IN
pidsector int )
delete from cat_sector where id = pidsector$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_del_pyr_evento`( IN pid INT )
DELETE FROM pyr_evento
 WHERE id = pid$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_del_seg_opcion`(IN pid int)
    MODIFIES SQL DATA
    DETERMINISTIC
begin
    DELETE FROM `seg_opcion`
	   where id = pid;
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_del_seg_opcion_idRol`(in pidrol int, in pidopcion int)
delete from seg_rol_opcion where idrol = pidrol and idopcion = pidopcion$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_del_seg_rol`(pid int)
    MODIFIES SQL DATA
    DETERMINISTIC
begin
	DELETE FROM `seg_rol` where id = pid;
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_del_seg_usuario`(IN pid int)
    MODIFIES SQL DATA
    DETERMINISTIC
begin
    DELETE FROM `seg_usuario`
	   where id = pid;
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_pyr_pregunta_evento`(IN pidevento INT)
    DETERMINISTIC
begin 
   select a.id, a.id_evento, a.id_doc_det, a.id_usuario, a.id_objeto, 
          a.estado, a.fecha_crea, a.pregunta, a2.ambito 
     from pyr_pregunta a, (select  a1.id_pregunta, b1.codigo, b1.nombre as ambito 
	                         from  pyr_pregunta_ambito a1, cat_ambito b1 
							 where a1.id_ambito = b1.id ) as a2 
	 WHERE a.id_evento = pidevento and a.id = a2.id_pregunta 
	 ORDER by a.id;
 end$$
 
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_del_sip_tipo_precalificado`(IN pid int)
    MODIFIES SQL DATA
    DETERMINISTIC
begin
    DELETE FROM `sip_tipo_precalificado` where id = pid;
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ins_seg_opcion_idRol`(in pidrol int, in pidopcion int)
insert into seg_rol_opcion values ( pidrol, pidopcion )$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_cat_ambito`(  )
    DETERMINISTIC
begin
select id, nombre, codigo 
  from cat_ambito 
  ORDER by id;
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_cat_depto_geo`(IN
pidpais int)
select a.id, a.nombre from cat_depto_geo as a where idPais = pidpais
order by a.id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_cat_ice`()
select a.id, a.nombre from cat_ice as a order by a.id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_cat_municipio`(IN
piddepto int)
select a.id, a.nombre from cat_municipio as a where idDepto = piddepto
order by a.id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_cat_organizacion`()
    MODIFIES SQL DATA
    DETERMINISTIC
begin
    SELECT id, nombre FROM `cat_organizacion`;
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_cat_pais`()
select a.id, a.nombre from cat_pais as a order by a.id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_cat_sector`()
select a.id, a.nombre from cat_sector as a order by a.id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_opciones_menu`(IN `pidusuario` INT)
select c.id, c.nombre, c.descripcion, c.titulo, c.idPadre, c2.titulo as Titulo_padre, c.idTipo, b2.nombreTipo, c.orden
  from seg_rol_opcion a, seg_rol b, seg_opcion c LEFT OUTER JOIN seg_opcion as c2 ON c.idPadre = c2.id, seg_usuario d, pg_tipo b2
 where a.idrol = b.id
   and a.idopcion = c.id
   and a.idrol = d.idrol   
   and c.idTipo = b2.id
   and d.id = pidusuario
   order by c.orden$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_pg_estado_usuario`()
    MODIFIES SQL DATA
    DETERMINISTIC
begin
    SELECT * FROM `pg_estado` where tabla_estado = 'seg_usuario' order by orden;
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_pyr_evento`()
select a.id, a.nombre, a.descripcion, a.fecha_inicio, a.fecha_final, a.estado
  from pyr_evento as a order by a.id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_pyr_evento_doc_det`( pidevento int )
    DETERMINISTIC
select id, id_evento, nombre_doc, ubicacion, fecha_carga, usuario_carga 
  from pyr_evento_doc_det 
  where id_evento = pidevento
  order by id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_pyr_evento_doc_detHTML`( pidevento int )
    DETERMINISTIC
select id, id_evento, nombre_doc, ubicacion, fecha_carga, usuario_carga
  from pyr_evento_doc_det
  where id_evento = pidevento and instr(upper(ubicacion),'.mht') > 0
  order by id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_pyr_evento_doc_detID`( piddocdet int )
    DETERMINISTIC
select id, id_evento, nombre_doc, ubicacion, fecha_carga, usuario_carga
  from pyr_evento_doc_det
  where id = piddocdet
  order by id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_pyr_licitacion_precalificados`( IN pidevento int )
    DETERMINISTIC
select a.id, a.id_proyecto_licitacion, a.id_precalificado, b.nombres,
b.apellidos
  from pyr_precalificado_licitacion a INNER JOIN seg_usuario b on
a.id_precalificado = b.id
   WHERE a.id_proyecto_licitacion = pidevento order by a.id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_pyr_licitacion_precalificadosALL`( IN pidevento int )
    DETERMINISTIC
select a.id, a.nombres, a.apellidos
   from seg_usuario a where a.id not in ( select b.id_precalificado
                                         from `pyr_precalificado_licitacion` b
                                         WHERE
b.id_proyecto_licitacion = pidevento )
 ORDER by a.id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_pyr_licitacion_precalificados_ALL`( IN pidevento int )
    DETERMINISTIC
select a.id, a.nombres, a.apellidos
  from seg_usuario a where a.id not in ( select b.id_precalificado
                                         from `pyr_precalificado_licitacion` b
                                         WHERE
                                           b.id_proyecto_licitacion = pidevento )
  ORDER by a.id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_pyr_precalificado_licitacion`( IN pidusuario int )
    DETERMINISTIC
select a.id, a.id_proyecto_licitacion, a.id_precalificado, b.nombre,
    b.fecha_inicio, b.fecha_final, b.estado
  from pyr_precalificado_licitacion a, pyr_evento b
  WHERE a.id_proyecto_licitacion = b.id and a.id_precalificado = pidusuario order by a.id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_pyr_pregunta`( IN pidevento int, IN piddocdet int )
    DETERMINISTIC
begin
    select id, id_evento, id_doc_det, id_usuario, id_objeto, estado,
      fecha_crea, pregunta
    from pyr_pregunta WHERE id_evento = pidevento and id_doc_det = piddocdet
    ORDER by id;
  end$$
  
-- SELECT de todas las preguntas de todos los documentos de un evento

CREATE PROCEDURE sp_sel_pyr_pregunta_evento ( IN pidevento int )
DETERMINISTIC
begin
select a.id, a.id_evento, a.id_doc_det, a.id_usuario, a.id_objeto, a.estado, a.fecha_crea, a.pregunta
  from pyr_pregunta a, (select a1.codigo, a1.nombre as ambito from pyr_pregunta_ambito a1, cat_ambito b1 
                             where a1.id_ambito = b1.id and a.id = a1.id_pregunta  )
							 WHERE a.id_evento = pidevento
  ORDER by a.id;
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_pyr_pregunta_OBJ`( IN piddocdet int, IN
                                              pidClave varchar(20) )
    DETERMINISTIC
begin
    select id, id_evento, id_doc_det, id_usuario, id_objeto, estado,
      fecha_crea, pregunta
    from pyr_pregunta WHERE id_doc_det = piddocdet and id_objeto = pidClave
    ORDER by id;
  end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_rol_opcion`( in prol int )
SELECT a.idrol, a.idopcion, b.nombre as rol,c.titulo ,c.nombre as opcion, c.orden
FROM `seg_rol_opcion` a, seg_rol b, seg_opcion c
  where a.idrol = b.id and a.idopcion = c.id
  and a.idrol = prol
  order by orden$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_seg_opcion`()
begin
select a.`id`, a.`nombre`, a.`descripcion`, a.`titulo`, a.`idPadre`, a.`idTipo`, b.codTipo, b.nombreTipo, a.`orden` 
  FROM `seg_opcion` a, pg_tipo b 
 where a.idTipo = b.id 
 order by a.orden;
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_seg_opcion_hijos`(IN `pidtipo` INT)
    DETERMINISTIC
begin
select a.`id`, a.`nombre`, a.`descripcion`, a.`titulo`, a.`idPadre`, c.titulo as Titulo_padre, a.`idTipo`, b.codTipo, b.nombreTipo, a.`orden` 
  FROM `seg_opcion` a LEFT OUTER JOIN seg_opcion as c on a.idPadre = c.id, pg_tipo b
 where a.idTipo = b.id and a.idTipo = pidtipo 
 order by a.orden;
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_seg_opcion_idRol`(in pidrol int)
SELECT a.idrol, a.idopcion, b.nombre as rol, c.nombre as opcion
   FROM `seg_rol_opcion` a, seg_rol b, seg_opcion c
   where a.idrol = b.id and a.idopcion = c.id and a.idrol = pidrol$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_seg_rol`()
    MODIFIES SQL DATA
    DETERMINISTIC
begin
    SELECT id, nombre FROM `seg_rol`;
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_seg_usuario`( in pusuario varchar(10) )
begin
select a.id, a.nombre, nombres, apellidos, clave, email, fecha, a.idrol, idorganizacion, a.estado as idestado,
b.nombre as rol, c.nombre as organizacion, d.nombre as estado
FROM seg_usuario a, seg_rol b, cat_organizacion c, pg_estado d
where a.idrol = b.id and a.idorganizacion = c.id and a.estado = d.id
and a.estado = fn_estado('seg_usuario','Activo') and pusuario = a.nombre;
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_seg_usuarioId`(in pid int)
    DETERMINISTIC
SELECT a.`id`, a.`nombre`, a.`nombres`, a.`apellidos`, a.`clave`, a.`idrol`, b.nombre as rol,
       a.`idorganizacion`, c.nombre as organizacion, a.`estado`, 
       d.nombre as nombreEstado, a.`email`, a.`fecha` 
 FROM `seg_usuario` a, seg_rol b, cat_organizacion c, pg_estado d
 WHERE a.idrol = b.id and a.idorganizacion = c.id and a.estado = d.id and d.tabla_estado = 'seg_usuario' and a.id = pid$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_seg_usuarios`()
    DETERMINISTIC
SELECT a.`id`, a.`nombre`, a.`cargo`,a.`nombres`, a.`apellidos`, a.`idrol`, b.nombre as rol,
       a.`idorganizacion`, c.nombre as organizacion, a.`estado`, 
       d.nombre as nombreEstado, a.`email`, a.`fecha` 
 FROM `seg_usuario` a, seg_rol b, cat_organizacion c, pg_estado d
 WHERE a.idrol = b.id and a.idorganizacion = c.id and a.estado = d.id and a.estado = fn_estado('seg_usuario','Activo')$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_seg_usuario_clave`(IN `pusuario` VARCHAR(10), IN `pclave` VARCHAR(10))
    NO SQL
begin
select id, nombre, nombres, apellidos, clave, idrol, idorganizacion, estado
  from seg_usuario 
  where nombre = pusuario and clave = pclave and estado = fn_estado('seg_usuario','Activo');
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_sip_proyecto`( )
    DETERMINISTIC
SELECT id, id_sector       , prestaciones    , nombre          , id_ice          , objetivo        , id_pais,
           id_depto        , id_munic        , monto_pre_aprox , fecha_present_p , dictamen_tec_ref, dictamen_tec_fec,
		   dictamen_tec_doc, dictamen_leg_ref, dictamen_leg_fec, dictamen_leg_doc, res_dir_eje_ref , res_dir_eje_fec , 
		   res_dir_eje_doc ,res_conadie_ref , res_conadie_fec , res_conadie_doc
FROM sip_proyecto ORDER BY id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_tipo_opcion`()
    DETERMINISTIC
select id, codTipo, nombreTipo 
  from pg_tipo where tablaTipo = 'seg_opcion' and estado = 1
  order by orden$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sel_sip_tipo_precalificado`()
    DETERMINISTIC
select id, precalificado from sip_tipo_precalificado order by id$$
  
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_upd_proyecto_archivo`(IN `pid` INT, IN `pfield_name` VARCHAR(50),
IN `ptarget_file` VARCHAR(50),
                       IN pref varchar(10), IN pfec varchar(10) )
    MODIFIES SQL DATA
    DETERMINISTIC
BEGIN
if pfield_name = 'dictamen_leg_doc' then
   update sip_proyecto
      set dictamen_leg_doc = ptarget_file,
     dictamen_leg_ref = pref,
 dictamen_leg_fec = pfec
      where id = pid;
else
   if pfield_name = 'dictamen_tec_doc' then
      update sip_proyecto
         set dictamen_tec_doc = ptarget_file,
     dictamen_tec_ref = pref,
 dictamen_tec_fec = pfec
         where id = pid;
   else
      if pfield_name = 'res_dir_eje_doc' then
         update sip_proyecto
          set res_dir_eje_doc = ptarget_file,
     res_dir_eje_ref = pref,
 res_dir_eje_fec = pfec
          where id = pid;
      else
          if pfield_name = 'res_conadie_doc' then
             update sip_proyecto
             set res_conadie_doc = ptarget_file,
 res_conadie_ref = pref,
 res_conadie_fec = pfec
             where id = pid;
          end if;
      end if;
   end if;
end if;
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_upd_pyr_evento`( IN
pid INT, IN pnombre varchar(200), IN pdescripcion varchar(500),
                                                                 IN
pfecha_inicio date, IN pfecha_final date, IN pestado int )
UPDATE pyr_evento
   SET nombre = pnombre, descripcion = pdescripcion, fecha_inicio =
pfecha_inicio, fecha_final = pfecha_final, estado = pestado 
 WHERE id = pid$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_upd_seg_opcion`(IN pid int, IN pnombre varchar(100), IN pdescripcion VARCHAR(200), IN ptitulo varchar(30), 
              IN pidpadre int, IN pidtipo int, IN porden int)
    MODIFIES SQL DATA
    DETERMINISTIC
begin
    UPDATE `seg_opcion`
	   SET  `nombre` = pnombre, `descripcion` = pdescripcion, `titulo` = ptitulo, `idPadre` = pidpadre, `idTipo` = pidtipo, `orden` = porden 
	   where id = pid;
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_upd_seg_rol`(pid int, `pnombre` varchar(30))
    MODIFIES SQL DATA
    DETERMINISTIC
begin
	UPDATE `seg_rol` set nombre = pnombre where id = pid;
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_upd_seg_usuario`(IN pid int, IN pnombre varchar(10), IN pnombres VARCHAR(50), IN papellidos varchar(50),
IN pidrol int, IN pidorganizacion int, IN pestado int, IN pemail varchar(50), IN pcargo varchar(100) )
    MODIFIES SQL DATA
    DETERMINISTIC
begin
UPDATE seg_usuario
SET nombre = pnombre, nombres = pnombres, apellidos = papellidos, idrol = pidrol, idorganizacion = pidorganizacion,
estado = pestado, email = pemail, cargo = pcargo
where id = pid;
end$$



--
-- Funciones
--
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_estado`( ptabla varchar(30), pestado varchar(30) ) RETURNS int(11)
    DETERMINISTIC
begin
  declare vRet int;
  select codEstado into vRet from pg_estado where tabla_estado = ptabla and nombre = pestado and estado = 1;
  return vRet;
end$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_ins_cat_ambito`( pnombre varchar(50), pcodigo char(1) ) RETURNS int(11)
    DETERMINISTIC
begin
  insert into cat_ambito ( nombre, codigo ) values ( pnombre, pcodigo );
  return last_insert_id();
end$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_ins_cat_depto_geo`(
pidpais int, pnombre varchar(50) ) RETURNS int(11)
    MODIFIES SQL DATA
    DETERMINISTIC
begin
insert into cat_depto_geo ( idPais, nombre ) values ( pidpais, pnombre );
return last_insert_id();
end$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_ins_cat_ice`( pnombre
varchar(100) ) RETURNS int(11)
    MODIFIES SQL DATA
    DETERMINISTIC
begin
insert into cat_ice ( nombre ) values ( pnombre );
return last_insert_id();
end$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_ins_cat_municipio`(
piddepto int, pnombre varchar(50) ) RETURNS int(11)
    MODIFIES SQL DATA
    DETERMINISTIC
begin
insert into cat_municipio (idDepto, nombre) values (piddepto, pnombre);
return last_insert_id();
end$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_ins_cat_organizacion`( pnombre varchar(50) ) RETURNS int(11)
    DETERMINISTIC
begin
insert into cat_organizacion values ( pnombre );
return last_insert_id();
end$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_ins_cat_pais`(`ppais` VARCHAR(50)) RETURNS int(11)
    MODIFIES SQL DATA
    DETERMINISTIC
begin
insert into cat_pais ( nombre ) values ( ppais );
return last_insert_id();
end$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_ins_cat_sector`(
pnombre varchar( 50 ) ) RETURNS int(11)
    MODIFIES SQL DATA
    DETERMINISTIC
begin
insert into cat_sector (nombre) values (pnombre);
return last_insert_id();
end$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_ins_pyr_evento`(
pnombre varchar(200), pdescripcion varchar(500), pfecha_inicio
date, pfecha_final date ) RETURNS int(11)
    DETERMINISTIC
begin
insert into pyr_evento ( nombre, descripcion, fecha_inicio,
fecha_final, estado )
   values ( pnombre, pdescripcion, pfecha_inicio, pfecha_final, 1 );
return last_insert_id();
end$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_ins_pyr_evento_doc_det`( pidevento int, pnombre_doc varchar(100), pubicacion varchar(200), pidusuario int   ) RETURNS int(11)
    DETERMINISTIC
begin
insert into pyr_evento_doc_det ( id_evento, nombre_doc, ubicacion, fecha_carga, usuario_carga )
  values ( pidevento, pnombre_doc, pubicacion, now(), pidusuario );
return last_insert_id();
end$$


CREATE DEFINER=`root`@`localhost` FUNCTION `fn_ins_pyr_precalificado_licitacion`(piduser int, pidevento int) RETURNS int(11)
    DETERMINISTIC
begin
insert into pyr_precalificado_licitacion ( id_precalificado, id_proyecto_licitacion ) values ( piduser, pidevento );
return last_insert_id();
end$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_ins_pyr_organizacion_licitacion`(pidorganizacion int, pidevento int) RETURNS int(11)
    DETERMINISTIC
begin
insert into pyr_precalificado_licitacion ( id_precalificado, id_proyecto_licitacion ) 
   select id, pidevento from seg_usuario where idorganizacion = pidorganizacion
return last_insert_id();
end$$


CREATE DEFINER=`root`@`localhost` FUNCTION `fn_ins_pyr_pregunta`( pidevento int, piddocdet int, pidusuario int, pidobjeto varchar(14),
                                              ppregunta varchar(500), pestado int ) RETURNS int(11)
    DETERMINISTIC
begin
insert into pyr_pregunta ( id_evento, id_doc_det, id_usuario, id_objeto, id_pregunta, estado, fecha_crea )
  values ( pidevento, piddocdet, pidusuario, pidobjeto, ppregunta, pestado, now() );
return last_insert_id();
end$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_ins_pyr_pregunta0`( 
                          pidClave varchar(20), 
                          pidtipo varchar(3), 
                          pidevento int, 
                          piddocdet int,
                          pidusuario int, 
                          ppregunta varchar(500) ) RETURNS int(11)
    DETERMINISTIC
begin
    insert into pyr_objeto ( id, id_tipo, id_usuario ) values (
      pidClave, pidtipo, pidusuario );
    insert into pyr_pregunta ( id_evento, id_doc_det, id_usuario,
                               id_objeto, pregunta, estado, fecha_crea,id_usuario_modifica )
    values ( pidevento, piddocdet, pidusuario, pidClave, ppregunta, 1, now() ,id_usuario);

    return last_insert_id();
  end$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_ins_pyr_pregunta1`( pidClave varchar(20), pidevento
                                                int, piddocdet int,
  pidusuario int, ppregunta
                                                varchar(500) ) RETURNS int(11)
    DETERMINISTIC
begin
    insert into pyr_pregunta ( id_evento, id_doc_det, id_usuario,
                               id_objeto, pregunta, estado, fecha_crea )
    values ( pidevento, piddocdet, pidusuario, pidClave, ppregunta, 1, now() );

    return last_insert_id();
  end$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_ins_pyr_pregunta_ambito`( pidpregunta int, pidambito int ) RETURNS int(11)
    DETERMINISTIC
begin
	insert into pyr_pregunta_ambito ( id_pregunta, id_ambito ) values (pidpregunta, pidambito );
	return last_insert_id();
end$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_ins_seg_opcion`(`pnombre` varchar(100), `pdescripcion` VARCHAR(200), `ptitulo` varchar(30), 
              pidpadre int, pidtipo int, porden int) RETURNS int(11)
    MODIFIES SQL DATA
    DETERMINISTIC
begin
	INSERT INTO `seg_opcion`( `nombre`, `descripcion`, `titulo`, `idPadre`, `idTipo`, `orden`) 
	VALUES (pnombre, pdescripcion, ptitulo, pidpadre, pidtipo, porden);
	return last_insert_id(); 
end$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_ins_seg_rol`(`pnombre` varchar(100)) RETURNS int(11)
    MODIFIES SQL DATA
    DETERMINISTIC
begin
	INSERT INTO `seg_rol`( `nombre`)  VALUES (pnombre);
	return last_insert_id(); 
end$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_ins_seg_usuario`(pnombre varchar(10), pnombres VARCHAR(50), papellidos varchar(50),
pclave varchar(200), pidrol int, pidorganizacion int, pestado int, pemail varchar(50), pcargo varchar(100) ) RETURNS int(11)
    MODIFIES SQL DATA
    DETERMINISTIC
begin
INSERT INTO seg_usuario( nombre, nombres, apellidos, clave, idrol, idorganizacion, estado, email, fecha, cargo)
VALUES (pnombre, pnombres, papellidos, pclave, pidrol, pidorganizacion, pestado, pemail, now(), pcargo);
return last_insert_id();
end$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_ins_sip_proyecto`(   pidsector int                ,
                                       pprestaciones varchar(200)  ,  pnombre varchar(200)  ,
                                       pidice int                   ,  pobjetivo varchar(500)      ,
                                       pidpais int           ,
                                       piddepto int                 ,  pidmunic int
  ,  pmontopreaprox int    ,
                                       pfechapresentp date          ,  pdictamentecref  varchar(10),
                                       pdictamentecfec date  ,
                                       pdictamentecdoc varchar(200) ,  pdictamenlegref  varchar(10),
                                       pdictamenlegfec date  ,
                                       pdictamenlegdoc varchar(200) ,  presdirejeref  varchar(10)  ,
                                       presdirejefec  date   ,
                                       presdirejedoc    varchar(200),  presconadieref  varchar(10) ,
                                       presconadiefec  date  ,
                                       presconadiedoc   varchar(200) ) RETURNS int(11)
    MODIFIES SQL DATA
    DETERMINISTIC
BEGIN
    INSERT INTO sip_proyecto ( id_sector       , prestaciones    , nombre
      , id_ice          , objetivo        , id_pais,
                               id_depto        , id_munic        ,
                               monto_pre_aprox , fecha_present_p , dictamen_tec_ref,
                               dictamen_tec_fec,
                               dictamen_tec_doc, dictamen_leg_ref, dictamen_leg_fec,
                               dictamen_leg_doc, res_dir_eje_ref , res_dir_eje_fec ,
                               res_dir_eje_doc ,res_conadie_ref , res_conadie_fec , res_conadie_doc )
    values ( pidsector     , pprestaciones , pnombre        , pidice
      , pobjetivo      , pidpais        , piddepto       , pidmunic,
             pmontopreaprox, pfechapresentp, pdictamentecref,
             pdictamentecfec, pdictamentecdoc, pdictamenlegref, pdictamenlegfec,
             pdictamenlegdoc,
             presdirejeref , presdirejefec , presdirejedoc  , presconadieref ,
             presconadiefec , presconadiedoc );
    RETURN last_insert_id();
  END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_tipo`( ptabla varchar(30), ptipo varchar(30) ) RETURNS int(11)
    DETERMINISTIC
begin
  declare vRet int;
  select codTipo into vRet from pg_tipo where tabla_tipo = ptabla and nombre = ptipo and estado = 1;
  return vRet;
end$$

-- Para ingresar un registro de sip_tipo_precalificado 
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_sip_tipo_precalificado`( pprecalificado varchar(100) ) RETURNS int(11)
    DETERMINISTIC
begin
  insert into sip_tipo_precalificado ( precalificado ) values ( pprecalificado );
  return last_insert_id();
end$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cat_ambito`
--

CREATE TABLE IF NOT EXISTS `cat_ambito` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `codigo` char(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=22 ;

--
-- Volcado de datos para la tabla `cat_ambito`
--

INSERT INTO `cat_ambito` (`id`, `nombre`, `codigo`) VALUES
(1, 'Legal', 'L'),
(21, 'Técnico', 'T');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cat_depto_geo`
--

CREATE TABLE IF NOT EXISTS `cat_depto_geo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT NULL,
  `idPais` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=14 ;

--
-- Volcado de datos para la tabla `cat_depto_geo`
--

INSERT INTO `cat_depto_geo` (`id`, `nombre`, `idPais`) VALUES
(1, 'guatemala', 1),
(2, 'lel', 2),
(3, 'otroa2', 2),
(4, 'lel2', 2),
(5, 'aaaaa2', 2),
(6, 'aaaaa3', 2),
(7, 'chile1', 4),
(13, 'prueba', 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cat_documento`
--

CREATE TABLE IF NOT EXISTS `cat_documento` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cat_entidad`
--

CREATE TABLE IF NOT EXISTS `cat_entidad` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idTipoEntidad` int(11) NOT NULL,
  `entidad` varchar(50) DEFAULT NULL,
  `estado` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cat_especialidad`
--

CREATE TABLE IF NOT EXISTS `cat_especialidad` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cat_gradoacademico`
--

CREATE TABLE IF NOT EXISTS `cat_gradoacademico` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cat_ice`
--

CREATE TABLE IF NOT EXISTS `cat_ice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=14 ;

--
-- Volcado de datos para la tabla `cat_ice`
--

INSERT INTO `cat_ice` (`id`, `nombre`) VALUES
(1, 'test'),
(5, 'test'),
(7, 'yei'),
(11, 'year'),
(12, 'oye'),
(13, 'aaaaa');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cat_municipio`
--

CREATE TABLE IF NOT EXISTS `cat_municipio` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT NULL,
  `idDepto` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;

--
-- Volcado de datos para la tabla `cat_municipio`
--

INSERT INTO `cat_municipio` (`id`, `nombre`, `idDepto`) VALUES
(1, 'guatemala', 1),
(2, 'nuevo monuo', 5),
(3, 'espana1.1', 8),
(4, 'espana1.2', 8),
(5, 'espana2.1', 9),
(8, 'rtrtrtrtrtrt', 12);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cat_nacionalidad`
--

CREATE TABLE IF NOT EXISTS `cat_nacionalidad` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `idPais` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cat_organizacion`
--

CREATE TABLE IF NOT EXISTS `cat_organizacion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Volcado de datos para la tabla `cat_organizacion`
--

INSERT INTO `cat_organizacion` (`id`, `nombre`) VALUES
(1, 'Desarrollo de Sistemas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cat_organo`
--

CREATE TABLE IF NOT EXISTS `cat_organo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cat_pais`
--

CREATE TABLE IF NOT EXISTS `cat_pais` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=13 ;

--
-- Volcado de datos para la tabla `cat_pais`
--

INSERT INTO `cat_pais` (`id`, `nombre`) VALUES
(12, 'nuevo'),
(1, 'guatemala'),
(6, 'Italia'),
(8, 'Suiza');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cat_participante`
--

CREATE TABLE IF NOT EXISTS `cat_participante` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cat_profesion`
--

CREATE TABLE IF NOT EXISTS `cat_profesion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cat_sector`
--

CREATE TABLE IF NOT EXISTS `cat_sector` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Volcado de datos para la tabla `cat_sector`
--

INSERT INTO `cat_sector` (`id`, `nombre`) VALUES
(1, 'test'),
(2, 'salud');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cat_tipobase`
--

CREATE TABLE IF NOT EXISTS `cat_tipobase` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cat_tipoentidad`
--

CREATE TABLE IF NOT EXISTS `cat_tipoentidad` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cat_titulo`
--

CREATE TABLE IF NOT EXISTS `cat_titulo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cat_universidad`
--

CREATE TABLE IF NOT EXISTS `cat_universidad` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `id_resapro`
--

CREATE TABLE IF NOT EXISTS `id_resapro` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `resolucion` bit(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pg_estado`
--

CREATE TABLE IF NOT EXISTS `pg_estado` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `codEstado` int(11) NOT NULL,
  `tabla_estado` varchar(30) DEFAULT NULL COMMENT 'Nombre de la tabla a la cual hace referencia la secuencia de estados.',
  `orden` int(11) DEFAULT NULL COMMENT 'Posición (orden) del estado dentro de los estados de una tabla.',
  `nombre` varchar(30) DEFAULT NULL,
  `estado` int(11) DEFAULT NULL COMMENT '1 - Activo\n2 - Inactivo',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Volcado de datos para la tabla `pg_estado`
--

INSERT INTO `pg_estado` (`id`, `codEstado`, `tabla_estado`, `orden`, `nombre`, `estado`) VALUES
(1, 1, 'seg_usuario', 1, 'Activo', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pg_tipo`
--

CREATE TABLE IF NOT EXISTS `pg_tipo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codTipo` int(11) NOT NULL,
  `tablaTipo` varchar(30) NOT NULL,
  `orden` int(11) NOT NULL,
  `nombreTipo` varchar(30) NOT NULL,
  `estado` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Volcado de datos para la tabla `pg_tipo`
--

INSERT INTO `pg_tipo` (`id`, `codTipo`, `tablaTipo`, `orden`, `nombreTipo`, `estado`) VALUES
(1, 1, 'seg_opcion', 1, 'Menu', 1),
(2, 2, 'seg_opcion', 2, 'SubMenu ', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pyr_consultor`
--

CREATE TABLE IF NOT EXISTS `pyr_consultor` (
  `id_consultor` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_evento` int(11) NOT NULL,
  PRIMARY KEY (`id_consultor`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pyr_consultor_asignado`
--

CREATE TABLE IF NOT EXISTS `pyr_consultor_asignado` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_consultor` int(11) NOT NULL,
  `id_cat_pregunta` int(11) NOT NULL,
  `fecha_asignado` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pyr_consultor_respuesta`
--

CREATE TABLE IF NOT EXISTS `pyr_consultor_respuesta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_consultor` int(11) NOT NULL,
  `id_pregunta` int(11) NOT NULL,
  `fecha` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pyr_evento`
--

CREATE TABLE IF NOT EXISTS `pyr_evento` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) DEFAULT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_final` date DEFAULT NULL,
  `estado` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Volcado de datos para la tabla `pyr_evento`
--

INSERT INTO `pyr_evento` (`id`, `nombre`, `descripcion`, `fecha_inicio`, `fecha_final`, `estado`) VALUES
(1, 'EVENTO', 'SASDFADF', '2015-09-30', '2015-09-30', 1),
(2, 'otro', 'otro', '2015-09-30', '2015-09-30', 1),
(3, 'Nueva', 'Nueva', '2015-10-12', '2015-10-25', 1),
(4, 'ada', 'adasfd', '2015-10-15', '2015-10-29', 1),
(5, 'ggggg', 'ggggg', '2015-10-15', '2015-10-31', 1),
(6, 'Ejemplo CAE', 'Ejemplo de licitacion para CAE', '2015-10-13', '2015-12-20', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pyr_evento_doc_det`
--

CREATE TABLE IF NOT EXISTS `pyr_evento_doc_det` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_evento` int(11) NOT NULL,
  `nombre_doc` varchar(100) NOT NULL,
  `ubicacion` varchar(100) NOT NULL,
  `fecha_carga` date NOT NULL,
  `usuario_carga` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=46 ;

--
-- Volcado de datos para la tabla `pyr_evento_doc_det`
--

INSERT INTO `pyr_evento_doc_det` (`id`, `id_evento`, `nombre_doc`, `ubicacion`, `fecha_carga`, `usuario_carga`) VALUES
(30, 1, 'prueba6', '/server/uploaded_files/1_prueba6.pdf', '2015-10-12', 1),
(31, 1, 'prueba6', '/server/uploaded_files/1_prueba6.html', '2015-10-12', 1),
(32, 1, 'prueba7', '/server/uploaded_files/prueba7', '2015-10-13', 7),
(33, 1, 'prueba7', '/server/uploaded_files/prueba7', '2015-10-13', 7),
(34, 1, 'prueba8', '/server/uploaded_files/Anexos de BL_CAE 180915_V1.pdf', '2015-10-13', 7),
(35, 1, 'prueba8', '/server/uploaded_files/Anexos de BL_CAE 180915_V1.mht', '2015-10-13', 7),
(36, 1, 'aaaa', '/server/uploaded_files/Anexos de BL_CAE 180915_V1.pdf', '2015-10-14', 7),
(37, 1, 'aaaa', '/server/uploaded_files/Anexos de BL_CAE 180915_V1.mht', '2015-10-14', 7),
(38, 2, 'lol', '/server/uploaded_files/Anexos de BL_CAE 180915_V1.pdf', '2015-10-14', 7),
(39, 2, 'lol', '/server/uploaded_files/Anexos de BL_CAE 180915_V1.mht', '2015-10-14', 7),
(40, 3, 'ddd', '/server/uploaded_files/Anexos de BL_CAE 180915_V1 - Copy - Copy.pdf', '2015-10-15', 7),
(41, 3, 'ddd', '/server/uploaded_files/Anexos de BL_CAE 180915_V1 - Copy - Copy.mht', '2015-10-15', 7),
(42, 4, 'lelel', '/server/uploaded_files/Anexos de BL_CAE 180915_V1 - Copy.pdf', '2015-10-15', 7),
(43, 4, 'lelel', '/server/uploaded_files/Anexos de BL_CAE 180915_V1 - Copy.mht', '2015-10-15', 7),
(44, 5, 'nombre', '/server/uploaded_files/Anexos de BL_CAE 180915_V1 - Copy - Copy - Copy.pdf', '2015-10-15', 7),
(45, 5, 'nombre', '/server/uploaded_files/Anexos de BL_CAE 180915_V1 - Copy - Copy - Copy.mht', '2015-10-15', 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pyr_objeto`
--

CREATE TABLE IF NOT EXISTS `pyr_objeto` (
  `id` varchar(20) NOT NULL,
  `id_tipo` varchar(3) NOT NULL,
  `fecha` timestamp NULL DEFAULT NULL,
  `id_usuario` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `pyr_objeto`
--

INSERT INTO `pyr_objeto` (`id`, `id_tipo`, `fecha`, `id_usuario`) VALUES
('IMG1444890725716', 'IMG', NULL, 7),
('P-1444885139755', 'P', NULL, 7),
('P-1444889259019', 'P', NULL, 7),
('P-1444889358466', 'P', NULL, 7),
('P-1444889395079', 'P', NULL, 7),
('P-1444889554673', 'P', NULL, 7),
('P-1444890540209', 'IMG', NULL, 7),
('P-1444890606972', 'P', NULL, 7),
('P-1444890916374', 'P', NULL, 7),
('P-1444891223995', 'P', NULL, 7),
('P-1444892089349', 'P', NULL, 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pyr_precalificado_licitacion`
--

CREATE TABLE IF NOT EXISTS `pyr_precalificado_licitacion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_proyecto_licitacion` int(11) NOT NULL,
  `id_precalificado` int(11) NOT NULL,
  `NOG` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=20 ;

--
-- Volcado de datos para la tabla `pyr_precalificado_licitacion`
--

INSERT INTO `pyr_precalificado_licitacion` (`id`, `id_proyecto_licitacion`, `id_precalificado`, `NOG`) VALUES
(1, 1, 3, NULL),
(2, 1, 4, NULL),
(3, 1, 6, NULL),
(4, 2, 3, NULL),
(5, 2, 7, NULL),
(6, 1, 7, NULL),
(7, 1, 9, NULL),
(8, 2, 6, NULL),
(9, 2, 9, NULL),
(10, 2, 8, NULL),
(11, 2, 11, NULL),
(12, 3, 3, NULL),
(13, 3, 11, NULL),
(14, 3, 4, NULL),
(15, 2, 4, NULL),
(16, 3, 10, NULL),
(17, 3, 7, NULL),
(18, 5, 7, NULL),
(19, 1, 12, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pyr_pregunta`
--

CREATE TABLE IF NOT EXISTS `pyr_pregunta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_evento` int(11) NOT NULL,
  `id_doc_det` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_objeto` varchar(20) DEFAULT NULL,
  `fecha_crea` datetime DEFAULT NULL,
  `id_usuario_modifica` int(11) DEFAULT NULL,
  `fecha_modif` datetime DEFAULT NULL,
  `pregunta` varchar(500) NOT NULL,
  `respuesta` varchar(500) DEFAULT NULL,
  `estado` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=46 ;

--
-- Volcado de datos para la tabla `pyr_pregunta`
--

INSERT INTO `pyr_pregunta` (`id`, `id_evento`, `id_doc_det`, `id_usuario`, `id_objeto`, `fecha_crea`, `id_usuario_modifica`, `fecha_modif`, `pregunta`, `respuesta`, `estado`) VALUES
(22, 1, 35, 7, 'P-1444885139755', '2015-10-15 00:04:31', NULL, NULL, 'primear digo yo', NULL, 1),
(23, 1, 35, 7, 'P-1444885139755', '2015-10-15 00:04:56', NULL, NULL, 'esgunda', NULL, 1),
(24, 1, 35, 7, 'P-1444885139755', '2015-10-15 00:06:12', NULL, NULL, 'tercera', NULL, 1),
(25, 1, 35, 7, 'P-1444885139755', '2015-10-15 00:06:20', NULL, NULL, 'cuarta', NULL, 1),
(26, 1, 35, 7, 'P-1444885139755', '2015-10-15 00:06:27', NULL, NULL, 'lelele\n\nelelel\ne\ne\ne\ne', NULL, 1),
(27, 1, 35, 7, 'P-1444889259019', '2015-10-15 00:07:39', 7, NULL, 'primera pregunta', NULL, 1),
(28, 1, 35, 7, 'P-1444889358466', '2015-10-15 00:09:18', 7, NULL, 'que es republica', NULL, 1),
(29, 1, 35, 7, 'P-1444889358466', '2015-10-15 00:09:36', NULL, NULL, 'guatemala?', NULL, 1),
(30, 1, 35, 7, 'P-1444889395079', '2015-10-15 00:09:55', 7, NULL, 'diseo?', NULL, 1),
(31, 1, 35, 7, 'P-1444889554673', '2015-10-15 00:12:34', 7, NULL, 'declaracion', NULL, 1),
(32, 1, 35, 7, 'P-1444889554673', '2015-10-15 00:12:41', NULL, NULL, 'otra vez', NULL, 1),
(33, 1, 35, 7, 'P-1444889554673', '2015-10-15 00:12:46', NULL, NULL, 'de nuevo', NULL, 1),
(34, 1, 35, 7, 'P-1444890540209', '2015-10-15 00:29:00', 7, NULL, 'PRUEA img', NULL, 1),
(35, 1, 35, 7, 'P-1444890606972', '2015-10-15 00:30:07', 7, NULL, 'tipo', NULL, 1),
(36, 1, 35, 7, 'IMG1444890725716', '2015-10-15 00:32:05', 7, NULL, 'prueba img', NULL, 1),
(37, 2, 39, 7, 'P-1444890540209', '2015-10-15 00:34:53', NULL, NULL, 'priemero img', NULL, 1),
(38, 2, 39, 7, 'P-1444890540209', '2015-10-15 00:35:05', NULL, NULL, 'otor', NULL, 1),
(39, 2, 39, 7, 'P-1444890916374', '2015-10-15 00:35:16', 7, NULL, 'otro', NULL, 1),
(40, 2, 39, 7, 'P-1444890916374', '2015-10-15 00:35:23', NULL, NULL, 'yea', NULL, 1),
(41, 2, 39, 7, 'IMG1444890725716', '2015-10-15 00:35:42', NULL, NULL, 'nuevo', NULL, 1),
(42, 3, 41, 7, 'P-1444891223995', '2015-10-15 00:40:24', 7, NULL, 'quitar', NULL, 1),
(43, 3, 41, 7, 'P-1444892089349', '2015-10-15 00:54:49', 7, NULL, 'hahaha lele<div>d</div><div>saf</div><div>sd</div><div>a</div><div>dfa</div><div>&lt;strong&gt;en tros estron&lt;/strong&gt;</div>', NULL, 1),
(44, 2, 39, 7, 'P-1444889259019', '2015-10-15 07:42:50', NULL, NULL, 'jjjjjj<div>lklk</div><div>llñl</div><div>hh</div>', NULL, 1),
(45, 2, 39, 7, 'P-1444889259019', '2015-10-15 07:43:00', NULL, NULL, 'yyyy', NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pyr_pregunta_detalle`
--

CREATE TABLE IF NOT EXISTS `pyr_pregunta_detalle` (
  `id_pregunta` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pyr_proceso`
--

CREATE TABLE IF NOT EXISTS `pyr_proceso` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_final` date NOT NULL,
  `estado` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pyr_quien_pregunta`
--

CREATE TABLE IF NOT EXISTS `pyr_quien_pregunta` (
  `id_quienpregunta` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_evento` int(11) NOT NULL,
  PRIMARY KEY (`id_quienpregunta`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seg_opcion`
--

CREATE TABLE IF NOT EXISTS `seg_opcion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `titulo` varchar(30) DEFAULT NULL,
  `idPadre` int(11) DEFAULT NULL,
  `idTipo` int(11) DEFAULT NULL,
  `orden` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=38 ;

--
-- Volcado de datos para la tabla `seg_opcion`
--

INSERT INTO `seg_opcion` (`id`, `nombre`, `descripcion`, `titulo`, `idPadre`, `idTipo`, `orden`) VALUES
(1, 'Administracion', 'Administración del sistema', 'Administracion', 0, 1, 1),
(2, 'Registros', 'Sistema de Registro', 'Registro', 27, 2, 2),
(3, 'Preguntas y Respuestasww', 'Sistema de Preguntas y Respuestas', 'Preguntas y Respuestas', 0, 1, 3),
(23, 'Usuarios', 'Usuarios', 'Usuarios', 1, 2, 2),
(15, 'Opciones', 'Opciones', 'Opciones', 1, 2, 1),
(27, 'SIREPP', 'SIREPP', 'SIREPP', 0, 1, 3),
(28, 'Proyecto', 'Proyecto', 'Proyecto', 27, 1, 1),
(24, 'Roles', 'Roles', 'Roles', 1, 2, 0),
(29, 'Inscripcion', 'Inscripcion', 'Inscripcion', 28, 2, 2),
(30, 'Ubicaciones', 'paises, departamentos,municipios', 'Ubicaciones', 1, 2, 5),
(31, 'Licitaciones', 'Eventos de Licitacion', 'Licitaciones', 36, 2, 6),
(32, 'ICEs', 'ICEs', 'ICEs', 27, 2, 6),
(33, 'Sectores', 'Sectores', 'Sectores', 27, 2, 7),
(34, 'precalificacion', 'precalificacion', 'precalificacion', 36, 2, 7),
(35, 'consulta', 'consulta', 'Consulta', 36, 2, 8),
(36, 'siprel', 'Sistema de Preguntas de Licitacion', '-- SIPREL --', 0, 1, 4),
(37, 'ambitos', 'Ambitos en los que se divide las especializaciones de los consultores', 'Ambitos', 36, 2, 9);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seg_rol`
--

CREATE TABLE IF NOT EXISTS `seg_rol` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=21 ;

--
-- Volcado de datos para la tabla `seg_rol`
--

INSERT INTO `seg_rol` (`id`, `nombre`) VALUES
(1, 'Administrador general');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seg_rol_opcion`
--

CREATE TABLE IF NOT EXISTS `seg_rol_opcion` (
  `idrol` int(11) NOT NULL DEFAULT '0',
  `idopcion` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`idrol`,`idopcion`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `seg_rol_opcion`
--

INSERT INTO `seg_rol_opcion` (`idrol`, `idopcion`) VALUES
(1, 1),
(1, 2),
(1, 15),
(1, 23),
(1, 24),
(1, 26),
(1, 27),
(1, 28),
(1, 29),
(1, 30),
(1, 31),
(1, 32),
(1, 33),
(1, 34),
(1, 35),
(1, 36),
(1, 37),
(5, 24),
(20, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seg_user_logging`
--

CREATE TABLE IF NOT EXISTS `seg_user_logging` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `session_id` int(11) NOT NULL,
  `idusuario` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `action` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=13 ;

--
-- Volcado de datos para la tabla `seg_user_logging`
--

INSERT INTO `seg_user_logging` (`id`, `session_id`, `idusuario`, `fecha`, `action`) VALUES
(1, 0, 1, '2015-07-03 00:00:00', 'login'),
(2, 0, 1, '2015-07-03 00:00:00', 'login'),
(3, 0, 1, '2015-07-03 00:00:00', 'login'),
(4, 0, 1, '2015-07-03 20:15:40', 'login'),
(5, 0, 1, '2015-07-03 20:17:43', 'login'),
(6, 0, 1, '0000-00-00 00:00:00', 'login'),
(7, 0, 1, '0000-00-00 00:00:00', 'login'),
(8, 0, 1, '2015-07-03 20:29:05', 'login'),
(9, 0, 1, '0000-00-00 00:00:00', 'login'),
(10, 0, 1, '0000-00-00 00:00:00', 'login'),
(11, 0, 1, '2015-07-03 20:36:59', 'login'),
(12, 0, 1, '2015-07-03 20:43:57', 'login');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seg_usuario`
--

CREATE TABLE IF NOT EXISTS `seg_usuario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(10) DEFAULT NULL,
  `nombres` varchar(50) DEFAULT NULL,
  `apellidos` varchar(50) DEFAULT NULL,
  `clave` varchar(200) DEFAULT NULL,
  `idrol` int(11) DEFAULT NULL,
  `idorganizacion` int(11) DEFAULT NULL,
  `estado` int(11) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `fecha` datetime NOT NULL,
  `cargo` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=13 ;

--
-- Volcado de datos para la tabla `seg_usuario`
--

INSERT INTO `seg_usuario` (`id`, `nombre`, `nombres`, `apellidos`, `clave`, `idrol`, `idorganizacion`, `estado`, `email`, `fecha`, `cargo`) VALUES
(12, 'lalbizures', 'Luis', 'Albizures', '$2a$10$0ddd4377d7aa686c71aeeOkVqnFHM0/1.BjKV9CS24XerYqQVYMIG', 1, 1, 1, 'lalbizures@gmail.com', '2015-10-15 11:32:42', 'Desarrollador'),
(3, 'test', 'Mario', 'test', '123', 1, 1, 1, 'lala@test.com', '2015-07-12 15:13:50', NULL),
(4, 'jul', 'julio', 'peres', '$2a$10$33d', 1, 1, 1, 'jul@gmai.com', '2015-07-12 17:37:17', NULL),
(7, 'jalbizures', 'jose', 'albizures', '$2a$10$4daabecc4264e6f10a014uc3ACyrSlxB5CxEiiMZhlS5kEW1FnEjW', 1, 1, 1, 'albi@gmg.com', '2015-07-13 19:45:13', 'Jefe'),
(8, 'cualquiera', 'cual', 'quier', '$2a$10$aacd7ea1500e693fe51fbeUVbB.ioZX1AfEGpyJvKdFztU98WZt8u', 1, 1, 1, 'cualquiera@', '2015-08-20 20:53:43', 'caualquiera'),
(9, 'tro', 'tro', 'tro', '$2a$10$903a7671dd7c4dbc5a0d3OSIAWnPOkA2pmcTf0ZGsFZFOmQiFZG/i', 1, 1, 1, 'tro@', '2015-08-20 20:56:25', 'cargo'),
(10, 'rt', 'rt', 'rt', '$2a$10$76a624e2a5f3ec096d765uDJUIvWSKQlAwsTKzV8mQiJ1/nK7xCvu', 1, 1, 1, 'rt@', '2015-08-20 21:03:02', 'cargo'),
(11, 'yey', 'yey', 'eyey', '$2a$10$50c78fae67d3ad7a99967uUocPnOCoF3MWt4CPh6VRJa/Qehhxt9W', 1, 1, 1, 'yey@', '2015-08-20 21:06:12', 'yey');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sip_precalificados`
--

CREATE TABLE IF NOT EXISTS `sip_precalificados` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_tipo_pre` int(11) NOT NULL,
  `lugar` varchar(100) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `tipo_persona` int(11) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `DPI` varchar(13) DEFAULT NULL,
  `pasaporte` varchar(16) DEFAULT NULL,
  `nit` varchar(16) DEFAULT NULL,
  `id_pais_nac` int(11) DEFAULT NULL,
  `razon_social` varchar(100) DEFAULT NULL,
  `ofis_principal` varchar(100) DEFAULT NULL,
  `Domicilio` varchar(100) DEFAULT NULL,
  `dir_recibe_notificacion` varchar(100) DEFAULT NULL,
  `Telefono` varchar(18) DEFAULT NULL,
  `rep_legal` varchar(100) DEFAULT NULL,
  `especialidad` int(11) DEFAULT NULL,
  `perj_nombre` varchar(100) DEFAULT NULL,
  `perj_razon_social` varchar(100) DEFAULT NULL,
  `perj_ofis_principal` varchar(100) DEFAULT NULL,
  `perj_Domicilio` varchar(100) DEFAULT NULL,
  `perj_dir_recibe_notificacion` varchar(100) DEFAULT NULL,
  `perj_Telefono` varchar(18) DEFAULT NULL,
  `perj_rep_legal` varchar(100) DEFAULT NULL,
  `perj_DPI` varchar(13) DEFAULT NULL,
  `fecha_crea` datetime DEFAULT NULL,
  `id_usuario_crea` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sip_precalificados_cert`
--

CREATE TABLE IF NOT EXISTS `sip_precalificados_cert` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_precalificado` int(11) DEFAULT NULL,
  `id_usuario_crea` int(11) DEFAULT NULL,
  `fecha_crea` datetime DEFAULT NULL,
  `vigencia` datetime DEFAULT NULL,
  `estado` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sip_precalificados_doc`
--

CREATE TABLE IF NOT EXISTS `sip_precalificados_doc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_precalificado` int(11) NOT NULL,
  `id_tipo_doc` int(11) NOT NULL,
  `ubicacion` varchar(100) DEFAULT NULL,
  `fecha_crea` datetime DEFAULT NULL,
  `id_usuario_crea` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sip_proyecto`
--

CREATE TABLE IF NOT EXISTS `sip_proyecto` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_sector` int(11) NOT NULL,
  `prestaciones` varchar(200) DEFAULT NULL,
  `nombre` varchar(200) DEFAULT NULL,
  `id_ice` int(11) NOT NULL,
  `objetivo` varchar(500) DEFAULT NULL,
  `id_pais` int(11) NOT NULL,
  `id_depto` int(11) NOT NULL DEFAULT '0',
  `id_munic` int(11) NOT NULL DEFAULT '0',
  `monto_pre_aprox` decimal(12,2) DEFAULT '0.00',
  `fecha_present_p` date DEFAULT NULL,
  `dictamen_tec_ref` varchar(10) DEFAULT '',
  `dictamen_tec_fec` date DEFAULT NULL,
  `dictamen_tec_doc` varchar(200) DEFAULT '',
  `dictamen_leg_ref` varchar(10) DEFAULT '',
  `dictamen_leg_fec` date DEFAULT NULL,
  `dictamen_leg_doc` varchar(200) DEFAULT '',
  `res_dir_eje_ref` varchar(10) DEFAULT '',
  `res_dir_eje_fec` date DEFAULT NULL,
  `res_dir_eje_doc` varchar(200) DEFAULT '',
  `res_conadie_ref` varchar(10) DEFAULT '',
  `res_conadie_fec` date DEFAULT NULL,
  `res_conadie_doc` varchar(200) DEFAULT '',
  PRIMARY KEY (`id`),
  FULLTEXT KEY `nombre` (`nombre`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=17 ;

--
-- Volcado de datos para la tabla `sip_proyecto`
--

INSERT INTO `sip_proyecto` (`id`, `id_sector`, `prestaciones`, `nombre`, `id_ice`, `objetivo`, `id_pais`, `id_depto`, `id_munic`, `monto_pre_aprox`, `fecha_present_p`, `dictamen_tec_ref`, `dictamen_tec_fec`, `dictamen_tec_doc`, `dictamen_leg_ref`, `dictamen_leg_fec`, `dictamen_leg_doc`, `res_dir_eje_ref`, `res_dir_eje_fec`, `res_dir_eje_doc`, `res_conadie_ref`, `res_conadie_fec`, `res_conadie_doc`) VALUES
(1, 1, 'de todo', 'pruebas', 1, 'probar esto', 1, 1, 1, '44444.00', '1966-03-07', '2', '1966-03-07', '/server/files/1.pdf', '33', '1966-03-07', '/server/uploaded_files/1dictamen', '33', '1966-03-07', '', '33', '1966-03-07', ''),
(2, 1, 'de todo', 'pruebas', 1, 'probar esto', 1, 1, 1, '20.00', '2011-01-01', 'nada', '2011-01-01', '', '333s', '2011-01-01', '/server/uploaded_files/2dictamen_leg_doc.pdf', 'ddd', '2012-01-01', '', 'dfdfdd', '2012-02-02', ''),
(3, 2, 'lalala', 'lallal', 1, 'lalalalala', 1, 1, 1, '33333.00', '1955-05-05', '3', '1962-04-17', '/server/uploaded_files/3dictamen_tec_doc.pdf', '5', '1964-03-14', '/server/uploaded_files/3dictamen', '2', '1961-07-25', '', '5', '1963-05-11', ''),
(4, 1, 'otrao', 'prueba', 1, 'alallalala', 1, 1, 1, '4.00', '1955-01-01', '1', '1950-01-01', '', '-1', '1950-01-01', '', '2', '1950-01-01', '', '-1', '1950-01-01', ''),
(5, 1, 'oaooaoao', 'otra', 1, '34234324', 1, 1, 1, '2.00', '1950-01-01', '1', '1950-01-01', '', '3', '1950-01-01', '', '3', '1950-01-01', '', '3', '1950-01-01', ''),
(6, 1, 'lalalala', 'lallal', 1, 'lalalalalalalal', 1, 1, 1, '4.00', '1954-03-03', '4', '1965-03-01', '', '2', '1950-01-01', '', '4', '1950-01-01', '', '3', '1950-01-01', ''),
(7, 1, 'qweqwewqe', 'qweqweqwewq', 1, 'qwewqeqweqweqe', 1, 1, 1, '5.00', '1954-04-06', '3', '1950-01-01', '', '4', '1950-01-01', '', '3', '1950-01-01', '', '4', '1950-01-01', ''),
(11, 1, 'ererw', 'jose', 1, '34343434', 1, 1, 1, '343434.00', '1954-05-03', '0', '2015-09-29', '/server/uploaded_files/11dictamen_tec_doc.pdf', '0', '2015-09-29', '/server/uploaded_files/11dictamen_leg_doc.pdf', '0', '2015-09-29', '/server/uploaded_files/11res_dir_eje_doc.pdf', '', '0000-00-00', ''),
(12, 1, 'presta', 'alias', 1, '43434343434', 1, 1, 1, '343434343.00', '2015-09-30', '5', '2015-09-30', '/server/uploaded_files/12dictamen_tec_doc.pdf', '9', '2015-09-30', '/server/uploaded_files/12dictamen_leg_doc.pdf', '0', '2015-09-30', '/server/uploaded_files/12res_dir_eje_doc.pdf', '0', '2015-09-30', '/server/uploaded_files/12res_conadie_doc.pdf'),
(13, 1, 'ciones', 'deded', 1, 'iiiiiii', 1, 1, 1, '6.00', '2015-09-30', '0', '2015-09-30', '/server/uploaded_files/13dictamen_tec_doc.pdf', '6', '2015-09-30', '/server/uploaded_files/13dictamen_leg_doc.pdf', '6', '2015-09-30', '/server/uploaded_files/13res_dir_eje_doc.pdf', '3', '2015-10-08', '/server/uploaded_files/13res_conadie_doc.pdf'),
(14, 1, 'wwwww', 'aax', 1, 'wwwwwwwww', 1, 1, 1, '33434.00', '2015-09-30', '5', '2015-09-30', '/server/uploaded_files/14dictamen_tec_doc.pdf', '6', '2015-09-30', '/server/uploaded_files/14dictamen_leg_doc.pdf', '6', '2015-09-30', '/server/uploaded_files/14res_dir_eje_doc.pdf', '6', '2015-09-30', '/server/uploaded_files/14res_conadie_doc.pdf'),
(15, 1, 'ooooo', 'aav', 1, 'oooooooooooooo', 1, 1, 1, '99999999.00', '2015-09-30', '11', '2015-09-30', '/server/uploaded_files/15dictamen_tec_doc.pdf', '0', '2015-09-30', '/server/uploaded_files/15dictamen_leg_doc.pdf', '9', '2015-09-30', '/server/uploaded_files/15res_dir_eje_doc.pdf', '0', '2015-09-30', '/server/uploaded_files/15res_conadie_doc.pdf'),
(16, 2, '33333', 'aau', 1, '333333333', 1, 1, 1, '33333.00', '2015-09-30', '10', '2015-09-30', '/server/uploaded_files/16dictamen_tec_doc.pdf', '7', '2015-09-30', '/server/uploaded_files/16dictamen_leg_doc.pdf', '6', '2015-09-30', '/server/uploaded_files/16res_dir_eje_doc.pdf', '', '0000-00-00', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sip_proyeto`
--

CREATE TABLE IF NOT EXISTS `sip_proyeto` (
  `id` int(11) NOT NULL,
  `id_sector` int(11) NOT NULL,
  `prestaciones` varchar(200) DEFAULT NULL,
  `nombre` varchar(200) DEFAULT NULL,
  `id_ice` int(11) NOT NULL,
  `objetivo` varchar(500) DEFAULT NULL,
  `id_pais` int(11) NOT NULL,
  `id_depto` int(11) NOT NULL DEFAULT '0',
  `id_munic` int(11) NOT NULL DEFAULT '0',
  `monto_pre_aprox` decimal(12,2) DEFAULT '0.00',
  `fecha_present_p` date DEFAULT NULL,
  `dictamen_tec_ref` varchar(10) DEFAULT '',
  `dictamen_tec_fec` date DEFAULT NULL,
  `dictamen_tec_doc` varchar(200) DEFAULT '',
  `dictamen_leg_ref` varchar(10) DEFAULT '',
  `dictamen_leg_fec` date DEFAULT NULL,
  `dictamen_leg_doc` varchar(200) DEFAULT '',
  `res_dir_eje_ref` varchar(10) DEFAULT '',
  `res_dir_eje_fec` date DEFAULT NULL,
  `res_dir_eje_doc` varchar(200) DEFAULT '',
  `res_conadie_ref` varchar(10) DEFAULT '',
  `res_conadie_fec` date DEFAULT NULL,
  `res_conadie_doc` varchar(200) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sip_tipo_precalificado`
--

CREATE TABLE IF NOT EXISTS `sip_tipo_precalificado` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `precalificado` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Volcado de datos para la tabla `sip_tipo_precalificado`
--

INSERT INTO `sip_tipo_precalificado` (`id`, `precalificado`) VALUES
(1, 'Consultoría y Asesoría'),
(2, 'Peritos'),
(3, 'Arbitros'),
(4, 'Proveedores'),
(5, 'Licitantes');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
