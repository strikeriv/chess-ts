import { Component, computed, input, output } from '@angular/core';
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

  handlePieceSelection = output<Piece>();

  p = computed(() => this.piece());

  constructor() {}

  onPieceClick() {
    this.handlePieceSelection.emit(this.p());
  }
}
