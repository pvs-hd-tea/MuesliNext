export class Optional<T> {
  private value: T | undefined;

  constructor(value: T | undefined) {
    this.value = value;
  }

  isUndefined(): boolean {
    return this.value === undefined;
  }

  unwrap(): T {
    if (this.value === undefined) {
      throw new Error("Optional is empty");
    }
    return this.value;
  }
}

export interface PageLink {
  name: string;
  path: string;
}
