
import { Injectable, signal } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse, GenerateVideosOperationResponse } from '@google/genai';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private ai: GoogleGenAI | null = null;
  public apiKeyStatus = signal<'valid' | 'invalid' | 'unchecked'>('unchecked');

  constructor() {
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error('API_KEY environment variable not found.');
      }
      this.ai = new GoogleGenAI({ apiKey });
      this.apiKeyStatus.set('valid');
    } catch (e) {
      console.error('Failed to initialize Gemini Service:', e);
      this.apiKeyStatus.set('invalid');
    }
  }

  async generateImage(prompt: string): Promise<string> {
    if (this.apiKeyStatus() !== 'valid' || !this.ai) throw new Error('Gemini API not initialized.');
    
    const response = await this.ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt,
      config: { numberOfImages: 1, outputMimeType: 'image/png' },
    });

    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return `data:image/png;base64,${base64ImageBytes}`;
  }

  async generateVideo(prompt: string, onProgress: (message: string) => void): Promise<string> {
    if (this.apiKeyStatus() !== 'valid' || !this.ai) throw new Error('Gemini API not initialized.');

    onProgress('Sending request to the video model...');
    let operation = await this.ai.models.generateVideos({
      model: 'veo-2.0-generate-001',
      prompt: prompt,
      config: { numberOfVideos: 1 }
    });

    onProgress('Video generation started. This may take a few minutes...');
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      onProgress('Checking generation status...');
      operation = await this.ai.operations.getVideosOperation({ operation: operation });
    }
    onProgress('Video generation complete. Fetching video...');
    
    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) {
      throw new Error('Video generation failed or returned no URI.');
    }
    
    const videoResponse = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
  }

  async transcribeAudio(fileAsBase64: string, mimeType: string): Promise<string> {
    if (this.apiKeyStatus() !== 'valid' || !this.ai) throw new Error('Gemini API not initialized.');

    const audioPart = {
      inlineData: {
        data: fileAsBase64,
        mimeType: mimeType,
      },
    };

    const textPart = {
        text: 'Transcribe this audio file.'
    };

    const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [audioPart, textPart] }
    });

    return response.text;
  }
}
