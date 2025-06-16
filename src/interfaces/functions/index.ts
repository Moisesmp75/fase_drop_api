import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CreateAlumnoFunction } from "./alumno/create-alumno.function";
import { GetAlumnosFunction } from "./alumno/get-alumnos.function";
import { DeleteAlumnoFunction } from "./alumno/delete-alumno.function";

// Registrar la función de eliminación de alumnos

// Otras funciones existentes... 