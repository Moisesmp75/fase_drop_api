import { app } from "@azure/functions";
import { CreateUserFunction } from "../interfaces/functions/users/create-user.function";
import { SignInFunction } from "../interfaces/functions/auth/sign-in.function";
import { CreateAlumnoFunction } from "../interfaces/functions/alumno/create-alumno.function";
import { GetAlumnoByIdFunction } from "../interfaces/functions/alumno/get-alumno-by-id.function";
import { GetAlumnosFunction } from "../interfaces/functions/alumno/get-alumnos.function";
import { CreateNotaFunction } from "../interfaces/functions/nota/create-nota.function";
import { GetNotasFunction } from "../interfaces/functions/nota/get-notas.function";

app.http('RegistrarUsuario', { methods: ['POST'], authLevel: 'anonymous', route: 'user', handler: CreateUserFunction });
app.http('Login', { methods: ['POST'], authLevel: 'anonymous', route: 'auth/sign-in', handler: SignInFunction });
app.http('CrearAlumno', { methods: ['POST'], authLevel: 'anonymous', route: 'alumno', handler: CreateAlumnoFunction });
app.http('ObtenerAlumnoPorId', { methods: ['GET'], authLevel: 'anonymous', route: 'alumno/{id}', handler: GetAlumnoByIdFunction });
app.http('ListarAlumnos', { methods: ['GET'], authLevel: 'anonymous', route: 'alumno', handler: GetAlumnosFunction });
app.http('RegistrarNotaAlumno', { methods: ['POST'], authLevel: 'anonymous', route: 'nota', handler: CreateNotaFunction });
app.http('ObtenerNotasAlumnos', { methods: ['GET'], authLevel: 'anonymous', route: 'nota', handler: GetNotasFunction });

