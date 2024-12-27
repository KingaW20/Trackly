import { Component, Input } from '@angular/core';
import { PaginatableService } from '../shared/services/paginatable.service';
import { CommonModule } from '@angular/common';

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
