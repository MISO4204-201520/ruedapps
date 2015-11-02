package controllers.ruta;

import com.avaje.ebean.Ebean;
import models.perfil.Ciclista;
import models.ruta.*;
import play.data.DynamicForm;
import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Results;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

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



    public Result SaveRecorrido() {
        Form<Recorrido> postForm = Form.form(Recorrido.class).bindFromRequest();

        if (postForm.hasErrors() || postForm.get().ruta == null) {
            return badRequest(postForm.errorsAsJson());
        }

        Ruta ruta = Ebean.find(Ruta.class, postForm.get().ruta.id);
        if (ruta == null) {
            return Results.notFound("Ruta no encontrada ");
        }

        Recorrido recorrido = new Recorrido();
        recorrido.ruta = ruta;
        recorrido.save();

        return Results.created(Json.toJson(recorrido));
    }


    public Result SaveHistoricoRecorrido() {
        //session().put("loggedUser", "2");

        Form<HistoricoRecorrido> postForm = Form.form(HistoricoRecorrido.class).bindFromRequest();

        if (postForm.hasErrors() || postForm.get().recorrido == null) {
            return badRequest(postForm.errorsAsJson());
        }

        Recorrido recorrido = Ebean.find(Recorrido.class, postForm.get().recorrido.id);
        if (recorrido == null) {
            return Results.notFound("Recorrido no encontrado");
        }

        String usuarioLogueado = session().get("loggedUser");
        Ciclista usuario = Ciclista.findCiclista.byId(Long.valueOf(usuarioLogueado));

        HistoricoRecorrido historico = new HistoricoRecorrido();
        historico.duracion = postForm.get().duracion;
        historico.fecha = new Date();
        historico.recorrido = recorrido;
        historico.ciclista = usuario;

        historico.save();

        return Results.created(Json.toJson(historico));
    }

    public Result ConsutaHistoricoPorId(long id) {
        HistoricoRecorrido historico = Ebean.find(HistoricoRecorrido.class, id);
        if (historico != null) {
            return ok(Json.toJson(historico));
        }

        return Results.notFound();
    }


    public Result ConsultarHistoricoPorUsusario(long id) {

        if (id == 0)
        {
            id = Long.valueOf(session().get("loggedUser"));
        }

        List<HistoricoRecorrido> historicoRecorridos = Ebean.find(HistoricoRecorrido.class).where().eq("ciclista.id", id).findList();
        return ok(Json.toJson(historicoRecorridos));
    }


    public Result SaveProgramacionRuta() throws ParseException {

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

        String fechaString = dynamicForm.get("fechaInicio");
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'.000Z'");
        format.setTimeZone(TimeZone.getTimeZone("GMT"));

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
        programacionRuta.fechaInicio = format.parse(fechaString) ;
        programacionRuta.nombre= postForm.get().nombre;

        if (postForm.get().participantes != null) {
            for (Ciclista ciclista : postForm.get().participantes) {
                Ciclista participante = Ebean.find(Ciclista.class, ciclista.id);
                if (participante != null) {
                    programacionRuta.participantes.add(participante);
                }
            }
        }

        programacionRuta.save();
        return Results.created();
    }


    public Result AddCiclistaProgramacionRuta(long idCiclista) {

        DynamicForm postForm = Form.form().bindFromRequest();
        ProgramacionRuta programacionRuta = Ebean.find(ProgramacionRuta.class, postForm.get("id"));
        if (programacionRuta == null) {
            return Results.notFound("Programacion Ruta no encontrada");
        }

        Ciclista ciclista = Ebean.find(Ciclista.class, idCiclista);
        if (ciclista == null) {
            return Results.notFound("Ciclista no encontrado ");
        }

        programacionRuta.participantes.add(ciclista);
        programacionRuta.save();

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

        if (id == 0)
        {
            id = Long.valueOf(session().get("loggedUser"));
        }

        List<ProgramacionRuta> programacionRecorrido = Ebean.find(ProgramacionRuta.class).where().eq("organizador.id", id).findList();
        if (programacionRecorrido == null) {
            return Results.notFound("Programacion Recorrido no encontrada");
        }

        return Results.ok(Json.toJson(programacionRecorrido));
    }

    public Result ListaProgramacionRutaPorParticipante(long id) {

        if (id == 0) {
            id = Long.valueOf(session().get("loggedUser"));
        }

        List<ProgramacionRuta> programacionRecorrido = Ebean.find(ProgramacionRuta.class).where().or(com.avaje.ebean.Expr.eq("participantes.id", id),
                                                                                                     com.avaje.ebean.Expr.eq("organizador.id", id)).findList();
        if (programacionRecorrido == null) {
            return Results.notFound("Programacion Recorrido no encontrada");
        }

        return Results.ok(Json.toJson(programacionRecorrido));
    }
}
