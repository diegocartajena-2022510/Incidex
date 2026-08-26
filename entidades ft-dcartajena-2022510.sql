create database entidadesCartajena_IN5CM;
use  entidadesCartajena_IN5CM;

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


