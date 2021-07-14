import { Component } from '@angular/core';
import exifr from 'exifr';

import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';

const { Camera, Geolocation } = Plugins;

const options = {
  ifd1: false,
  exif: true,
  interop: false,
  gps: false,
};
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {


    fetch('/assets/test-image.jpg').then((resp) => resp.arrayBuffer()).then(async (ab) => {
      console.log(ab);

      const exif = await exifr.parse(ab, options);
      console.log(exif);
    });

  }


  async takePicture() {
    console.log('take');
    const coordinates = await Geolocation.getCurrentPosition();
    
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      source: CameraSource.Camera,
      resultType: CameraResultType.Base64 //.Uri
    });
    
    console.log('Location', coordinates);

    console.log('exif in image', this.toString(image.exif));

    fetch(image.webPath).then((resp) => resp.arrayBuffer()).then(async (ab) => {
      console.log(ab);

      const exif = await exifr.parse(ab, options);
      console.log('exif in file', this.toString(exif)); 
    });
  }

  async selectPicture() {
    console.log('select');
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      source: CameraSource.Photos,
      resultType: CameraResultType.Uri
    });

    console.log('exif in image', this.toString(image.exif));   
    
    fetch(image.webPath).then((resp) => resp.arrayBuffer()).then(async (ab) => {
      console.log(ab);

      const exif = await exifr.parse(ab, options);
      console.log('exif in file', this.toString(exif)); 
    });
  }

  toString(o: Object): string {
    return JSON.stringify(o, Object.keys(o).sort(), 4);
  }

}
