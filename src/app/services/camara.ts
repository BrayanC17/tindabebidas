import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CamaraService {
  async tomarFoto(): Promise<string> {
    const foto = await Camera.getPhoto({
      quality: 70,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });

    return `data:image/jpeg;base64,${foto.base64String}`;
  }
}
