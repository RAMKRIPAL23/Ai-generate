
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../services/gemini.service';
import { DownloadService } from '../../services/download.service';
import { ApiKeyWarningComponent } from '../shared/api-key-warning.component';
import { LoaderComponent } from '../shared/loader.component';

@Component({
  selector: 'app-text-to-image',
  templateUrl: './text-to-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ApiKeyWarningComponent, LoaderComponent],
})
export class TextToImageComponent {
  private geminiService = inject(GeminiService);
  private downloadService = inject(DownloadService);

  prompt = signal('A futuristic cityscape at sunset, with flying cars and neon lights, hyperrealistic.');
  loading = signal(false);
  imageUrl = signal<string | null>(null);
  error = signal<string | null>(null);
  isApiKeyValid = this.geminiService.apiKeyStatus;

  async generateImage() {
    if (!this.prompt().trim() || this.isApiKeyValid() !== 'valid') return;
    this.loading.set(true);
    this.imageUrl.set(null);
    this.error.set(null);

    const currentPrompt = this.prompt();

    try {
      const generatedImageUrl = await this.geminiService.generateImage(currentPrompt);
      this.imageUrl.set(generatedImageUrl);
      this.downloadService.addFile({
        name: `image-${currentPrompt.substring(0, 20)}`,
        type: 'image',
        dataUrl: generatedImageUrl,
        prompt: currentPrompt,
      });
    } catch (e) {
      this.error.set('Failed to generate image. Please check the console for details.');
      console.error(e);
    } finally {
      this.loading.set(false);
    }
  }

  downloadImage() {
    const url = this.imageUrl();
    const currentPrompt = this.prompt();
    if (url) {
      this.downloadService.downloadFile({
        id: '',
        name: `image-${currentPrompt.substring(0, 20)}`,
        type: 'image',
        dataUrl: url,
        timestamp: 0,
        prompt: currentPrompt
      });
    }
  }
}
