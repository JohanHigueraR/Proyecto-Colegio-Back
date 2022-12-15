const pool = require("../postgres");
var Hashes = require("jshashes");
/* -----LOGIN---- */
const leerUsuarios = async (req, res) => {
  var SHA1 = new Hashes.SHA1();
  try {
    const { nombre_usuario, contraseña_usuario } = req.body;
    const login = await pool.query("SELECT * FROM usuario");
    console.log('esta validando')
    res.json(
      login.rows[0].contraseña_usuario == SHA1.hex(contraseña_usuario) &&
        nombre_usuario == login.rows[0].nombre_usuario
    );
    
  } catch (error) {
    res.json({ error: error.message });
    console.log({error:error.message})
  }
};
/* -----CURSOS------- */
const mostrarTodosCursos = async (req, res) => {
  try {
    const cursos = await pool.query(
      "SELECT * FROM curso  WHERE estado_curso = true ORDER BY nombre_curso"
    );
    console.log(cursos);
    res.json(cursos.rows);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const mostrarCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM curso WHERE id_curso = $1 AND estado_curso = true ORDER BY nombre_curso",
      [id]
    );
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const crearCurso = async (req, res) => {
  try {
    const { nombre_curso, director_curso } = req.body;
    const result = await pool.query(
      "INSERT INTO curso(nombre_curso,director_curso,estado_curso) VALUES ($1, $2, true) RETURNING *",
      [nombre_curso, director_curso]
    );
    console.log(result);
    res.json(result.rows[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const eliminarCurso = async (req, res) => {
  try {
    const { id_curso } = req.body;
    const result = await pool.query("DELETE FROM curso WHERE id_curso = $1", [
      id_curso,
    ]);
    if (result.rowCount == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }
    return res.sendStatus(204);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const actualizarCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_curso, director_curso } = req.body;
    const result = await pool.query(
      "UPDATE curso SET nombre_curso = $1, director_curso = $2  WHERE id_curso= $3 RETURNING *",
      [nombre_curso, director_curso, id]
    );
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const archivarCurso = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "UPDATE curso SET estado_curso = false  WHERE id_curso= $1 RETURNING *",
      [id]
    );
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
};

const mostrarCursoArchivado = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM curso WHERE estado_curso = false ORDER BY id_curso desc"
    );
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }
    return res.json(result.rows);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const restaurarCurso = async (req, res) => {
  try {
    const { id_curso } = req.body;

    const result = await pool.query(
      "UPDATE curso SET estado_curso = true  WHERE id_curso= $1 RETURNING *",
      [id_curso]
    );
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const asignarMaterias = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_asignatura } = req.body;
    const result = await pool.query(
      "INSERT INTO asignatura_curso(id_curso,id_asignatura) VALUES ($1, $2) RETURNING *",
      [id, id_asignatura]
    );
    console.log(result);
    res.json(result.rows[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const mostrarMateriasCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const asignaturas = await pool.query(
      "SELECT a.id_asignatura,nombre_curso, nombre_asignatura FROM asignatura a INNER JOIN asignatura_curso ac ON a.id_asignatura = ac.id_asignatura INNER JOIN curso c ON c.id_curso = ac.id_curso WHERE ac.id_curso= $1",
      [id]
    );
    res.json(asignaturas.rows);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const eliminarMateriasCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_asignatura } = req.body;
    const result = await pool.query(
      "DELETE FROM asignatura_curso WHERE id_curso = $1 AND id_asignatura= $2",
      [id, id_asignatura]
    );
    if (result.rowCount == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }
    return res.sendStatus(204);
  } catch (error) {
    res.json({ error: error.message });
    console.log(req.params);
  }
};

/* ----ASIGNATURAS--- */
const mostrarTodosAsignaturas = async (req, res) => {
  try {
    const asignaturas = await pool.query(
      "SELECT * FROM asignatura WHERE estado_asignatura = true ORDER BY nombre_asignatura"
    );
    res.json(asignaturas.rows);
  } catch (error) {
    res.json({ error: error.message });
  }
};
//pendiente a asignacion de asignaturas
const crearAsignatura = async (req, res) => {
  try {
    const { nombre_asignatura } = req.body;
    const result = await pool.query(
      "INSERT INTO asignatura(nombre_asignatura,estado_asignatura) VALUES ($1, true) RETURNING *",
      [nombre_asignatura]
    );
    console.log(result);
    res.json(result.rows[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const actualizarAsignatura = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_asignatura } = req.body;
    const result = await pool.query(
      "UPDATE asignatura SET nombre_asignatura = $1  WHERE id_asignatura= $2 RETURNING *",
      [nombre_asignatura, id]
    );
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const archivarAsignatura = async (req, res) => {
  try {
    const { id_asignatura } = req.body;
    const result = await pool.query(
      "UPDATE asignatura SET estado_asignatura = false  WHERE id_asignatura= $1 RETURNING *",
      [id_asignatura]
    );
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const restaurarAsignatura = async (req, res) => {
  try {
    const { id_asignatura } = req.body;
    const result = await pool.query(
      "UPDATE asignatura SET estado_asignatura = true  WHERE id_asignatura= $1 RETURNING *",
      [id_asignatura]
    );
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const detallesAsignatura = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM asignatura WHERE id_asignatura = $1",
      [id]
    );
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const mostrarAsignaturaArchivado = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM asignatura WHERE estado_asignatura = false ORDER BY id_asignatura desc"
    );
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }
    return res.json(result.rows);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const eliminarAsignatura = async (req, res) => {
  try {
    const { id_asignatura } = req.body;
    const result = await pool.query(
      "DELETE FROM asignatura WHERE id_asignatura = $1",
      [id_asignatura]
    );
    if (result.rowCount == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }
    return res.sendStatus(204);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const mostrarEstudiantes = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id_estudiante, nombre_estudiante, apellido_estudiante, nombre_curso, id_curso FROM estudiante e INNER JOIN curso c ON curso_estudiante = id_curso WHERE estado_estudiante=true"
    );
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }
    return res.json(result.rows);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const mostrarEstudiantesarchivados = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id_estudiante, nombre_estudiante, apellido_estudiante, nombre_curso, id_curso FROM estudiante e INNER JOIN curso c ON curso_estudiante = id_curso WHERE estado_estudiante=false"
    );
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }
    return res.json(result.rows);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const crearEstudiantes = async (req, res) => {
  try {
    const { nombre_estudiante, apellido_estudiante, nombre_curso } = req.body;
    const result = await pool.query(
      "INSERT INTO estudiante(nombre_estudiante,apellido_estudiante, curso_estudiante) VALUES ($1, $2, (SELECT id_curso FROM curso WHERE nombre_curso = $3))",
      [nombre_estudiante, apellido_estudiante, nombre_curso]
    );
    console.log(result);
    res.json(result.rows[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const editarEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_estudiante, apellido_estudiante, nombre_curso } = req.body;
    const result = await pool.query(
      "UPDATE estudiante SET nombre_estudiante = $1, apellido_estudiante = $2, curso_estudiante=(SELECT id_curso FROM curso WHERE nombre_curso = $3)  WHERE id_estudiante= $4 RETURNING *",
      [nombre_estudiante, apellido_estudiante, nombre_curso, id]
    );
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const cargarEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM estudiante WHERE id_estudiante = $1 AND estado_estudiante = true",
      [id]
    );
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const mostrarAsignaturaEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT nombre_asignatura, nombre_estudiante, apellido_estudiante, nombre_curso, a.id_asignatura FROM asignatura a INNER JOIN asignatura_curso ac ON  a.id_asignatura = ac.id_asignatura INNER JOIN estudiante e ON ac.id_curso = e.curso_estudiante INNER JOIN curso c ON ac.id_curso = c.id_curso WHERE e.id_estudiante = $1",
      [id]
    );
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    return res.json(result.rows);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const cargarCursosConMaterias = async (req, res) => {
  try {
    const cursos = await pool.query(
      "SELECT DISTINCT ac.id_curso,nombre_curso FROM curso c INNER JOIN asignatura_curso ac ON ac.id_curso = c.id_curso"
    );
    console.log(cursos);
    res.json(cursos.rows);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const archivarEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "UPDATE estudiante SET estado_estudiante = false WHERE id_estudiante = $1",
      [id]
    );
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const restaurarEstudiante = async (req, res) => {
  try {
    const { id_estudiante } = req.body;
    const result = await pool.query(
      "UPDATE estudiante SET estado_estudiante = true WHERE id_estudiante = $1",
      [id_estudiante]
    );
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const eliminarEstudiante = async (req, res) => {
  try {
    const { id_estudiante } = req.body;
    const result = await pool.query(
      "DELETE from estudiante WHERE id_estudiante=$1",
      [id_estudiante]
    );
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const mostrarEstudiantesPorCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM estudiante WHERE curso_estudiante = $1",
      [id]
    );
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    return res.json(result.rows);
  } catch (error) {
    res.json({ error: error.message });
  }
};

const crearNota = async (req, res) => {
  try {
    const { id_estudiante, id_asignatura, tema, valor_nota } = req.body;
    const result = await pool.query(
      "INSERT INTO notas (id_estudiante, id_asignatura, tema, valor_nota) VALUES ($1,$2,$3,$4) RETURNING *",
      [id_estudiante, id_asignatura, tema, valor_nota]
    );
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const cargarNotas = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM notas WHERE id_asignatura = $1",
      [id]
    );
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }
    return res.json(result.rows);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const cargarNotasEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM notas WHERE id_estudiante = $1",
      [id]
    );
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }
    return res.json(result.rows);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const editarNota = async (req, res) => {
  try {
    const { valor_nota, tema, id_nota } = req.body;
    const result = await pool.query(
      "UPDATE notas SET valor_nota = $1, tema = $2 WHERE id_nota= $3 RETURNING *",
      [valor_nota, tema, id_nota]
    );
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const eliminarNota = async (req, res) => {
  try {
    const { id_nota } = req.body;
    const result = await pool.query("DELETE FROM notas WHERE id_nota = $1", [
      id_nota,
    ]);
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const cargarPromedio = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT id_asignatura, id_estudiante, TRUNC(AVG(valor_nota),1) FROM notas WHERE id_asignatura = $1 GROUP BY id_estudiante, id_asignatura",
      [id]
    );
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }
    return res.json(result.rows);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const cargarPromedioEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT id_asignatura, id_estudiante, TRUNC(AVG(valor_nota),1) FROM notas WHERE id_estudiante = $1 GROUP BY id_estudiante, id_asignatura",
      [id]
    );
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }
    return res.json(result.rows);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const cargarPromedioGeneral = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT id_estudiante, TRUNC(AVG(valor_nota),1) FROM notas WHERE id_estudiante = $1 GROUP BY id_estudiante",
      [id]
    );
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }
    return res.json(result.rows);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const cargarEstudiantesSinCurso = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM estudiante WHERE curso_estudiante is null"
    );
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }
    return res.json(result.rows);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const asignarEstudianteSinCurso = async (req, res) => {
  try {
    const { id_curso } = req.params;
    const { id_estudiante } = req.body;
    const result = await pool.query(
      "UPDATE estudiante SET curso_estudiante = $1 WHERE id_estudiante = $2",
      [id_curso, id_estudiante]
    );
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }
    return res.json(result.rows);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const retirarEstudiante = async (req, res) => {
  try {
    const { id_estudiante } = req.body;
    const result = await pool.query(
      "UPDATE estudiante SET curso_estudiante = null WHERE id_estudiante = $1",
      [id_estudiante]
    );
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }
    return res.json(result.rows);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const promedioEstudianteDashboard =async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT n.id_estudiante,apellido_estudiante,nombre_estudiante,nombre_curso,TRUNC(AVG(valor_nota),1) FROM notas n INNER JOIN estudiante e ON n.id_estudiante=e.id_estudiante INNER JOIN curso c ON c.id_curso = e.curso_estudiante GROUP BY n.id_estudiante, nombre_estudiante, apellido_estudiante, nombre_curso ORDER BY trunc desc"
    );
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }
    return res.json(result.rows);
  } catch (error) {
    res.json({ error: error.message });
  }
};
module.exports = {
  mostrarTodosCursos,
  mostrarCurso,
  crearCurso,
  eliminarCurso,
  actualizarCurso,
  mostrarTodosAsignaturas,
  asignarMaterias,
  mostrarMateriasCurso,
  eliminarMateriasCurso,
  crearAsignatura,
  leerUsuarios,
  actualizarAsignatura,
  detallesAsignatura,
  mostrarCursoArchivado,
  archivarCurso,
  restaurarCurso,
  archivarAsignatura,
  mostrarAsignaturaArchivado,
  eliminarAsignatura,
  mostrarEstudiantes,
  crearEstudiantes,
  editarEstudiante,
  cargarEstudiante,
  mostrarAsignaturaEstudiante,
  cargarCursosConMaterias,
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
};
