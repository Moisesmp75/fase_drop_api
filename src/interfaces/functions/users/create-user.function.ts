import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CreateUserUseCase } from "../../../application/use-cases/user/create-user.use-case";
import { CreateUserCommand } from "../../../domain/model/commands/user/create-user.command";

export const CreateUserFunction = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const body = await request.json() as CreateUserCommand;
    
    const requiredFields = ['first_name', 'last_name', 'email', 'password', 'born_date', 'roles'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return {
        status: 400,
        jsonBody: {
          message: `Campos requeridos faltantes: ${missingFields.join(', ')}`
        }
      };
    }

    const createUserUseCase = new CreateUserUseCase();
    const user = await createUserUseCase.execute(body);

    return {
      status: 201,
      jsonBody: {
        message: "Usuario creado exitosamente",
        user: {
          id: user.getId(),
          email: user.getEmail(),
          firstName: user.getFirstName(),
          lastName: user.getLastName(),
          roles: user.getRoles()
        }
      }
    };
  } catch (error) {
    return {
      status: 400,
      jsonBody: {
        message: error.message
      }
    };
  }
}

  
