
import { Component, inject } from '@angular/core';
import { GeminiService } from '../../services/gemini.service';

@Component({
  selector: 'app-api-key-warning',
  imports: [],
  template: `
    @if(geminiService.apiKeyStatus() === 'invalid') {
      <div class="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
        <strong class="font-bold">Configuration Error:</strong>
        <span class="block sm:inline ml-2">Gemini API key is missing or invalid. Please configure the API_KEY environment variable.</span>
      </div>
    }
  `,
})
export class ApiKeyWarningComponent {
  geminiService = inject(GeminiService);
}
