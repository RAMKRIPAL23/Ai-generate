
import { Injectable, signal, WritableSignal } from '@angular/core';
import { GeneratedFile } from '../models/generated-file.model';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  private files: WritableSignal<GeneratedFile[]> = signal([]);
  public readonly allFiles = this.files.asReadonly();

  addFile(file: Omit<GeneratedFile, 'id' | 'timestamp'>) {
    const newFile: GeneratedFile = {
      ...file,
      id: self.crypto.randomUUID(),
      timestamp: Date.now(),
    };
    this.files.update(currentFiles => [newFile, ...currentFiles]);
  }

  downloadFile(file: GeneratedFile) {
    const link = document.createElement('a');
    link.href = file.dataUrl;

    const extension = this.getFileExtension(file.type, file.dataUrl);
    link.download = `${file.name.replace(/\s+/g, '_')}.${extension}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    if (file.dataUrl.startsWith('blob:')) {
      URL.revokeObjectURL(file.dataUrl);
    }
  }

  private getFileExtension(type: GeneratedFile['type'], dataUrl: string): string {
    switch(type) {
      case 'image':
        const mime = dataUrl.match(/data:(image\/\w+);/);
        return mime ? mime[1].split('/')[1] : 'png';
      case 'video':
        return 'mp4';
      case 'audio':
        return 'mp3';
      case 'text':
        return 'txt';
      default:
        return 'bin';
    }
  }
}
