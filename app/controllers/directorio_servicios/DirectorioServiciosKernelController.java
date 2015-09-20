package controllers.directorio_servicios;

import com.avaje.ebean.Ebean;
import models.directorio_servicios.Categoria;
import models.directorio_servicios.Servicio;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;

import java.util.List;

import static play.libs.Json.toJson;

/**
 * Created by Lina8a on 19/09/2015.
 * Controlador del componente de directorio de servicios.
 */
public class DirectorioServiciosKernelController extends Controller {

    public Result retornarCategorias() {
        List<Categoria> categorias = Ebean.find(Categoria.class).findList();
        return ok(toJson(categorias));
    }

    public Result retornarServiciosPorCategoria() {
        //TODO se debe revisar el modelo, ya que en este, el servicio no tiene ninguna relación con la categoría
        return (Result) ok("Hola");
    }

    public Result registrarCategoria() {
        Form<Categoria> form = Form.form(Categoria.class).bindFromRequest();
        if (form.hasErrors()) {
            return badRequest(form.errorsAsJson());
        } else {
            Categoria categoria = new Categoria();
            categoria.nombre = form.get().nombre;
            categoria.descripcion = form.get().descripcion;
            categoria.save();
        }
        return created();
    }

    public Result registrarServicio() {
        Form<Servicio> form = Form.form(Servicio.class).bindFromRequest();
        if (form.hasErrors()) {
            return badRequest(form.errorsAsJson());
        } else {
            Servicio servicio = new Servicio();
            servicio.nombre = form.get().nombre;
            servicio.descripcion = form.get().descripcion;
            servicio.horario = form.get().horario;
            servicio.precio = form.get().precio;
            servicio.telefono = form.get().telefono;
            servicio.domicilios = form.get().domicilios;

            //TODO el proveedor (Usuario) debe ser tomado de la sesión
            /*System.out.println("Id de proveedor: " + form.data().get("idProveedor"));
            Proveedor proveedor = Ebean.find(Proveedor.class, form.data().get("idProveedor"));
            if (proveedor != null) {
                servicio.proveedor = proveedor;
                servicio.save();
                return created();
            } else {
                return badRequest("No existe un proveedor con id " + form.data().get("idProveedor"));
            }*/

            servicio.save();

            return created();
        }
    }

    public Result editarServicio() {
        Form<Servicio> form = Form.form(Servicio.class).bindFromRequest();
        if (form.hasErrors()) {
            return badRequest(form.errorsAsJson());
        } else {
            Servicio servicio = Ebean.find(Servicio.class, form.get().id);
            if (servicio != null) {
                servicio.update();
            }
        }

        return ok();
    }

    public static Result eliminarServicio() {
        Form<Servicio> form = Form.form(Servicio.class).bindFromRequest();
        if (form.hasErrors()) {
            return badRequest(form.errorsAsJson());
        } else {
            Servicio servicio = Ebean.find(Servicio.class, form.get().id);
            if (servicio != null) {
                servicio.delete();
            }
        }

        return ok();
    }

    /*public static Result actualizarServicio() {
        return (Result) ok("Hola");
    }*/

    public static Result registrarUsoServicio() {
        return (Result) ok("Hola");
    }

}
