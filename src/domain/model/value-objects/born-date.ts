
export class BornDate {
  private readonly value: Date;
  private static readonly MIN_AGE = 18;
  private static readonly DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

  constructor(dateString: string) {
    if (!BornDate.matchesPattern(dateString)) {
      throw new Error("La fecha debe tener el formato 'yyyy-mm-dd'");
    }

    const date = new Date(dateString);

    if (!BornDate.isValidDate(date)) {
      throw new Error("Fecha de nacimiento inválida");
    }

    if (!BornDate.isAdult(date)) {
      throw new Error(`El usuario debe ser mayor de ${BornDate.MIN_AGE} años`);
    }

    this.value = date;
  }

  private static matchesPattern(dateStr: string): boolean {
    return this.DATE_PATTERN.test(dateStr.trim());
  }

  private static isValidDate(date: Date): boolean {
    return !isNaN(date.getTime());
  }

  private static isAdult(birthDate: Date): boolean {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= this.MIN_AGE;
  }

  private static calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  get(): Date {
    return this.value;
  }

  getAge(): number {
    return BornDate.calculateAge(this.value);
  }
}
