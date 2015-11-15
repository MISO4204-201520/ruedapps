package controllers.ruta;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.Expr;
import models.perfil.Ciclista;
import models.ruta.ProgramacionRuta;
import models.ruta.desplazamiento.Desplazamiento;
import models.ruta.desplazamiento.DesplazamientoGrupal;
import play.data.DynamicForm;
import play.data.Form;
import play.libs.Json;
import play.mvc.Result;
import play.mvc.Results;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.TimeZone;

/**
 * Created by Juan on 11/15/2015.
 */
public class RutaGrupalController extends RutaController {

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

        Form<ProgramacionRuta> postFormGrupal = Form.form(ProgramacionRuta.class).bindFromRequest();
        List<Ciclista> participantes = new LinkedList<>();
        if (postFormGrupal.get().participantes != null) {
            for (Ciclista ciclista : postFormGrupal.get().participantes) {
                Ciclista participante = Ebean.find(Ciclista.class, ciclista.id);
                if (participante != null) {
                    participantes.add(participante);
                }
            }
        }

        ProgramacionRuta programacionRuta = this.ValoresProgramacionRuta(postForm, organizador, fechaInicio);
        DesplazamientoGrupal desplazamientoGrupal = new DesplazamientoGrupal(new Desplazamiento(), participantes);
        desplazamientoGrupal.Programar(programacionRuta);

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

    public Result ListaProgramacionRutaPorParticipante(long id) {
        if (id == 0) {
            id = Long.valueOf(session().get("loggedUser"));
        }

        List<ProgramacionRuta> programacionRecorrido = Ebean.find(ProgramacionRuta.class).where()
                .or(
                        Expr.eq("participantes.id", id),
                        Expr.eq("organizador.id", id)
                ).findList();
        if (programacionRecorrido != null) {
            return Results.ok(Json.toJson(programacionRecorrido));
        } else {
            return Results.notFound("Programacion recorrido participante no encontrada");
        }
    }
}
