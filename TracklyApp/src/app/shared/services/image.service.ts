import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subject } from 'rxjs';

import { environment } from '../../../environments/environment';
import { MyImage } from '../models/image.model';
import { Paths } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  url : string = environment.apiBaseUrl + "/" + Paths.IMAGE
  images : MyImage[] = []

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  refreshList() {
    this.http.get(this.url).subscribe({
      next: res => { this.images = res as MyImage[]; },
      error: err => { console.log(err) }
    })
  }
  
  getImageById(id: number | null) {
    const img = this.images.find( img => img.id == id );
    return img ? img : null;
  }

  findImage(name: string, ext: string, bytes: string) : MyImage | null {
    const img = this.images.find( 
      img => img.name == name && img.fileExtension == ext && img.bytes == bytes );
    return img ? img : null;
  }
  
  postImage(image: MyImage) {
    return this.http.post(this.url, image)
  }
  
  putImage(image: MyImage) {
    return this.http.put(this.url + "/" + image.id, image)
  }
  
  deleteImage(id: number) {
    return this.http.delete(this.url + "/" + id)
  }

  onAddNewImage(image: MyImage | null) : Observable<number | null> {
    const subject = new Subject<number | null>();
    
    if (image == null)
      return of (null);
    else 
    {
      const img = this.findImage(image.name, image.fileExtension, image.bytes);
      if (img != null) {
        console.log("Obraz istnieje", img.id);
        return of(img.id);            // works like subject.next(img.id); but it doesn't work in this case
      } else {
        this.postImage(image).subscribe({
          next: res => {
            this.images = res as MyImage[];
            this.toastr.success('Dodano nowy obraz: ' + image.name, 'Nowy obraz');
            const foundImage = this.findImage(image.name, image.fileExtension, image.bytes);
            if (foundImage != null) subject.next(foundImage.id);
            else this.toastr.error('Nie znaleziono obrazu', 'Obraz');
            subject.complete();
          },
          error: err => {
            if (err.status == 400)
            {
              this.toastr.error(err.error.message, "Nie dodano nowego obrazu")
              console.log('Error during adding new image:\n', err)
            }
            else
              console.log('Error during adding new image:\n', err)
            subject.complete();
          }
        })
      }      
    }

    return subject.asObservable();
  }
}
