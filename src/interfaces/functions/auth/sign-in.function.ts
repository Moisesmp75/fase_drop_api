import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { SignInCommand } from "../../../domain/model/commands/user/sign-in.command";
import { SignInUseCase } from "../../../application/use-cases/user/sign-in.use-case";

export const SignInFunction = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const { email, password } = await request.json() as SignInCommand;

    if (!email || !password) {
      return {
        status: 400,
        jsonBody: {
          message: "Email y contraseña son requeridos"
        }
      };
    }

    const signInUseCase = new SignInUseCase();
    const { user, token } = await signInUseCase.execute({ email, password });

    return {
      status: 200,
      jsonBody: {
        message: "Login exitoso",
        token,
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
      status: 401,
      jsonBody: {
        message: error.message
      }
    };
  }
}