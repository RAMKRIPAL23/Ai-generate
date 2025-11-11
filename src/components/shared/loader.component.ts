
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loader',
  imports: [],
  template: `
    <div class="flex flex-col items-center justify-center gap-4 text-center">
        <div class="w-12 h-12 border-4 border-t-purple-400 border-gray-600 rounded-full animate-spin"></div>
        <p class="text-purple-300 font-medium">{{ message() }}</p>
    </div>
  `,
})
export class LoaderComponent {
  message = input<string>('Processing...');
}
