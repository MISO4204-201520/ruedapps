package controllers.directorio_servicios;

import play.mvc.Controller;

import javax.xml.transform.Result;

/**
 * Created by Lina8a on 19/09/2015.
 * Controlador del componente de directorio de servicios.
 */
public class DirectorioServiciosKernelController extends Controller {

    public static Result retornarCategorias() {
        return (Result) ok("Hola");
    }

    public static Result retornarServiciosPorCategoria() {
        return (Result) ok("Hola");
    }

    public static Result registrarCategoria() {
        return (Result) ok("Hola");
    }

    public static Result registrarServicio() {
        return (Result) ok("Hola");
    }

    public static Result editarServicio() {
        return (Result) ok("Hola");
    }

    public static Result eliminarServicio() {
        return (Result) ok("Hola");
    }

    public static Result actualizarServicio() {
        return (Result) ok("Hola");
    }

    public static Result registrarUsoServicio() {
        return (Result) ok("Hola");
    }

}
