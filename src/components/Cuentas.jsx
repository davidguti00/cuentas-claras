
import React, { useState } from 'react';
import {totalGastado, gastoPromedioPorPersona, dividirGastosEquitativamente} from "../hooks.js"
import "./Cuentas.css"
import {
    TextField,
    Grid,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Typography,
    Divider,
    IconButton,
    ListItemAvatar,
    ListItemText,
    
} from '@mui/material'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import IconoCalculadora from "../image/calculadora3.png";
import titulo from "../image/tituloCuentasClaras.png";
import Swal from 'sweetalert2'




export default function Cuentas() {

    const [datos, setDatos] = useState([{ nombre: '', gasto: null }]);
    const [gastosTotales, setGastosTotales] = useState("")
    const [gastosPorPersona, setGastosPorPersona] = useState("")
    const [resultados, setResultados] = useState([])


    const usuariosUnicos = datos.reduce((usuariosAcumulados, usuarioActual) => {
        if (!usuariosAcumulados[usuarioActual.nombre]) {
            usuariosAcumulados[usuarioActual.nombre] = {
                nombre: usuarioActual.nombre,
                gasto: usuarioActual.gasto * 1
            };
        } else {
        usuariosAcumulados[usuarioActual.nombre].gasto  += usuarioActual.gasto * 1;
        }
        return usuariosAcumulados;
    }, {});

    //array usuarios unicos
    const datosFiltrados = Object.values(usuariosUnicos);
    const datosFiltradosOrdenados = datosFiltrados.sort((a, b) => b.gasto - a.gasto)


    const todosNumeros = (array) => {
        return array.every(item => !isNaN(item.gasto));
    }

    const reemplazarComa = (datos) => {
        const nuevosDatos = datos.map((dato) => {
            if (typeof dato === "string" && dato.includes(",")) {
                return dato.replace(",", ".");
            }
                return dato;
        });
        return nuevosDatos;
    }

    const handleAgregarCampo = (e) => {
        const ultimoObjeto = datos[datos.length - 1];
        if(ultimoObjeto.nombre && ultimoObjeto.gasto){
            const numeroNuevo = ultimoObjeto.gasto;
            if(!isNaN(numeroNuevo)) {
                if(numeroNuevo.includes(",")) {
                    const nuevoNumero = numeroNuevo.replace(",", ".");
                    const nuevosDatos = [...datos.slice(0, -1), { nombre: "", gasto: nuevoNumero }];
                    setDatos(nuevosDatos);
                } else {
                    setDatos([...datos, { nombre: "", gasto: "" }]);
                }
            } else {
                Swal.fire({
                    text: 'Por favor ingresa un número válido en el campo Gasto.',
                    icon: 'warning',
                    confirmButtonColor: '#1693a5',
                    customClass: {
                        popup: 'customPopupClass'
                    },
                })
            }
        } else {
            Swal.fire({
                text: 'Por favor completa todos los campos.',
                icon: 'warning',
                confirmButtonColor: '#1693a5',
                customClass: {
                    popup: 'customPopupClass'
                },
                
            })
        }
    };




    const handleFiltrarNumero = (e) => {
        const { value } = e.target;
        if (value.includes(",")) {
            const newData = datos.slice().map((obj, index) => {
                if (index === datos.length - 1) {
                    return { ...obj, gasto: obj.gasto.replace(",", ".") };
                } else {
                    return obj;
                }
            });
            setDatos(newData);
        } else {
            return null;
        }
    }

    const handleInputChange = (e, index) => {
        handleFiltrarNumero(e)
        const { name, value } = e.target;
        const nuevosDatos = [...datos];
        nuevosDatos[index] = { ...nuevosDatos[index], [name]: value };
        setDatos(nuevosDatos)
    }

    const handleEliminarCampo = (e) => {
        if(datos.length > 1){
            const nuevosDatos = [...datos];
            nuevosDatos.splice(e, 1);
            setDatos(nuevosDatos);
        }else{
            return null
        }

    }


    const handleSubmit = (e) => {
        e.preventDefault();
        if(datos[datos.length - 1].nombre && datos[datos.length - 1].gasto){
            const nuevosDatos = reemplazarComa(datos)
            setDatos(nuevosDatos)
            if(todosNumeros(datos)){
                setGastosTotales(totalGastado(datos))
                setGastosPorPersona(gastoPromedioPorPersona(datosFiltrados))
                setResultados(dividirGastosEquitativamente(datosFiltradosOrdenados))
            }else {
                Swal.fire({
                    text: 'Todos los campos Gasto deben ser un número válido',
                    icon: 'warning',
                    confirmButtonColor: '#1693a5',
                    customClass: {
                        popup: 'customPopupClass'
                    },
                })
            }
        }else {
            Swal.fire({
                text: 'Todos los campos deben estar completos',
                icon: 'warning',
                confirmButtonColor: '#1693a5', 
                customClass: {
                    popup: 'customPopupClass'
                },
                
            })
        }
    };

    const handleClear = (e) => {
        e.preventDefault();
        setDatos([{nombre:"", gasto:""}])
        setGastosTotales("")
        setGastosPorPersona("")
        setResultados([])
    }

    const ultimoObjeto = datos[datos.length - 1]


    return (
        <Grid item container xs={12} md={6} lg={4} xl={3} sx={{ marginTop: "40px", marginBottom: "40px" }} className="container">
            <Grid item xs={12} sx={{ marginTop:"40px", marginBottom:"40px"}}>
                <img src={titulo} alt="Titulo de la página" style={{ width: '300px', height: 'auto' }} />
            </Grid>
            <Grid item xs={12} justifyContent="center" sx={{ marginBottom:"5px"}}>
                {datos.map((dato, index) => (
                <Grid item container xs={12} spacing={1} key={index} sx={{ marginBottom:"10px"}}>
                    <Grid item xs={6}>
                        <TextField
                        type="text"
                        label="Nombre"
                        required
                        id={`nombre${index}`}
                        variant="outlined"
                        size= "small"
                        name="nombre"
                        value={dato.nombre}
                        onChange={(e) => handleInputChange(e, index)}
                        InputProps={{
                            style: {
                                fontSize: 14,
                            }
                        }}
                    />
                    </Grid>

                    <Grid item xs={5}>
                        <TextField
                        type="number"
                        label="Gasto"
                        id={`gasto${index}`}
                        variant="outlined"
                        required
                        size="small"
                        name="gasto"
                        value={dato.gasto}
                        onChange={(e) => handleInputChange(e, index)}
                        onBlur={(e) => handleFiltrarNumero(e)}
                        prefix="$"
                        InputProps={{
                            style: {
                                fontSize: 14,
                                color: "black",
                                shrink: true,
                            }
                        }}
                    />
                    </Grid>
                    <Grid item xs={1} >
                        <DeleteForeverIcon sx={{fontSize: 26, cursor: "pointer", marginTop: 0.90, color:'#1693a5'}} onClick={() => handleEliminarCampo(index)} disabled={datos.length === 1} className="btn" />
                    </Grid>
                </Grid>
                ))}
            </Grid>
            <Grid item container xs={12} direction="row"justifyContent="center"alignItems="center" sx={{ marginTop:"10px"}}>
                <Grid container xs={3} direction="column" justifyContent="center"  alignItems="center" sx={{ marginBottom:"20px"}}>
                    <GroupAddIcon sx={{fontSize: 30, cursor: "pointer", color:'#1693a5', marginBottom:"0px", marginTop:"6px"}}
                        onClick={handleAgregarCampo}
                        disable={ultimoObjeto.nombre === "" || ultimoObjeto.gasto === "" || ultimoObjeto.gasto === null} >
                    </GroupAddIcon>
                    <Typography color="textSecondary" variant="body3">
                        Agregar
                    </Typography>
                </Grid>
                <Grid container xs={3} direction="column" justifyContent="center"  alignItems="center" sx={{ marginBottom:"20px", cursor: "pointer"}}>
                    <IconButton>
                        <img src={IconoCalculadora} alt="Icono Personalizado" style={{ width: '35px', height: '35px' }}
                        onClick={handleSubmit} />
                    </IconButton>
                    <Typography color="textPrimary" variant="body2">
                        Calcular
                    </Typography>
                </Grid>
                <Grid container xs={3} direction="column" justifyContent="center"  alignItems="center" sx={{ marginBottom:"20px"}}>
                    <NoteAddIcon  sx={{fontSize: 30, cursor: "pointer", color:'#1693a5', marginBottom:"0px", marginTop:"6px"}}
                        onClick={handleClear}
                        disabled={datos.length === 1} >
                    </NoteAddIcon>
                    <Typography color="textSecondary" variant="body3">
                        Nuevo
                    </Typography>
                </Grid>
            </Grid>

            <Grid item container xs={12}>
                { gastosTotales ?
                    <Grid item xs={12} >
                        <br/>
                            <Typography color="textSecondary" variant="body3">
                                El gasto total de calcula de manera automatica, teniendo en cuenta los ingresos presporcionados por el usuario.
                            </Typography>
                        <br/>
                        <Grid container xs={12}  direction="row" justifyContent="center"  alignItems="center" sx={{ marginTop:"10px"}}>
                                <Grid item xs spacing={2}>
                                    <Grid item xs>
                                        <SupervisorAccountRoundedIcon sx={{fontSize: 34,  color:'#1693a5 '}}/>
                                    </Grid>
                                    <ListItemText secondary="Total gastado" primary={`$ ${gastosTotales}`} />
                                </Grid>
                            <Divider orientation="vertical" flexItem />
                                <Grid item xs justifyContent="flex-start" spacing={2}>
                                    <Grid item xs>
                                        <ListItemAvatar>
                                            <MonetizationOnIcon sx={{fontSize: 34, color:'#1693a5 '}} />
                                        </ListItemAvatar>
                                    </Grid>
                                    <ListItemText secondary="Gasto promedio" primary={`$ ${gastosPorPersona}`} />
                                </Grid>

                        </Grid>
                    </Grid>
                : null
                }
                {
                    resultados.length ?
                        <Grid item xs={12} justifyContent="center"  sx={{ marginBottom:"15px", marginTop:"5px"}}>
                            <TableContainer item sx={{ overflow: 'auto'}} className="customTable">
                                <Table item>
                                    <TableHead item>
                                        <TableRow item className="customTableRow">
                                            <TableCell align="center" style={{ width: '20%', fontSize: 15, color:'#1693a5 ' }} >Deudor</TableCell>
                                            <TableCell align="center" style={{ width: '20%', fontSize: 15, color:'#1693a5 ' }} >Monto</TableCell>
                                            <TableCell align="center" style={{ width: '20%', fontSize: 15, color:'#1693a5' }} >Acreedor</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody >
                                        {resultados.map((e) => (
                                            <TableRow className="customTableRow">
                                                <TableCell align="center" style={{ whiteSpace: 'nowrap', marginBottom:"140px" }}>
                                                    {e.deudor.charAt(0).toUpperCase() + e.deudor.slice(1)}
                                                </TableCell>
                                                <TableCell align="center" style={{ whiteSpace: 'nowrap' }}>
                                                    {`$${e.monto}`}
                                                </TableCell>
                                                <TableCell align="center" style={{ whiteSpace: 'nowrap' }}>
                                                    {e.acreedor.charAt(0).toUpperCase() + e.acreedor.slice(1)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    : null
                }
            </Grid>
        </Grid>
    )
}


