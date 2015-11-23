package controllers.ruta;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.Expr;
import models.perfil.Ciclista;
import models.ruta.ProgramacionRuta;
import models.ruta.Recorrido;
import models.ruta.Ruta;
import models.ruta.Ubicacion;
import models.ruta.desplazamiento.Desplazamiento;
import play.data.DynamicForm;
import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Results;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**\
 * Created by Juan on 9/12/2015.
 */
public class RutaController extends Controller {

    public Result SaveUbicacion(long id) {
        Recorrido recorrido = Ebean.find(Recorrido.class, id);
        if (recorrido == null) {
            return Results.notFound("Recorrido no encontrado");
        }

        Form<Ubicacion> postForm = Form.form(Ubicacion.class).bindFromRequest();

        if (postForm.hasErrors()) {
            return badRequest(postForm.errorsAsJson());
        } else {
            Ubicacion ubicacion = new Ubicacion();
            ubicacion.latitud = postForm.get().latitud;
            ubicacion.longitud = postForm.get().longitud;
            ubicacion.nombre = postForm.get().nombre;

            recorrido.secuenciaUbicaciones.add(ubicacion);
            recorrido.update();
        }

        return Results.created();
    }


    public Result SaveRuta() {
        Form<Ruta> postForm = Form.form(Ruta.class).bindFromRequest();

        if (postForm.hasErrors()) {
            return badRequest(postForm.errorsAsJson());
        }

        Ruta ruta = new Ruta();
        ruta.origen = new Ubicacion();
        ruta.origen.latitud = postForm.get().origen.latitud;
        ruta.origen.longitud = postForm.get().origen.longitud;
        ruta.origen.nombre = postForm.get().origen.nombre;

        ruta.destino = new Ubicacion();
        ruta.destino.latitud = postForm.get().destino.latitud;
        ruta.destino.longitud = postForm.get().destino.longitud;
        ruta.destino.nombre = postForm.get().destino.nombre;

        ruta.save();
        return Results.created(Json.toJson(ruta.id));
    }


    public Result SaveRutaRecorrido() {

        Form<Ruta> postForm = Form.form(Ruta.class).bindFromRequest();

        if (postForm.hasErrors()) {
            return badRequest(postForm.errorsAsJson());
        }

        Ruta ruta = new Ruta();
        ruta.origen = new Ubicacion();
        ruta.origen.latitud = postForm.get().origen.latitud;
        ruta.origen.longitud = postForm.get().origen.longitud;
        ruta.origen.nombre = postForm.get().origen.nombre;

        ruta.destino = new Ubicacion();
        ruta.destino.latitud = postForm.get().destino.latitud;
        ruta.destino.longitud = postForm.get().destino.longitud;
        ruta.destino.nombre = postForm.get().destino.nombre;
        ruta.save();

        Recorrido recorrido = new Recorrido();
        recorrido.ruta = ruta;
        recorrido.save();

        return Results.created(Json.toJson(recorrido.id));
    }


    public Result SaveRecorrido(long rutaId) {

        Ruta ruta = Ebean.find(Ruta.class, rutaId);
        if (ruta == null) {
            return Results.notFound("Ruta no encontrada ");
        }

        Recorrido recorrido = new Recorrido();
        recorrido.ruta = ruta;
        recorrido.save();

        return Results.created(Json.toJson(recorrido.id));
    }

    public Result SaveProgramacionRuta() {

        Form<ProgramacionRuta> postForm = Form.form(ProgramacionRuta.class).bindFromRequest();
        DynamicForm dynamicForm = Form.form().bindFromRequest();

        if (postForm.hasErrors() || postForm.get().ruta == null) {
            return badRequest(postForm.errorsAsJson());
        }

        String usuarioLogueado = session().get("loggedUser");
        Ciclista organizador = Ebean.find(Ciclista.class, Long.valueOf(usuarioLogueado));
        if (organizador == null) {
            return Results.notFound("organizador no encontrado ");
        }

        Date fechaInicio;

        try {
            String fechaString = dynamicForm.get("fechaInicio");
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'.000Z'");
            format.setTimeZone(TimeZone.getTimeZone("GMT"));
            fechaInicio = format.parse(fechaString);

        } catch (ParseException ex) {
            return badRequest();
        }

        ProgramacionRuta programacionRuta = this.ValoresProgramacionRuta(postForm, organizador, fechaInicio);
        Desplazamiento desplazamiento = new Desplazamiento();
        desplazamiento.Programar(programacionRuta);

        return Results.created();
    }

    public Result ConsultaProgramacionRuta(long id) {

        ProgramacionRuta programacionRecorrido = Ebean.find(ProgramacionRuta.class, id);
        if (programacionRecorrido == null) {
            return Results.notFound("Programacion Recorrido no encontrada");
        }

        return Results.ok(Json.toJson(programacionRecorrido));
    }

    public Result ListaProgramacionRutaPorOrganizador(long id) {

        if (id == 0) {
            id = Long.valueOf(session().get("loggedUser"));
        }

        List<ProgramacionRuta> programacionRecorrido = Ebean.find(ProgramacionRuta.class).where().eq("organizador.id", id).findList();
        if (programacionRecorrido != null) {
            return Results.ok(Json.toJson(programacionRecorrido));
        } else {
            return Results.notFound("Programacion recorrido organizador no encontrada");
        }
    }

    protected ProgramacionRuta ValoresProgramacionRuta (Form<ProgramacionRuta> postForm, Ciclista organizador, Date fechaInicio)
    {
        Ruta ruta = new Ruta();
        ruta.origen = new Ubicacion();
        ruta.origen.latitud  = postForm.get().ruta.origen.latitud;
        ruta.origen.longitud  = postForm.get().ruta.origen.longitud;
        ruta.origen.nombre  = postForm.get().ruta.origen.nombre;

        ruta.destino = new Ubicacion();
        ruta.destino.latitud  = postForm.get().ruta.destino.latitud;
        ruta.destino.longitud  = postForm.get().ruta.destino.longitud;
        ruta.destino.nombre  = postForm.get().ruta.destino.nombre;
        ruta.save();

        ProgramacionRuta programacionRuta = new ProgramacionRuta();
        programacionRuta.organizador = organizador;
        programacionRuta.ruta = ruta;
        programacionRuta.descripcion = postForm.get().descripcion;
        programacionRuta.fechaInicio = fechaInicio;
        programacionRuta.nombre= postForm.get().nombre;

        return programacionRuta;
    }

    // Metodo para notificaciones - aplica tanto para individuales como grupales
    public Result ListaProgramacionRutaPorParticipanteHoy(long id) {
        if (id == 0) {
            id = Long.valueOf(session().get("loggedUser"));
        }

        // Fechas de hoy y mañana
        Calendar c = new GregorianCalendar();
        c.set(Calendar.HOUR_OF_DAY, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        c.set(Calendar.MILLISECOND, 0);
        Date hoy = c.getTime();
        c.add(Calendar.DATE, 1);
        Date manana = c.getTime();

        List<ProgramacionRuta> programacionRecorrido = Ebean.find(ProgramacionRuta.class).where()
                .ge("fechaInicio", hoy)
                .le("fechaInicio", manana)
                .or(
                        Expr.eq("participantes.id", id),
                        Expr.eq("organizador.id", id)
                )
                .findList();
        if (programacionRecorrido != null) {
            return Results.ok(Json.toJson(programacionRecorrido));
        } else {
            return Results.notFound("Programacion recorrido participante no encontrada");
        }
    }
}
