import * as fs from 'fs';
import * as stream from 'stream';

class LogStream extends stream.Writable {
  private isFirstWrite: boolean;

  constructor(private filePath: string) {
    super();
    this.isFirstWrite = true;
  }

  _write(chunk: any, encoding: string, callback: () => void): void {
    // Open the file with '[' on the first write
    if (this.isFirstWrite) {
      fs.writeFileSync(this.filePath, '[');
      this.isFirstWrite = false;
    } else {
      // Add a comma before appending new log entries
      fs.appendFileSync(this.filePath, ',');
    }
  
    // Convert the object to a JSON string and append to the file
    const jsonString = JSON.stringify(chunk);
    fs.appendFileSync(this.filePath, jsonString, 'utf-8');
  
    callback();
  }

  _final(callback: () => void): void {
    // Close the JSON array in the file
    fs.appendFileSync(this.filePath, ']');
    callback();
  }
}

export default LogStream;


function streamManager(logsArray: any[], filePrefix: string): void {
  const filePath = `${filePrefix}.json`;

  // Create an instance of LogStream
  const logStream = new LogStream(filePath);

  // Write the logs to the stream after formatting each log
  logsArray.forEach((log, index) => {
    const formattedLog = { id: index + 1, message: log.message }; // Assuming each log has a 'message' property
    logStream.write(JSON.stringify(formattedLog));
  });

  // End the stream to close the file
  logStream.end();
}
const logsArray = [
  { id: 1, message: 'Log entry 1' },
  { id: 2, message: 'Log entry 2' },
];

streamManager(logsArray, 'log'); // Assuming currentIndex is 150000
