// src/getGeminiCliResponse.test.ts

import { getGeminiCliResponse } from './index';
import { spawn } from 'child_process';
import { Readable } from 'stream';
import { jest, describe, beforeEach, test, expect } from '@jest/globals';

jest.mock('child_process');

const mockSpawn = spawn as jest.Mock;

describe('getGeminiCliResponse', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should resolve with the full response on successful execution', async () => {
    // -- Arrange --
    const geminiCliPath = '/fake/path/gemini';
    const prompt = 'Hello, world!';
    const expectedResponse = 'This is a successful response from Gemini.';
    let closeCallback: (code: number) => void = () => {};

    // Create a mock child process object
    const mockProcess = {
      stdout: new Readable({ read() {} }),
      stderr: new Readable({ read() {} }),
      stdin: {
        write: jest.fn(),
        end: jest.fn(),
      },
      on: jest.fn((event: string, callback: (code: number) => void) => {
        if (event === 'close') {
          closeCallback = callback;
        }
      }),
    };

    // **THIS IS THE KEY CHANGE**
    // We listen for the 'end' event on the stream. When the stream is done,
    // THEN we trigger the process 'close' event.
    mockProcess.stdout.on('end', () => {
      closeCallback(0); // Simulate success
    });

    mockSpawn.mockReturnValue(mockProcess);

    // -- Act --
    const responsePromise = getGeminiCliResponse({ geminiCliPath, prompt });

    // -- Simulate Events --
    // Push data to the stream and then immediately signal that it's the end of the stream.
    // This will trigger the 'end' event listener we set up above.
    mockProcess.stdout.push(expectedResponse);
    mockProcess.stdout.push(null);

    // -- Assert --
    await expect(responsePromise).resolves.toBe(expectedResponse);
    expect(mockSpawn).toHaveBeenCalledWith(geminiCliPath);
    expect(mockProcess.stdin.write).toHaveBeenCalledWith(prompt);
  });

  test('should reject with the full error on failed execution', async () => {
    // -- Arrange --
    const geminiCliPath = '/fake/path/gemini';
    const prompt = 'This prompt will fail.';
    const expectedError = 'An error occurred during execution.';
    let closeCallback: (code: number) => void = () => {};

    const mockProcess = {
      stdout: new Readable({ read() {} }),
      stderr: new Readable({ read() {} }),
      stdin: { write: jest.fn(), end: jest.fn() },
      on: jest.fn((event: string, callback: (code: number) => void) => {
        if (event === 'close') {
          closeCallback = callback;
        }
      }),
    };

    // **APPLY THE SAME FIX** for the stderr stream.
    mockProcess.stderr.on('end', () => {
      closeCallback(1); // Simulate failure
    });

    mockSpawn.mockReturnValue(mockProcess);

    // -- Act --
    const responsePromise = getGeminiCliResponse({ geminiCliPath, prompt });

    // -- Simulate Events --
    mockProcess.stderr.push(expectedError);
    mockProcess.stderr.push(null); // End the stderr stream

    // -- Assert --
    await expect(responsePromise).rejects.toBe(expectedError);
  });
});
