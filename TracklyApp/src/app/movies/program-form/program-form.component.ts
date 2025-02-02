import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';

import { ChangeDateFormatToString } from '../../shared/utils/date-format';
import { ImageService } from '../../shared/services/image.service';
import { MovieService } from '../../shared/services/movies/movie.service';
import { MyImage } from '../../shared/models/image.model';
import { TvSerieEpisodeService } from '../../shared/services/movies/tv-serie-episode.service';
import { TvSerieService } from '../../shared/services/movies/tv-serie.service';
import { UserProgramService } from '../../shared/services/movies/user-program.service';
import { Values } from '../../shared/constants';

@Component({
  selector: 'app-program-form',
  standalone: true,
  imports: [ 
    CommonModule, FormsModule, MatAutocompleteModule,
    MatDatepickerModule, MatFormFieldModule, MatInputModule
  ],
  templateUrl: './program-form.component.html',
  styles: ``,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pl-PL' },
    provideNativeDateAdapter()
  ]
})
export class ProgramFormComponent {

  Values = Values
  imageUrl : string = "/default_upload2.png"
  titlesList: string[] = [];
  showTitlesList = false;
  selectedFileName: string | null = null;

  @ViewChild('form') form?: NgForm;

  constructor(
    public upService: UserProgramService,
    public tvSerieEpisodeService: TvSerieEpisodeService,
    public tvSerieService: TvSerieService,
    public mService: MovieService,
    public imgService: ImageService,
    private toastr: ToastrService
  ){ }

  ngOnInit() {
    this.imgService.refreshList();
    this.mService.refreshList();
    this.tvSerieService.refreshList();
    this.tvSerieEpisodeService.refreshList();
  }

  onDateChange(event: Date | null): void {
    if (event)
      this.upService.userProgramFormData.date = ChangeDateFormatToString(event)
    else 
      this.upService.userProgramFormData.date = '';
    // console.log('Date changed', this.upService.userProgramFormData.date)
  }

  clearForm(): void {
    this.upService.resetForm(this.form);
    this.imageUrl = "/default_upload2.png";
  }

  onUploadFile(event: Event) {
    this.upService.userProgramFormData.program.image = new MyImage();
    this.upService.userProgramFormData.program.image!.uploadFile(event)
      .then((url: string) => {
        // console.log("Uploaded image", this.upService.userProgramFormData.program.image);
        this.imageUrl = url || "/default_upload2.png";
        this.selectedFileName = this.upService.userProgramFormData.program.image!.name;
      })
      .catch((err) => {
        console.error("File upload error:", err);
        this.imageUrl = "/default_upload2.png";
        this.selectedFileName = null;
      })
  }

  filterTitles(): void {
    const isMovie = this.upService.userProgramFormData.isMovie;
    const titles = isMovie ? this.upService.movieTitles : this.upService.tvSerieTitles;
    const inputValue = this.upService.userProgramFormData.program.title.toLowerCase();

    this.titlesList = titles.filter(title => 
      title.toLowerCase().includes(inputValue)
    );
    this.showTitlesList = this.titlesList.length > 0;
  }

  hideList(): void {
    setTimeout(() => {
      this.showTitlesList = false;
      this.titlesList = [];
    }, 200);
  }

  onTitleClick(title: string): void {
    this.upService.userProgramFormData.program.title = title;
    this.updateData();
  }

  updateData() {
    const up = this.upService.userProgramFormData;
    if (up.isMovie) {
      let movie = this.mService.findMovieByTitle(up.program.title);
      this.upService.userProgramFormData.program.time = movie?.time ?? up.program.time;
      this.setImage(movie?.image);
    } else {
      let tvSerie = this.tvSerieService.findTvSerieByTitle(up.program.title);
      let time = this.tvSerieEpisodeService.getTvSerieEpisodeAverageTime(up.program.title, up.program.season, up.program.episode);
      this.upService.userProgramFormData.program.time = time != 0 ? time : this.upService.userProgramFormData.program.time;
      this.setImage(tvSerie?.image);
    }
  }

  setImage(img: MyImage | null | undefined) {
    this.upService.userProgramFormData.program.imageId = img?.id ?? this.upService.userProgramFormData.program.imageId;
    this.upService.userProgramFormData.program.image = img ?? this.upService.userProgramFormData.program.image;
    this.imageUrl = img?.source ?? this.upService.userProgramFormData.program.image?.source ?? "/default_upload2.png";
    this.selectedFileName = this.upService.userProgramFormData.program.image?.name ?? null;
  }

  onSubmit(form: NgForm) {
    this.upService.formSubmitted = true
    const userProgram = Object.assign({}, this.upService.userProgramFormData);
    const program = Object.assign({}, this.upService.userProgramFormData.program);

    if (form.valid) {
      this.imgService.onAddNewImage(program.image).subscribe({
        next: imageId => {
          program.imageId = imageId;

          if (userProgram.programId == 0 && this.upService.findUserProgram(userProgram) != null)
            return;

          const request = userProgram.isMovie ?
            this.mService.handleMovie(program) :
            this.tvSerieEpisodeService.handleTvSerieEpisode(program)

          request.subscribe({
            next: programId => { 
              if (programId != 0)
                this.upService.handleUserProgram(userProgram, programId, form)
            },
            error: err => { 
              if (err.status == 400)
                this.toastr.error(err.error.value.error, userProgram.isMovie ? "Film" : "Serial")
              else
                console.error('Error during adding/updating ' + userProgram.isMovie ? "movie" : "tv serie episode" + ':\n', err)
            }
          });
        },
        error: err => {
          console.error('Error during adding image:\n', err)
        }
      });
      
      this.closeForm();      
    }
  }

  closeForm() {
    this.clearForm()
    this.upService.programFormShow = !this.upService.programFormShow
  }
}
