import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Swal from 'sweetalert2'
import { Grid,Typography} from '@mui/material'

const apiKey = process.env.REACT_APP_API_KEY;
const apiName = process.env.REACT_APP_CLOUD_NAME;
const apiSecret = process.env.REACT_APP_API_SECRET;


const CapturaDePantalla = () => {
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);


  // const compartirViaWhatsapp = async () => {
  //   setLoading(true);
  //   const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  //   const url = await capturarYCompartir();
  //   const container = document.getElementById('capturable-element');
  
  //   try {
  //     const canvas = await html2canvas(container);
  //     await new Promise(resolve => {
  //       canvas.toBlob(resolve);
  //     });

  //     if (url) {
  //       const mensaje = '¡Acá están los resultados de la división!';
  //       const texto = `${mensaje} ${url}`;
  //       const whatsappMessage = encodeURIComponent(texto);
  //       const whatsappURL = `https://api.whatsapp.com/send?text=${whatsappMessage}`;

  //       if (isMobileDevice){
  //         if(window.open(whatsappURL, '_blank')== null) mostrarAlertaError()
  //           window.open(whatsappURL, '_blank');
  //       }else{
  //         window.open(whatsappURL, '_blank');
  //       }
        
  //     }
  //   } catch (error) {
  //     console.log('Error al capturar y compartir:', error);
  //   }

  //   setLoading(false);
  // };

  const compartirViaWhatsapp = async () => {
    setLoading(true);
    
    const url = await capturarYCompartir();
    const container = document.getElementById('capturable-element');
  
    try {
      const canvas = await html2canvas(container);
      await new Promise(resolve => {
        canvas.toBlob(resolve);
      });
  
      if (url) {
        const mensaje = '¡Acá están los resultados de la división!';
        const texto = `${mensaje} ${url}`;
        const whatsappMessage = encodeURIComponent(texto);
        const whatsappURL = `https://api.whatsapp.com/send?text=${whatsappMessage}`;
  
        const newWindow = window.open(whatsappURL, '_blank');
        
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
          mostrarAlertaError();
        }
      }
    } catch (error) {
      console.log('Error al capturar y compartir:', error);
    }
  
    setLoading(false);
  };
  
  
  const capturarYGuardar = async () => {
    setDownloading(true);
    const container = document.getElementById('capturable-element'); 
    try {
      const canvas = await html2canvas(container);
      const blob = await new Promise(resolve => {
        canvas.toBlob(resolve);
      });
      saveAs(blob, 'captura_cuentas_claras.png');
      const url = await subirImagenACloudinary(blob);
      return url;
    } catch (error) {
      console.log('Error al capturar y guardar:', error);
    }
    setDownloading(false);
  };

  const capturarYCompartir = async () => {
    const container = document.getElementById('capturable-element'); 
    try {
      const canvas = await html2canvas(container);
      const blob = await new Promise(resolve => {
        canvas.toBlob(resolve);
      });
      const url = await subirImagenACloudinary(blob);
      return url;
    } catch (error) {
      console.log('Error al capturar y guardar:', error);
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
  
  const mostrarAlertaCargando = () => {
    Swal.fire({
      html: 'Aguarda unos segundos se esta generando el enlace de la captura...',
      icon: 'success',
      padding: '1rem',
      grow: 'row',
      toast: true,
      position: 'bottom',
      allowEscapeKey: 'false',
      showConfirmButton: false,
      timer: 4000,
      
    });
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

  const mostrarAlertaError = () => {
    Swal.fire({
      html: 'Tu dispositivo no es compatible para generar esta accion,<br><strong> te recomendamos que descargues la captura y la compartas manualmente!',
      icon: 'error',
      padding: '1rem',
      grow: 'row',
      toast: true,
      position: 'center',
      allowOutsideClick: 'false',
      allowEscapeKey: 'false',
      showConfirmButton: true,
      confirmButtonColor: '#1693a5',
      
    });
  };

  
  return (
    <Grid container xs={12} justifyContent="center" marginTop={"15px"} >
      <Grid container item xs={4} direction="column" justifyContent="center"  alignItems="center" sx={{ marginBottom:"20px"}} >
        <WhatsAppIcon sx={{fontSize: 28, cursor: "pointer", marginTop: 0.90, color:'#1693a5'}}  onClick={compartirViaWhatsapp} />
          <Typography color="textSecondary" variant="body3">
              Compartir
          </Typography>
      </Grid>
      <Grid container item xs={4} direction="column" justifyContent="center"  alignItems="center" sx={{ marginBottom:"20px"}}>
        <CloudDownloadIcon sx={{fontSize: 28, cursor: "pointer", marginTop: 0.90, color:'#1693a5'}} onClick={capturarYGuardar} />
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


