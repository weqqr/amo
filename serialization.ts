export class Reader {
  #view: DataView;
  #data: Uint8Array;
  #position = 0;

  constructor(data: Uint8Array) {
    this.#view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    this.#data = data;
  }

  readUint8(): number {
    const value = this.#view.getUint8(this.#position);
    this.#position += 1;
    return value;
  }

  readUint16(): number {
    const value = this.#view.getUint16(this.#position);
    this.#position += 2;
    return value;
  }

  readUint32(): number {
    const value = this.#view.getUint32(this.#position);
    this.#position += 4;
    return value;
  }

  readUint64(): bigint {
    const value = this.#view.getBigUint64(this.#position);
    this.#position += 8;
    return value;
  }

  readInt8(): number {
    const value = this.#view.getInt8(this.#position);
    this.#position += 1;
    return value;
  }

  readInt16(): number {
    const value = this.#view.getInt16(this.#position);
    this.#position += 2;
    return value;
  }

  readInt32(): number {
    const value = this.#view.getInt32(this.#position);
    this.#position += 4;
    return value;
  }

  readInt64(): bigint {
    const value = this.#view.getBigInt64(this.#position);
    this.#position += 8;
    return value;
  }

  readToEnd(): Uint8Array {
    const slice = this.#data.slice(this.#position);
    this.#position += slice.byteLength;
    return slice;
  }
}
