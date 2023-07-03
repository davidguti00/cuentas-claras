import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Swal from 'sweetalert2'
import {
  Grid,
  Typography
} from '@mui/material'


const CapturaDePantalla = () => {
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  

  const realizarCapturaDePantalla = async () => {
    try {
      
      const canvas = await html2canvas(document.body);
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/png');
      });
      const url = await subirImagenACloudinary(blob);
      return url;
    } catch (error) {
      console.log('Error al realizar la captura de pantalla:', error);
      
      return null;
    }
  };


  const subirImagenACloudinary = (archivo) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', archivo);
      formData.append('upload_preset','capturas');

      fetch('https://api.cloudinary.com/v1_1/ducykb8gg/auto/upload', {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          resolve(data.secure_url);
        })
        .catch(error => {
          reject(error);
        });
    });
  };


  const compartirEnWhatsApp = async () => {
    setLoading(true);
    const url = await realizarCapturaDePantalla();
    if (url) {
      const mensaje = '¡Aca están los resultados de la division!';
      const texto = `${mensaje} ${url}`;
      const encodedTexto = encodeURIComponent(texto);
      const whatsappURL = `https://api.whatsapp.com/send?text=${encodedTexto}`;

      window.open(whatsappURL, '_blank');
    }
    setLoading(false);
  };

  const mostrarAlertaCargando = () => {
    Swal.fire({
      html: 'Cargando...',
      icon: 'success',
      padding: '1rem',
      grow: 'row',
      toast: true,
      position: 'bottom',
      allowOutsideClick: 'false',
      allowEscapeKey: 'false',
      showConfirmButton: false,
      timer: 4000,
      
    });
  };

  const descargarCaptura = async () => {
    setDownloading(true);
    const url = await realizarCapturaDePantalla();
    if (url) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();

        // Generar un enlace de descarga para la captura
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'captura.png';
        link.click();
      } catch (error) {
        console.log('Error al descargar la captura:', error);
      }
    }
    setDownloading(false);
  };

  const mostrarAlertaDescarga = () => {
    Swal.fire({
      html: 'Descargando...',
      icon: 'success',
      padding: '1rem',
      grow: 'row',
      toast: true,
      position: 'bottom',
      allowOutsideClick: 'false',
      allowEscapeKey: 'false',
      showConfirmButton: false,
      timer: 3000,
      
    });
  };

  
  return (
    <Grid container xs={12} justifyContent="center" marginTop={"15px"}>
      <Grid container item xs={4} direction="column" justifyContent="center"  alignItems="center" sx={{ marginBottom:"20px"}}>
        <WhatsAppIcon sx={{fontSize: 28, cursor: "pointer", marginTop: 0.90, color:'#1693a5'}}  onClick={compartirEnWhatsApp} />
          <Typography color="textSecondary" variant="body3">
              Compartir
          </Typography>
      </Grid>
      <Grid container item xs={4} direction="column" justifyContent="center"  alignItems="center" sx={{ marginBottom:"20px"}}>
        <CloudDownloadIcon sx={{fontSize: 28, cursor: "pointer", marginTop: 0.90, color:'#1693a5'}} onClick={descargarCaptura} />
          <Typography color="textSecondary" variant="body3">
              Descargar
          </Typography>
      </Grid>
      <Grid  xs={12}>
      {loading && mostrarAlertaCargando()}

        
      {downloading && mostrarAlertaDescarga()}
      </Grid>
      
    </Grid>
  );
};

export default CapturaDePantalla;


