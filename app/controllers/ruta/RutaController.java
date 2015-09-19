package controllers.ruta;

import models.ruta.Ubicacion;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Results;
import views.html.index;

/**
 * Created by Juan on 9/12/2015.
 */
public class RutaController extends Controller {

    public Result index() {
        return ok(index.render("Your new application is ready."));

    }

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

}
