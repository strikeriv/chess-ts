import { Component, computed, input } from '@angular/core';
import { Piece } from '../models/pieces/piece.model';

@Component({
  selector: 'board-piece',
  standalone: true,
  imports: [],
  templateUrl: './piece.component.html',
  styleUrl: './piece.component.scss',
})
export class PieceComponent {
  piece = input.required<Piece>();

  p = computed(() => this.piece());
}
