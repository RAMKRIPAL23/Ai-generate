
export interface GeneratedFile {
  id: string;
  name: string;
  type: 'video' | 'image' | 'audio' | 'text';
  dataUrl: string; // Base64 data URL, blob URL, or text content
  prompt?: string;
  timestamp: number;
}
