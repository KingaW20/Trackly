import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, ReplaySubject } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Paths } from '../../constants';
import { Program } from '../../models/movies/program.model';
import { TvSerie } from '../../models/movies/tv-serie.model';
import { TvSerieEpisode } from '../../models/movies/tv-serie-episode.model';
import { TvSerieService } from './tv-serie.service';

@Injectable({
  providedIn: 'root'
})
export class TvSerieEpisodeService {

  url : string = environment.apiBaseUrl + "/" + Paths.TV_SERIE_EPISODE
  tvSerieEpisodes : TvSerieEpisode[] = []

  constructor(
    private http: HttpClient,
    private tvSerieService: TvSerieService,
    private toastr: ToastrService
  ) { }

  refreshList() {
    this.http.get(this.url).subscribe({
      next: res => { this.tvSerieEpisodes = res as TvSerieEpisode[]; },
      error: err => { console.error('Error during geting TvSerieEpisodes', err) }
    })
  }

  getTvSerieEpisodeById(id: number | null) {
    return this.tvSerieEpisodes.find( tse => tse.id == id );
  }

  findTvSerieEpisode(tvSerieId: number, season: number, episode: number) : TvSerieEpisode | null {
    return this.tvSerieEpisodes.find( tse => 
      tse.tvSerieId == tvSerieId && tse.episode == episode && tse.season == season ) ?? null;
  }

  getTvSerieEpisodeAverageTime(title: string, season: number, episode: number) : number {
    let ts = this.tvSerieService.findTvSerieByTitle(title);
    if (ts == null) return 0;
    
    let tse = this.tvSerieEpisodes.filter(
      tse => tse.tvSerieId == ts.id && 
      (season == 0 || 
        (episode == 0 && tse.season == season) || 
        (tse.season == season && tse.episode == episode))
      );
    return  tse.length > 0 ? Math.round(tse.reduce((sum, obj) => sum + obj.time, 0) / tse.length) : 0;
  }

  postTvSerieEpisode(tvSerieEpisode: TvSerieEpisode) {
    const { tvSerie, ...tvSerieEpisodeWithoutTvSerie } = tvSerieEpisode;
    return this.http.post(this.url, tvSerieEpisodeWithoutTvSerie)
  }

  putTvSerieEpisode(tvSerieEpisode: TvSerieEpisode) {
    const { tvSerie, ...tvSerieEpisodeWithoutTvSerie } = tvSerieEpisode;
    return this.http.put(this.url + "/" + tvSerieEpisodeWithoutTvSerie.id, tvSerieEpisodeWithoutTvSerie)
  }

  deleteTvSerieEpisode(id: number) {
    return this.http.delete(this.url + "/" + id)
  }

  handleTvSerieEpisode(program: Program) : Observable<number> {  
    const tvSerieEpisode = new TvSerieEpisode(program);    
    const subject = new ReplaySubject<number>(1);

    const updateTvSerieEpisodeList = (res: any, add: boolean, tse: TvSerieEpisode) => {
      this.tvSerieEpisodes = res as TvSerieEpisode[];    // list update
      let successMessage = add ? 'Dodano pomyślnie' : 'Zmodyfikowano pomyślnie';
      this.toastr.success(successMessage, 'Odcinek serialu'); 
    
      const foundTvSerieEpisode = this.findTvSerieEpisode(tse.tvSerieId!, tse.season, tse.episode);
      if (foundTvSerieEpisode != null) subject.next(foundTvSerieEpisode.id);
      else this.toastr.error('Nie znaleziono odcinka serialu', 'Odcinek serialu');
      subject.complete();
    }
      
    const handleError = (err: any, add: boolean) => {
      subject.error(err);
      subject.complete();
      let toastrMessage = add ? 'Nie udało się dodać' : 'Nie udało się zmodyfikować';
      this.toastr.error(toastrMessage, 'Odcinek serialu');
    }

    const tvSerie = new TvSerie(program);
    this.tvSerieService.handleTvSerie(tvSerie).subscribe({
      next: tvSerieId => { 
        tvSerieEpisode.tvSerieId = tvSerieId;
        let foundTvSerieEpisode = this.findTvSerieEpisode(tvSerieId, tvSerieEpisode.season, tvSerieEpisode.episode);
        if (foundTvSerieEpisode != null && tvSerieEpisode.equals(foundTvSerieEpisode))
        {
          subject.next(foundTvSerieEpisode.id);       // if tvSerieEpisode exists return relevant id
          subject.complete();
        }
        else
        {
          if (foundTvSerieEpisode) tvSerieEpisode.id = foundTvSerieEpisode.id;       // if we want to choose another existing tvSerieEpisode, we have to set the id 
          const request = foundTvSerieEpisode == null ? 
            this.postTvSerieEpisode(tvSerieEpisode) : this.putTvSerieEpisode(tvSerieEpisode);
          const tse = tvSerieEpisode;
          request.subscribe({
            next: res => updateTvSerieEpisodeList(res, tvSerieEpisode.id == 0, tse),
            error: err => handleError(err, tvSerieEpisode.id == 0)
          })
        }
      },
      error: err => {
        subject.error(err);
        subject.complete();
        if (tvSerie.id == 0) console.error('Tv serie episode not added because of the error during tv serie adding')
        else console.error('Tv serie episode not added because of the error during tv serie updating') 
      }
    });
  
    return subject.asObservable();
  }
}
