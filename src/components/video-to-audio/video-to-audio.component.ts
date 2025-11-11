
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DownloadService } from '../../services/download.service';
import { LoaderComponent } from '../shared/loader.component';

@Component({
  selector: 'app-video-to-audio',
  templateUrl: './video-to-audio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoaderComponent],
})
export class VideoToAudioComponent {
  private downloadService = inject(DownloadService);

  selectedFile = signal<File | null>(null);
  loading = signal(false);
  audioUrl = signal<string | null>(null);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
      this.audioUrl.set(null);
    }
  }

  extractAudio() {
    if (!this.selectedFile()) return;
    this.loading.set(true);
    this.audioUrl.set(null);

    // Simulate a server-side process
    setTimeout(() => {
      // In a real app, you would upload the video and get back an audio URL.
      // Here, we use a placeholder audio.
      const placeholderAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
      
      this.downloadService.addFile({
          name: `audio-from-${this.selectedFile()?.name}`,
          type: 'audio',
          dataUrl: placeholderAudioUrl
      });
      
      this.audioUrl.set(placeholderAudioUrl);
      this.loading.set(false);
    }, 3000);
  }

  downloadAudio() {
      const url = this.audioUrl();
      if(url) {
          // Use a proxy or direct download if CORS allows, otherwise, it might not work.
          // For simplicity, we create a link.
          const a = document.createElement('a');
          a.href = url;
          a.target = '_blank';
          a.download = `extracted_audio_from_${this.selectedFile()?.name}.mp3`;
          a.click();
      }
  }
}
