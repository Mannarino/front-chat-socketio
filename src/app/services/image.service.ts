import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private imageSource = new Subject<{ nombre: string, imageUrl: string }>(); // Inicialmente no hay imagen
  public image$ = this.imageSource.asObservable();

  public updateImage(nombre:string,imageUrl: string) {
    let data={
     nombre,
     imageUrl
    }
    this.imageSource.next(data);
  }
}