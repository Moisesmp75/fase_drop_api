
const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export class Email {
  private readonly value: string;

  constructor(email: string) {
    if(!email) 
      throw new  Error('Email es requerido');
    
    if (!Email.isValid(email))
      throw new Error('Email es invalido')
    
    this.value = email.trim();
  }

  get domain(): string {
    return this.value.split('@')[1];
  }

  get email(): string {
    return this.value.split('@')[0];
  }

  public static isValid(email: string): boolean {
    if (email == null)
      return false;
    email = email.trim();
    return EMAIL_PATTERN.test(email);
  }

  get (): string {
    return this.value;
  }
}