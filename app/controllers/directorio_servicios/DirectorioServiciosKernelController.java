package controllers.directorio_servicios;

import com.avaje.ebean.Ebean;
import models.directorio_servicios.Categoria;
import models.directorio_servicios.Servicio;
import models.perfil.Proveedor;
import models.perfil.Usuario;
import models.ruta.Ubicacion;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;

import java.util.ArrayList;
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

    public Result retornarServiciosPorCategoria(long idCategoria) {
        Categoria categoria = Ebean.find(Categoria.class, idCategoria);
        List<Servicio> servicios = new ArrayList<>();
        if (categoria != null) {
            servicios = Ebean.find(Servicio.class).where().eq("categoria", categoria).findList();
        }
        return ok(toJson(servicios));
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

    public Result registrarServicio(long idCategoria) {
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

            // Obtiene el usuario que esta registrado el servicio de la sesion
            String usuarioLogueado = session().get("loggedUser");
            Usuario usuario = Usuario.find.byId(Long.valueOf(usuarioLogueado));

            // Valida que el usuario exista y que sea un proveedor
            /*if (usuario != null && usuario instanceof Proveedor) {
                servicio.proveedor = (Proveedor) usuario;
            } else {
                return badRequest("No existe un proveedor con id " + usuarioLogueado);
            }*/

            Categoria categoria = Ebean.find(Categoria.class, idCategoria);
            if (categoria != null) {
                servicio.categoria = categoria;
            } else {
                return badRequest("No existe una categoria con id " + form.get().categoria.id);
            }

            // Crea y guarda la ubicación del servicio a partir de los datos ingresados en la forma
            Ubicacion ubicacion = new Ubicacion();
            ubicacion.nombre = form.get().ubicacion.nombre;
            ubicacion.latitud = form.get().ubicacion.latitud;
            ubicacion.longitud = form.get().ubicacion.longitud;
            ubicacion.save();

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

    public Result eliminarServicio() {
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

    public Result registrarUsoServicio() {
        return ok("Hola");
    }

}
