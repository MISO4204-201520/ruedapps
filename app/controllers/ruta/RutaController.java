package controllers.ruta;

import models.ruta.HistoricoRecorrido;
import models.ruta.Ruta;
import models.ruta.Ubicacion;
import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Results;
import views.html.index;

/**
 * Created by Juan on 9/12/2015.
 */
public class RutaController extends Controller {

    public Result SaveUbicacion()
    {
        Form<Ubicacion> postForm = Form.form(Ubicacion.class).bindFromRequest();

        if (postForm.hasErrors()) {
            return badRequest(postForm.errorsAsJson());
        } else {
            Ubicacion ubicacion = new Ubicacion();
            ubicacion.latitud = postForm.get().latitud;
            ubicacion.longitud = postForm.get().longitud;
            ubicacion.nombre = postForm.get().nombre;
            ubicacion.save();
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
        ruta.origen = postForm.get().origen;
        ruta.destino = postForm.get().destino;
        ruta.save();

        return Results.created(Json.toJson(ruta));
    }


    public Result SaveHistoricoRecorrido()
    {
        Form<HistoricoRecorrido> postForm = Form.form(HistoricoRecorrido.class).bindFromRequest();

        if (postForm.hasErrors()) {
            return badRequest(postForm.errorsAsJson());
        }

        HistoricoRecorrido ruta = new HistoricoRecorrido();
        ruta.save();

        return Results.created(Json.toJson(ruta));
    }


}
