
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../services/gemini.service';
import { DownloadService } from '../../services/download.service';
import { ApiKeyWarningComponent } from '../shared/api-key-warning.component';
import { LoaderComponent } from '../shared/loader.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-text-to-video',
  templateUrl: './text-to-video.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ApiKeyWarningComponent, LoaderComponent],
})
export class TextToVideoComponent {
  private geminiService = inject(GeminiService);
  private downloadService = inject(DownloadService);
  private sanitizer = inject(DomSanitizer);

  prompt = signal('A cinematic shot of a majestic lion walking on a beach at sunset.');
  loading = signal(false);
  progressMessage = signal('');
  videoUrl = signal<string | null>(null);
  safeVideoUrl = signal<SafeUrl | null>(null);
  error = signal<string | null>(null);
  isApiKeyValid = this.geminiService.apiKeyStatus;

  async generateVideo() {
    if (!this.prompt().trim() || this.isApiKeyValid() !== 'valid') return;
    
    this.loading.set(true);
    this.videoUrl.set(null);
    this.safeVideoUrl.set(null);
    this.error.set(null);
    this.progressMessage.set('');

    const currentPrompt = this.prompt();

    try {
      const generatedVideoUrl = await this.geminiService.generateVideo(currentPrompt, (msg) => {
        this.progressMessage.set(msg);
      });
      this.videoUrl.set(generatedVideoUrl);
      this.safeVideoUrl.set(this.sanitizer.bypassSecurityTrustUrl(generatedVideoUrl));

      this.downloadService.addFile({
        name: `video-${currentPrompt.substring(0, 20)}`,
        type: 'video',
        dataUrl: generatedVideoUrl,
        prompt: currentPrompt,
      });

    } catch (e) {
      this.error.set('Failed to generate video. Please check the console for details.');
      console.error(e);
    } finally {
      this.loading.set(false);
    }
  }

  downloadVideo() {
    const url = this.videoUrl();
    const currentPrompt = this.prompt();
    if (url) {
      this.downloadService.downloadFile({
        id: '',
        name: `video-${currentPrompt.substring(0, 20)}`,
        type: 'video',
        dataUrl: url,
        timestamp: 0,
        prompt: currentPrompt,
      });
    }
  }
}
