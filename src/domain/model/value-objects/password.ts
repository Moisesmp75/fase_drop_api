
const MIN_LENGTH = 8;
const MAX_LENGTH = 20;
const LOWERCASE_REGEX = /[a-z]/;
const UPPERCASE_REGEX = /[A-Z]/;
const NUMBER_REGEX = /\d/;
const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>]/;

export class Password {
  private value: string;


  constructor (password: string) {
    if (!Password.validatePasswordLength(password))
      throw new Error(`La contraseña debe tener entre ${MIN_LENGTH} y ${MAX_LENGTH} caracteres.`)
    if (!Password.validatePasswordContent(password))
      throw new Error("La contraseña debe contener una minuscula, mayuscula, un numero y un caracter especial")
    this.value = password;
  }

  public static validatePasswordLength(password: string): boolean {
    if (password == null)
      return false;
    password = password.trim();
    if (password.length < MIN_LENGTH || password.length > MAX_LENGTH)
      return false;
    return true;
  }

  public static validatePasswordContent(password: string): boolean {
    if (!LOWERCASE_REGEX.test(password))
      return false;
    else if (!UPPERCASE_REGEX.test(password)) 
      return false;
    else if (!NUMBER_REGEX.test(password)) 
      return false;
    else if (!SPECIAL_CHAR_REGEX.test(password)) 
      return false;
    return true;
  }

  get (): string {
    return this.value;
  }

  public setPassword(password: string): void { this.value = password; }
}