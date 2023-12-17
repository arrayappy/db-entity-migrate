import * as fs from 'fs';
import * as stream from 'stream';

class LogStream extends stream.Writable {
  private fileStream: fs.WriteStream;

  constructor(private filePath: string) {
    super();
    this.fileStream = fs.createWriteStream(this.filePath, { flags: 'a' });
    this.fileStream.write('[');
  }

  /**
   * Writes a single JSON object to the log stream.
   * @param obj - The JSON object to be written.
   */
  writeObj(obj: any): void {
    const jsonString = JSON.stringify(obj);
    this.fileStream.write(jsonString + ',');
  }

  /**
   * Finalizes the log stream with a single JSON object.
   * @param obj - The last JSON object to be added before finalizing.
   */
  finalizeWithObj(obj: any): void {
    this.writeObj(obj);
    this.fileStream.end(']');
  }

  /**
   * Writes an array of JSON objects to the log stream.
   * @param array - The array of JSON objects to be written.
   */
  writeArray(array: any[]): void {
    let jsonStringArray = '';

    for (let i = 0; i < array.length; i++) {
      const jsonString = JSON.stringify(array[i]);
      jsonStringArray += jsonString + ',';
    }

    this.fileStream.write(jsonStringArray);
  }

  /**
   * Finalizes the log stream with an array of JSON objects.
   * @param array - The last array of JSON objects to be added before finalizing.
   */
  finalizeWithArray(array: any[]): void {
    let jsonStringArray = '';

    for (let i = 0; i < array.length; i++) {
      const jsonString = JSON.stringify(array[i]);
      jsonStringArray += jsonString;

      if (i < array.length - 1) {
        jsonStringArray += ',';
      }
    }

    this.fileStream.write(jsonStringArray); 
    this.fileStream.end(']');
  }
}

export default LogStream;