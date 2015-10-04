package controllers.ruta;

import com.avaje.ebean.Ebean;
import models.perfil.Ciclista;
import models.perfil.Usuario;
import models.ruta.HistoricoRecorrido;
import models.ruta.Recorrido;
import models.ruta.Ruta;
import models.ruta.Ubicacion;
import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Results;
import views.html.index;

import java.util.List;

/**
 * Created by Juan on 9/12/2015.
 */
public class RutaController extends Controller {

    public Result SaveUbicacion(long id)
    {
        Recorrido recorrido = Ebean.find(Recorrido.class, id);
        if (recorrido == null)
        {
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


    public Result SaveRuta()
    {
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
        return Results.created(Json.toJson(ruta));
    }


    public Result SaveRecorrido()
    {
        Form<Recorrido> postForm = Form.form(Recorrido.class).bindFromRequest();

        if (postForm.hasErrors() || postForm.get().ruta == null)
        {
            return badRequest(postForm.errorsAsJson());
        }

        Ruta ruta = Ebean.find(Ruta.class, postForm.get().ruta.id);
        if (ruta == null)
        {
            return Results.notFound("Ruta no encontrada ");
        }

        Recorrido recorrido = new Recorrido();
        recorrido.ruta = ruta;
        recorrido.save();

        return Results.created(Json.toJson(recorrido));
    }


    public Result SaveHistoricoRecorrido()
    {
        //session().put("loggedUser", "2");

        Form<HistoricoRecorrido> postForm = Form.form(HistoricoRecorrido.class).bindFromRequest();

        if (postForm.hasErrors() || postForm.get().recorrido == null)
        {
            return badRequest(postForm.errorsAsJson());
        }

        Recorrido recorrido = Ebean.find(Recorrido.class, postForm.get().recorrido.id);
        if (recorrido == null)
        {
            return Results.notFound("Recorrido no encontrado");
        }

        String usuarioLogueado = session().get("loggedUser");
        Ciclista usuario = Ciclista.findCiclista.byId(Long.valueOf(usuarioLogueado));

        HistoricoRecorrido historico = new HistoricoRecorrido();
        historico.duracion = postForm.get().duracion;
        historico.fecha = postForm.get().fecha;
        historico.recorrido = recorrido;
        historico.ciclista = usuario;

        historico.save();

        return Results.created(Json.toJson(historico));
    }

    public Result ConsutaHistoricoPorId(long id)
    {
        HistoricoRecorrido historico = Ebean.find(HistoricoRecorrido.class, id);
        if (historico != null)
        {
            return ok(Json.toJson(historico));
        }

        return Results.notFound();
    }


    public Result ConsultarHistoricoPorUsusario(long id)
    {
        List<HistoricoRecorrido> historicoRecorridos = Ebean.find(HistoricoRecorrido.class).where().eq("ciclista.id", id).findList();
        return ok(Json.toJson(historicoRecorridos));
    }

}
