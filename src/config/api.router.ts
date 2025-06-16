import { app } from "@azure/functions";
import { CreateUserFunction } from "../interfaces/functions/users/create-user.function";
import { SignInFunction } from "../interfaces/functions/auth/sign-in.function";
import { CreateAlumnoFunction } from "../interfaces/functions/alumno/create-alumno.function";
import { GetAlumnoByIdFunction } from "../interfaces/functions/alumno/get-alumno-by-id.function";
import { GetAlumnosFunction } from "../interfaces/functions/alumno/get-alumnos.function";
import { CreateNotaFunction } from "../interfaces/functions/nota/create-nota.function";
import { GetNotasFunction } from "../interfaces/functions/nota/get-notas.function";
import { DeleteNotaFunction } from "../interfaces/functions/nota/delete-nota.function";
import { GetPredictionFunction } from "../interfaces/functions/nota/get-prediction.function";
import { DeleteAlumnoFunction } from "../interfaces/functions/alumno/delete-alumno.function";

// Usuarios
app.http('RegistrarUsuario', { methods: ['POST'], authLevel: 'anonymous', route: 'user', handler: CreateUserFunction });
app.http('Login', { methods: ['POST'], authLevel: 'anonymous', route: 'auth/sign-in', handler: SignInFunction });
// Alumnos
app.http('CrearAlumno', { methods: ['POST'], authLevel: 'anonymous', route: 'alumno', handler: CreateAlumnoFunction });
app.http('ObtenerAlumnoPorId', { methods: ['GET'], authLevel: 'anonymous', route: 'alumno/{id}', handler: GetAlumnoByIdFunction });
app.http('ListarAlumnos', { methods: ['GET'], authLevel: 'anonymous', route: 'alumno', handler: GetAlumnosFunction });
app.http('EliminarAlumno', { methods: ['DELETE'], authLevel: 'anonymous', route: 'alumno/{id}', handler: DeleteAlumnoFunction});

// Notas
app.http('RegistrarNotaAlumno', { methods: ['POST'], authLevel: 'anonymous', route: 'nota', handler: CreateNotaFunction });
app.http('ObtenerNotasAlumnos', { methods: ['GET'], authLevel: 'anonymous', route: 'nota', handler: GetNotasFunction });
app.http('EliminarNota', { methods: ['DELETE'], authLevel: 'anonymous', route: 'nota/{alumnoId}/{notaId}', handler: DeleteNotaFunction });
app.http('ObtenerPrediccion', { methods: ['POST'], authLevel: 'anonymous', route: 'nota/prediction', handler: GetPredictionFunction });
