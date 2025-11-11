
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TextToImageComponent } from './components/text-to-image/text-to-image.component';
import { TextToVideoComponent } from './components/text-to-video/text-to-video.component';
import { AudioTranscriptionComponent } from './components/audio-transcription/audio-transcription.component';
import { VideoToAudioComponent } from './components/video-to-audio/video-to-audio.component';
import { DownloadCenterComponent } from './components/download-center/download-center.component';

type Tool = 'text-to-video' | 'text-to-image' | 'video-to-audio' | 'audio-transcription' | 'download-center';

interface NavItem {
  id: Tool;
  name: string;
  icon: string; // SVG path data
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TextToImageComponent,
    TextToVideoComponent,
    AudioTranscriptionComponent,
    VideoToAudioComponent,
    DownloadCenterComponent
  ],
})
export class AppComponent {
  selectedTool = signal<Tool>('text-to-image');
  isSidebarOpen = signal(false);

  navItems: NavItem[] = [
    { id: 'text-to-image', name: 'Text to Image', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'text-to-video', name: 'Text to Video', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { id: 'audio-transcription', name: 'Audio Transcription', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
    { id: 'video-to-audio', name: 'Video to Audio', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 6l12-3' },
    { id: 'download-center', name: 'Download Center', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' },
  ];

  selectTool(tool: Tool) {
    this.selectedTool.set(tool);
    this.isSidebarOpen.set(false);
  }

  toggleSidebar() {
    this.isSidebarOpen.update(open => !open);
  }
}
