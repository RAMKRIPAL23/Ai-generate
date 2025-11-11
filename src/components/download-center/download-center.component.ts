
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadService } from '../../services/download.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { GeneratedFile } from '../../models/generated-file.model';

interface DisplayFile extends GeneratedFile {
  safeUrl: SafeUrl | null;
}

@Component({
  selector: 'app-download-center',
  templateUrl: './download-center.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class DownloadCenterComponent {
  downloadService = inject(DownloadService);
  private sanitizer = inject(DomSanitizer);

  files = computed(() => {
    return this.downloadService.allFiles().map(file => ({
      ...file,
      safeUrl: this.createSafeUrl(file)
    }));
  });

  private createSafeUrl(file: GeneratedFile): SafeUrl | null {
    if (file.type === 'image' || file.type === 'video' || file.type === 'audio') {
      return this.sanitizer.bypassSecurityTrustUrl(file.dataUrl);
    }
    return null;
  }
}
