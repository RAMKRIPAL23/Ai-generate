
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GeminiService } from '../../services/gemini.service';
import { DownloadService } from '../../services/download.service';
import { ApiKeyWarningComponent } from '../shared/api-key-warning.component';
import { LoaderComponent } from '../shared/loader.component';

@Component({
  selector: 'app-audio-transcription',
  templateUrl: './audio-transcription.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ApiKeyWarningComponent, LoaderComponent],
})
export class AudioTranscriptionComponent {
  private geminiService = inject(GeminiService);
  private downloadService = inject(DownloadService);

  selectedFile = signal<File | null>(null);
  loading = signal(false);
  transcription = signal<string | null>(null);
  error = signal<string | null>(null);
  isApiKeyValid = this.geminiService.apiKeyStatus;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
      this.transcription.set(null);
      this.error.set(null);
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = error => reject(error);
    });
  }

  async transcribeAudio() {
    const file = this.selectedFile();
    if (!file || this.isApiKeyValid() !== 'valid') return;

    this.loading.set(true);
    this.transcription.set(null);
    this.error.set(null);

    try {
      const base64Audio = await this.fileToBase64(file);
      const result = await this.geminiService.transcribeAudio(base64Audio, file.type);
      this.transcription.set(result);

      const textBlob = new Blob([result], { type: 'text/plain' });
      const dataUrl = URL.createObjectURL(textBlob);

      this.downloadService.addFile({
        name: `transcription-${file.name}`,
        type: 'text',
        dataUrl: dataUrl,
      });

    } catch (e) {
      this.error.set('Failed to transcribe audio. Please check the console for details.');
      console.error(e);
    } finally {
      this.loading.set(false);
    }
  }

  copyTranscription() {
    const text = this.transcription();
    if (text) {
      navigator.clipboard.writeText(text);
      // You could add a small notification signal here
    }
  }
}
