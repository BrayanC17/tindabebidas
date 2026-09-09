export function archivoABase64Comprimido(archivo: File, maxAncho = 800, calidad = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();

    lector.onload = (evento) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let ancho = img.width;
        let alto = img.height;

        if (ancho > maxAncho) {
          alto = (alto * maxAncho) / ancho;
          ancho = maxAncho;
        }

        canvas.width = ancho;
        canvas.height = alto;

        const contexto = canvas.getContext('2d');
        contexto?.drawImage(img, 0, 0, ancho, alto);

        const base64 = canvas.toDataURL('image/jpeg', calidad);
        resolve(base64);
      };

      img.onerror = reject;
      img.src = evento.target?.result as string;
    };

    lector.onerror = reject;
    lector.readAsDataURL(archivo);
  });
}
