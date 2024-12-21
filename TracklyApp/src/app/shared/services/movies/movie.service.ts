import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subject } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Movie } from '../../models/movies/movie.model';
import { Paths } from '../../constants';
import { Program } from '../../models/movies/program.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  url : string = environment.apiBaseUrl + "/" + Paths.MOVIE
  movies : Movie[] = []

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  refreshList() {
    this.http.get(this.url).subscribe({
      next: res => { this.movies = res as Movie[]; },
      error: err => { console.log('Error during geting Movies', err) }
    })
  }

  getMovieById(id: number | null) {
    return this.movies.find( m => m.id == id );
  }

  findMovieByTitle(title: string) : Movie | null {
    return this.movies.find( m => m.title == title) ?? null;
  }

  postMovie(movie: Movie) {
    const { image, ...movieWithoutImage } = movie;
    return this.http.post(this.url, movieWithoutImage)
  }

  putMovie(movie: Movie) {
    const { image, ...movieWithoutImage } = movie;
    return this.http.put(this.url + "/" + movieWithoutImage.id, movieWithoutImage)
  }

  deleteMovie(id: number) {
    return this.http.delete(this.url + "/" + id)
  }

  handleMovie(program: Program) : Observable<number> {  
    const movie = new Movie(program);
    const subject = new Subject<number>();

    const updateMovieList = (res: any, add: boolean, programTitle: string) => {
      this.movies = res as Movie[];    // list update
      let successMessage = add ? 'Dodano pomyślnie' : 'Zmodyfikowano pomyślnie';
      this.toastr.success(successMessage, 'Film'); 

      const foundMovie = this.findMovieByTitle(programTitle);
      if (foundMovie != null) subject.next(foundMovie.id);
      else this.toastr.error('Nie znaleziono filmu', 'Film');
      subject.complete();
    }

    const handleError = (err: any) => {
      subject.error(err);
      subject.complete();
    }

    // check if movie with this title exists:
    const foundMovie = this.findMovieByTitle(movie.title);
    if (foundMovie != null && movie.equals(foundMovie))
      return of(foundMovie.id);       // if movie exists return relevant id
    else if (foundMovie != null)
      movie.id = foundMovie.id;       // if we want to choose another existing movie, we have to set the id 

    const request = foundMovie == null ? this.postMovie(movie) : this.putMovie(movie);
    const title = movie.title;
    request.subscribe({
      next: res => updateMovieList(res, foundMovie == null, title),
      error: err => handleError(err)
    });

    return subject.asObservable();
  }
}