import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, ReplaySubject } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Paths } from '../../constants';
import { TvSerie } from '../../models/movies/tv-serie.model';

@Injectable({
  providedIn: 'root'
})
export class TvSerieService {

  url : string = environment.apiBaseUrl + "/" + Paths.TV_SERIE
  tvSeries : TvSerie[] = []

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  refreshList() {
    this.http.get(this.url).subscribe({
      next: res => { this.tvSeries = res as TvSerie[]; },
      error: err => { console.log('Error during geting TvSeries', err) }
    })
  }

  getTvSerieById(id: number | null) {
    return this.tvSeries.find( ts => ts.id == id );
  }

  findTvSerieByTitle(title: string) : TvSerie | null {
    return this.tvSeries.find( ts => ts.title == title ) ?? null;
  }

  postTvSerie(tvSerie: TvSerie) {
    const { image, ...tvSerieWithoutImage } = tvSerie;
    return this.http.post(this.url, tvSerieWithoutImage)
  }

  putTvSerie(tvSerie: TvSerie) {
    const { image, ...tvSerieWithoutImage } = tvSerie;
    return this.http.put(this.url + "/" + tvSerieWithoutImage.id, tvSerieWithoutImage)
  }

  deleteTvSerie(id: number) {
    return this.http.delete(this.url + "/" + id)
  }

  handleTvSerie(tvSerie: TvSerie) : Observable<number> {
    const subject = new ReplaySubject<number>(1);
  
    const updateTvSerieList = (res: any, add: boolean, programTitle: string) => {
      this.tvSeries = res as TvSerie[];    // list update
      let successMessage = add ? 'Dodano pomyślnie' : 'Zmodyfikowano pomyślnie';
      this.toastr.success(successMessage, 'Serial'); 
    
      const foundTvSerie = this.findTvSerieByTitle(programTitle);
      if (foundTvSerie != null) subject.next(foundTvSerie.id);
      else this.toastr.error('Nie znaleziono serialu', 'Serial');
      subject.complete();
    }
  
    const handleError = (err: any, add: boolean) => {
      subject.error(err);
      subject.complete();
        
      if (err.status == 400) 
        this.toastr.error(err.error.value.error, "Serial")
      else {
        let toastrMessage = add ? 'Nie udało się dodać' : 'Nie udało się zmodyfikować';
        this.toastr.error(toastrMessage, 'Serial');
      }
    }  

    // check if tvSerie with this title exists:
    const foundTvSerie = this.findTvSerieByTitle(tvSerie.title);
    if (foundTvSerie != null && tvSerie.equals(foundTvSerie))
    {
      subject.next(foundTvSerie.id);       // if tvSerie exists return relevant id
      subject.complete();
      return subject.asObservable();
    }
    else if (foundTvSerie != null)
      tvSerie.id = foundTvSerie.id;       // if we want to choose another existing tvSerie, we have to set the id 

    const request = foundTvSerie == null ? this.postTvSerie(tvSerie) : this.putTvSerie(tvSerie);  
    const title = tvSerie.title
    request.subscribe({
      next: res => updateTvSerieList(res, tvSerie.id == 0, title),
      error: err => handleError(err, tvSerie.id == 0)
    });
  
    return subject.asObservable();
  }
}
