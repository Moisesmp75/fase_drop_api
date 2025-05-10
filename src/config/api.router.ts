import { app } from "@azure/functions";
import { CreateUserFunction } from "../interfaces/functions/users/create-user.function";
import { SignInFunction } from "../interfaces/functions/auth/sign-in.function";
import { CreateAlumnoFunction } from "../interfaces/functions/alumno/create-alumno.function";
import { GetAlumnoByIdFunction } from "../interfaces/functions/alumno/get-alumno-by-id.function";
import { GetAlumnosFunction } from "../interfaces/functions/alumno/get-alumnos.function";

app.http('register-user', { methods: ['POST'], authLevel: 'anonymous', route: 'user', handler: CreateUserFunction });
app.http('sign-in', { methods: ['POST'], authLevel: 'anonymous', route: 'auth/sign-in', handler: SignInFunction });
app.http('create-alumno', { methods: ['POST'], authLevel: 'function', route: 'alumno', handler: CreateAlumnoFunction });
app.http('get-alumno-by-id', { methods: ['GET'], authLevel: 'function', route: 'alumno/{id}', handler: GetAlumnoByIdFunction });
app.http('get-alumnos', { methods: ['GET'], authLevel: 'function', route: 'alumno', handler: GetAlumnosFunction });
