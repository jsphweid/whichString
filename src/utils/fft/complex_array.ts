import { iComplexArray } from './types'

export default class ComplexArray implements iComplexArray {

    ArrayType: any
    real: any
    imag: any
    length: any

  constructor(other: any, arrayType: any = Float32Array) {
    if (other instanceof ComplexArray) {
      // Copy constuctor.
      this.ArrayType = other.ArrayType;
      this.real = new this.ArrayType(other.real);
      this.imag = new this.ArrayType(other.imag);
    } else {
      this.ArrayType = arrayType;
      // other can be either an array or a number.
      this.real = new this.ArrayType(other);
      this.imag = new this.ArrayType(this.real.length);
    }

    this.length = this.real.length;
  }

  forEach(iterator: any): void {
    const n = this.length;
    // For gc efficiency, re-use a single object in the iterator.
    const value = Object.seal(Object.defineProperties({}, {
      real: {writable: true}, imag: {writable: true},
    }));

    for (let i = 0; i < n; i++) {
      value.real = this.real[i];
      value.imag = this.imag[i];
      iterator(value, i, n);
    }
  }

  // In-place mapper.
  map(mapper: any): any {
    this.forEach((value: any, i: number, n: any) => {
      mapper(value, i, n);
      this.real[i] = value.real;
      this.imag[i] = value.imag;
    });

    return this;
  }

  conjugate(): any {
    return new ComplexArray(this).map((value: any) => {
      value.imag *= -1;
    });
  }

  magnitude(): any {
    const mags = new this.ArrayType(this.length);

    this.forEach((value: any, i: number) => {
      mags[i] = Math.sqrt(value.real*value.real + value.imag*value.imag);
    })

    return mags;
  }
}
