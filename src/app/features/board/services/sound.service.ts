import { Injectable } from '@angular/core';
import { Sounds } from '../interfaces/sound.interface';

@Injectable()
export class SoundService {
  constructor() {}

  playSound(sound: Sounds): void {
    const audio = new Audio(`assets/sounds/${sound}`);

    audio.load();
    audio.play().catch((error) => {
      console.error('Failed to play specific sound:', error);
    });
  }
}
