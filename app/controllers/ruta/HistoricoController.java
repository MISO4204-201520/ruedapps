package controllers.ruta;

import com.avaje.ebean.Ebean;
import models.perfil.Ciclista;
import models.ruta.HistoricoRecorrido;
import models.ruta.Recorrido;
import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Results;

import java.util.Date;
import java.util.List;

/**
 * Created by Juan on 11/16/2015.
 */
public class HistoricoController extends Controller {

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

}
