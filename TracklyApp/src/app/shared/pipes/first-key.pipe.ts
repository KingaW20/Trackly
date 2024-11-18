import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstKey',
  standalone: true
})
export class FirstKeyPipe implements PipeTransform {

  transform(value: any): string | null {
    const keys = Object.keys(value);

    //To show only first info ie. when password not valid
    if (keys && keys.length > 0)
      return keys[0];
    
    return null;
  }

}
