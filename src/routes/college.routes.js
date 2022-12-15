const { Router } = require("express");
const {
  cargarCursosConMaterias,
  editarEstudiante,
  mostrarAsignaturaArchivado,
  archivarAsignatura,
  restaurarCurso,
  mostrarCursoArchivado,
  archivarCurso,
  detallesAsignatura,
  eliminarMateriasCurso,
  mostrarTodosCursos,
  mostrarCurso,
  crearCurso,
  eliminarCurso,
  actualizarCurso,
  mostrarTodosAsignaturas,
  asignarMaterias,
  mostrarMateriasCurso,
  crearAsignatura,
  leerUsuarios,
  actualizarAsignatura,
  eliminarAsignatura,
  mostrarEstudiantes,
  crearEstudiantes,
  cargarEstudiante,
  mostrarAsignaturaEstudiante,
  archivarEstudiante,
  mostrarEstudiantesarchivados,
  restaurarEstudiante,
  eliminarEstudiante,
  mostrarEstudiantesPorCurso,
  crearNota,
  cargarNotas,
  editarNota,
  eliminarNota,
  cargarPromedio,
  cargarNotasEstudiante,
  cargarPromedioEstudiante,
  cargarPromedioGeneral,
  cargarEstudiantesSinCurso,
  asignarEstudianteSinCurso,
  retirarEstudiante,
  restaurarAsignatura,
  promedioEstudianteDashboard,
} = require("../controllers/college.controllers");

const router =
  Router(); /* sirve para crear urls y poder interactuar con el front */

/* SE CREAN URL POR CADA FUNCION DE CRUD  */
/* leer: */
router.get("/cursos", mostrarTodosCursos);
/* leer un curso: */
router.get("/cursos/:id/detallescurso", mostrarCurso);
/* crear */
router.post("/cursos/crearcurso", crearCurso);
/* Eliminar: */
router.delete("/cursos/:id/eliminar", eliminarCurso);
/* Actualizar */
router.put("/cursos/:id/editarcurso", actualizarCurso);
router.post("/cursos/:id/detallescurso/asignarmaterias", asignarMaterias);
router.get(
  "/cursos/:id/detallescurso/asignarmaterias/delete",
  mostrarMateriasCurso
);
router.delete(
  "/cursos/:id/detallescurso/asignarmaterias/delete",
  eliminarMateriasCurso
);
/* leer todas las asignaturas */
router.get("/asignaturas", mostrarTodosAsignaturas);
router.put("/asignaturas", archivarAsignatura);
router.post("/asignaturas/crearasignatura", crearAsignatura);
router.put("/asignaturas/:id/crearasignatura", actualizarAsignatura);
router.get("/asignaturas/:id/crearasignatura", detallesAsignatura);
router.put("/login", leerUsuarios);
router.put("/cursos/:id/eliminar", archivarCurso);
router.get("/administracion/cursos", mostrarCursoArchivado);
router.put("/administracion/cursos", restaurarCurso);
router.get("/administracion/asignaturas", mostrarAsignaturaArchivado);
router.put("/administracion/asignaturas", restaurarAsignatura)
router.delete("/administracion/asignaturas", eliminarAsignatura);
router.get("/administracion/estudiantes", mostrarEstudiantesarchivados);
router.put("/administracion/estudiantes", restaurarEstudiante);
router.delete("/administracion/estudiantes", eliminarEstudiante);
router.get("/estudiantes", mostrarEstudiantes);
router.post("/estudiantes", crearEstudiantes);
router.get("/estudiantes/asignarcurso", cargarCursosConMaterias);
router.put("/estudiantes/:id/editar", editarEstudiante);
router.put("/estudiantes/:id/archivar", archivarEstudiante);
/* router.get("/estudiantes/:id/detalles",cargarEstudiante) */
router.get("/estudiantes/:id/detalles", mostrarAsignaturaEstudiante);
router.get("/notas/:id", mostrarEstudiantesPorCurso);
router.post("/notas", crearNota);
router.get("/notas/cargar/:id", cargarNotas);
router.get("/notas/cargar/estudiante/:id", cargarNotasEstudiante);
router.get("/notas/promedio/:id", cargarPromedio);
router.get("/notas/promedio/estudiante/:id", cargarPromedioEstudiante);
router.get("/notas/promedio/general/:id", cargarPromedioGeneral);
router.put("/notas", editarNota);
router.delete("/notas", eliminarNota);
router.get("/estudiantes/sincurso", cargarEstudiantesSinCurso)
router.put("/estudiantes/sincurso/:id_curso", asignarEstudianteSinCurso)
router.put("/estudiantes/retirar",retirarEstudiante)
router.get("/dashboard/estudiantes", promedioEstudianteDashboard)

/* leer los cursos de una asignatura */

module.exports = router;
