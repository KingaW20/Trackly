import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { environment } from '../../../../environments/environment';
import { MovieService } from './movie.service';
import { MyImage } from '../../models/image.model';
import { Paginator } from '../../models/paginator.model';
import { Paths, Values } from '../../constants';
import { TvSerieEpisodeService } from './tv-serie-episode.service';
import { TvSerieService } from './tv-serie.service';
import { UserProgram } from '../../models/movies/user-program.model';

@Injectable({
  providedIn: 'root'
})
export class UserProgramService {
  url : string = environment.apiBaseUrl + "/" + Paths.USER_PROGRAM
  allUserPrograms : UserProgram[] = []
  currentUserPrograms : UserProgram[] = []

  paginator : Paginator = new Paginator({pageItemNumber: 12})
  Values = Values

  userProgramFormData : UserProgram = new UserProgram({})
  dateForm : Date | null = null
  formSubmitted : boolean = false
  programFormShow : boolean = false

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    public mService: MovieService,
    public tseService : TvSerieEpisodeService,
    public tvSerieService : TvSerieService
  ) { }

  refreshList() {
    this.http.get(this.url).subscribe({
      next: res => {
        if (res != null) {
          this.allUserPrograms = res as UserProgram[];
          console.log(this.allUserPrograms)
          this.changePage(1)
        }
      },
      error: err => { console.log('Error during geting UserPrograms', err) }
    })
  }

  updateAllUserPrograms(userPrograms: UserProgram[]) {
    this.allUserPrograms = userPrograms
    this.changePage(this.paginator.currentPage)
  }

  changePage(newPage: number) {
    this.paginator.currentPage = newPage
    this.paginator.updatePaginatorInfo(this.allUserPrograms)
    this.currentUserPrograms = this.paginator.getListPart(this.allUserPrograms)
  }

  getUserProgramById(id: number | null) {
    return this.allUserPrograms.find( program => program.id == id );
  }

  findUserProgram(userProgram: UserProgram) {
    if (userProgram.programId == null)
    {
      if (userProgram.isMovie) userProgram.programId = this.mService.findMovieByTitle(userProgram.program.title)?.id ?? 0;
      else {
        let tvSerieId = this.tvSerieService.findTvSerieByTitle(userProgram.program.title)?.id ?? 0;
        userProgram.programId = this.tseService.findTvSerieEpisode(
          tvSerieId, userProgram.program.season, userProgram.program.episode)?.id ?? 0;
      }
    }
    return this.allUserPrograms.find( program => 
      program.programId == userProgram.programId &&
      program.isMovie == userProgram.isMovie &&
      program.date == userProgram.date
    );
  }

  postUserProgram(userProgram: UserProgram) {
    const { program, ...userProgramWithoutProgram } = userProgram;
    return this.http.post(this.url, userProgramWithoutProgram)
  }

  putUserProgram(userProgram: UserProgram) {
    const { program, ...userProgramWithoutProgram } = userProgram;
    return this.http.put(this.url + "/" + userProgramWithoutProgram.id, userProgramWithoutProgram)
  }

  deleteUserProgram(id: number) {
    return this.http.delete(this.url + "/" + id)
  }
  
  resetForm(form?: NgForm) {
    // if (form) form.form.reset();
    this.userProgramFormData = new UserProgram({})
    this.formSubmitted = false
    this.dateForm = null
  }

  handleUserProgram(userProgram: UserProgram, programId: number, form: NgForm) {
    let up = Object.assign({}, userProgram);
    up.programId = programId;

    // check if userProgram with this programId, userId, date and isMovie exists:
    const foundUserProgram = this.findUserProgram(up);
    if (foundUserProgram != null)
    {
      this.refreshList();
      return;    // if userProgram exists do nothing
    }

    const request = up.id == 0 ? this.postUserProgram(up) : this.putUserProgram(up);

    request.subscribe({
      next: res => {
        this.updateAllUserPrograms(res as UserProgram[])    // list update
        this.resetForm(form)
        this.toastr.success(
          up.id == 0 ? 'Dodano pomyślnie' : 'Zmodyfikowano pomyślnie', 
          up.isMovie ? 'Obejrzany film' : 'Obejrzany serial' 
        );
      },
      error: err => { 
        console.log('UserProgram - add or update error', err);
        this.toastr.error(
          up.id == 0 ? 'Nie dodano' : 'Nie zmodyfikowano',
          up.isMovie ? 'Obejrzany film' : 'Obejrzany serial'
        );
      }
    });
  }

  getImageHeight(img : MyImage | null) {
    if (img == null)
      return Values.IMAGE_WIDTH;    
    return Math.min(Values.MAX_IMAGE_HEIGHT, Math.round(Values.IMAGE_WIDTH * img!.height / img!.width));
  }
}
