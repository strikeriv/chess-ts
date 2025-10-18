import { Component, OnInit } from '@angular/core';
import { BoardService } from './services/board.service';
import { Board } from './interfaces/board.interface';
import { CommonModule } from '@angular/common';
import { NotationService } from './services/notation/notation.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule],
  providers: [BoardService, NotationService],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit {
  board: Board = [];

  constructor(private readonly boardService: BoardService) {
    this.board = this.boardService.rotateBoard(this.boardService.constructBoard());

    console.log(this.board);
  }

  ngOnInit() {}
}
