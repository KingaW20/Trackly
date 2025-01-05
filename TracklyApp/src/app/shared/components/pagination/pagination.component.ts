import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatableService } from '../../services/paginatable.service';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './pagination.component.html',
  styles: ``
})
export class PaginationComponent {
  @Input() service!: PaginatableService;
}
