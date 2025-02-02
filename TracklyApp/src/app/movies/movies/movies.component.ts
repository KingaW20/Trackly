import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { ChangeDateFormatToDate } from '../../shared/utils/date-format';
import { ProgramFormComponent } from '../program-form/program-form.component';
import { UserProgramService } from '../../shared/services/movies/user-program.service';
import { UserProgram } from '../../shared/models/movies/user-program.model';
import { Values } from '../../shared/constants';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { MonthYearComponent } from '../../shared/components/month-year/month-year.component';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [ 
    CommonModule, FormsModule,
    PaginationComponent, ProgramFormComponent, MonthYearComponent
  ],
  templateUrl: './movies.component.html',
  styles: ``
})
export class MoviesComponent implements OnInit {

  @ViewChild(ProgramFormComponent) programForm!: ProgramFormComponent;
  isEditing: boolean = false;
  Values = Values
  ready = false;
  
  constructor(
    public upService : UserProgramService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewChecked() {
    if (this.programForm && this.isEditing)
    {
      this.programForm.setImage(this.upService.userProgramFormData.program.image);
      this.cdr.detectChanges();
      this.isEditing = false;
    }
  }

  ngOnInit() {    
    this.upService.refreshList()
  }

  onEdit(selectedRecord : UserProgram, watchAgain: boolean) {
    this.isEditing = true;
    if (!this.upService.programFormShow)
      this.showProgramForm();
        
    this.upService.userProgramFormData = Object.assign({}, selectedRecord)
    this.upService.userProgramFormData.program = Object.assign({}, selectedRecord.program)
    this.upService.userProgramFormData.program.image = Object.assign({}, selectedRecord.program.image)
    if (watchAgain) {
      this.upService.userProgramFormData.date = "";
      this.upService.userProgramFormData.id = 0;
    }
    this.upService.dateForm = ChangeDateFormatToDate(this.upService.userProgramFormData.date)
  }

  onDelete(userProgramId : number) {
    if (confirm("Czy na pewno chcesz usunąć obejrzany program?"))
    {
      this.upService.deleteUserProgram(userProgramId).subscribe({
        next: res => {
          this.upService.updateAllUserPrograms(res as UserProgram[])    // list update
          this.toastr.info('Usunięto pomyślnie', 'Obejrzany program');
        },
        error: err => { console.error(err) }
      })
    }
  }

  getTvSerieText(userProgram: UserProgram) {
    let s = userProgram.program.season < 10 ? "0" + userProgram.program.season : userProgram.program.season;
    let e = userProgram.program.episode < 10 ? "0" + userProgram.program.episode : userProgram.program.episode;
    return "S" + s + "E" + e;
  }

  showProgramForm() {
    this.upService.programFormShow = true;
  }
}
