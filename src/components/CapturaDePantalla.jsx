import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Swal from 'sweetalert2'
import {
  Grid,
  Typography
} from '@mui/material'

const apiKey = process.env.REACT_APP_API_KEY;
const apiName = process.env.REACT_APP_CLOUD_NAME;
const apiSecret = process.env.REACT_APP_API_SECRET;


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
      formData.append('upload_preset', 'capturas');
  
      fetch(`https://api.cloudinary.com/v1_1/${apiName}/auto/upload`, {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          const publicId = data.public_id;
  
          // Eliminación automática después de 48 horas
          const deleteURL = `https://api.cloudinary.com/v1_1/${apiName}/image/destroy`;
  
          const params = {
            public_id: publicId,
            timestamp: Math.round(Date.now() / 1000), // tiempo actual en segundos
            api_key: apiKey, 
            signature: apiSecret 
          };
  
          const deleteOptions = {
            method: 'POST',
            body: new URLSearchParams(params)
          };
  
          // Realizar la solicitud de eliminación después de 48 horas (172800 segundos)
          setTimeout(() => {
            fetch(deleteURL, deleteOptions)
              .then(deleteResponse => deleteResponse.json())
              .then(deleteData => {
                // Verificar si la eliminación fue exitosa
                if (deleteData.result === 'ok') {
                  console.log(`La imagen con public_id '${publicId}' ha sido eliminada de Cloudinary.`);
                } else {
                  console.log(`Error al eliminar la imagen con public_id '${publicId}' de Cloudinary.`);
                }
              })
              .catch(error => {
                console.log(`Error al realizar la eliminación de la imagen con public_id '${publicId}' de Cloudinary:`, error);
              });
          }, 48 * 60 * 60 * 1000); // 48 horas en milisegundos
  
          resolve(data.secure_url);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
  


  const compartirEnWhatsApp = async () => {
    setLoading(true);
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const url = await realizarCapturaDePantalla();
  
    if (url) {
      const mensaje = '¡Acá están los resultados de la división!';
      const texto = `${mensaje} ${url}`;
      const encodedTexto = encodeURIComponent(texto);
      const whatsappURL = `https://api.whatsapp.com/send?text=${encodedTexto}`;
      const whatsappURLMovil = `whatsapp://send?text=${encodedTexto}`;
  
      if (isMobileDevice) {
        // Intentar abrir enlace de WhatsApp en dispositivos móviles
        if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
          // Safari en dispositivos iOS
          if (window.open(whatsappURLMovil, '_blank') == null) {
            // No se pudo abrir el enlace de WhatsApp
            mostrarAlertaManual();
            setLoading(false);
          }
        } else if (navigator.userAgent.match(/Android/i)) {
          // Navegador Android
          if (window.open(whatsappURLMovil, '_blank') == null) {
            // No se pudo abrir el enlace de WhatsApp
            mostrarAlertaManual();
            setLoading(false);
          }
        } else {
          // Otros navegadores móviles
          mostrarAlertaManual();
          setLoading(false);
        }
      } else {
        // Navegador de escritorio
        if (window.open(whatsappURL, '_blank') == null) {
          // No se pudo abrir el enlace de WhatsApp
          mostrarAlertaManual();
          setLoading(false);
        }
      }
    }
  
    setLoading(false);
  };
  
  const mostrarAlertaManual = () => {
    alert("¡Ups! Parece que esta función no es compatible con tu dispositivo. Por favor, comparte la captura de pantalla de manera manual.");
  };
  


  const mostrarAlertaCargando = () => {
    Swal.fire({
      html: 'Cargando...',
      icon: 'success',
      padding: '1rem',
      grow: 'row',
      toast: true,
      position: 'bottom',
      allowEscapeKey: 'false',
      showConfirmButton: false,
      timer: 3000,
      
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


