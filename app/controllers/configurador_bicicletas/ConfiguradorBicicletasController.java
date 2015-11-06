package controllers.configurador_bicicletas;

import models.configurador_bicicletas.Bicicleta;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Results;

/**
 * Created by Lina8a on 06/11/2015.
 */
public class ConfiguradorBicicletasController extends Controller {

    public Result CrearBicicleta() {
        Form<Bicicleta> postForm = Form.form(Bicicleta.class).bindFromRequest();
        if (postForm.hasErrors()) {
            return badRequest(postForm.errorsAsJson());
        }

        Bicicleta.BicicletaBuilder builder = new Bicicleta.BicicletaBuilder();
        Bicicleta bicicleta = SetBicicleta(builder, postForm);
        bicicleta.save();

        return Results.created();
    }

    private static Bicicleta SetBicicleta(Bicicleta.BicicletaBuilder builder, Form<? extends Bicicleta> formBicicleta) {
        builder.color(formBicicleta.get().getColor());
        builder.llantas(formBicicleta.get().getLlantas());
        builder.sillin(formBicicleta.get().getSillin());
        builder.tamanio(formBicicleta.get().getTamanio());

        for(int i =0; i < formBicicleta.get().getAccesorios().size(); i++) {
            builder.accesorios(formBicicleta.get().getAccesorios().get(i));
        }

        Bicicleta bicicleta = builder.build();
        return bicicleta;
    }
}
