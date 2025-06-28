import {spawn} from "child_process";

export const getGeminiCliResponse = async ({geminiCliPath, prompt }) => {
  let fullResponse = '';
  let fullError = '';

  return new Promise((resolve, reject) => {

    const geminiProcess = spawn(`${geminiCliPath}`);

    // ✅ Listen to the data stream as it comes in
    geminiProcess.stdout.on('data', (data) => {
      const output = data.toString();
      fullResponse += output;
    });

    // Listen for any errors
    geminiProcess.stderr.on('data', (data) => {
      fullError += data;
    });

    // ✅ Know when the process has actually closed
    geminiProcess.on('close', (code) => {
      if (code===0) {
        resolve(fullResponse)
      } else {
        reject(fullError);
      }
    });

    // ✅ Write your prompt to the process's standard input
    geminiProcess.stdin.write(`${prompt}`);

    // ✅ You must end the input to signal you are done sending commands
    geminiProcess.stdin.end();
  });
}