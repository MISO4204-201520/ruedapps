package controllers.configurador_bicicletas;

import models.configurador_bicicletas.Accesorio;
import models.configurador_bicicletas.Bicicleta;
import models.configurador_bicicletas.BicicletaDTO;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Results;

/**
 * Created by Lina8a on 06/11/2015.
 */
public class ConfiguradorBicicletasController extends Controller {

    public Result CrearBicicleta() {
        Form<BicicletaDTO> postForm = Form.form(BicicletaDTO.class).bindFromRequest();
        System.out.print("Post form:" + postForm);
        System.out.print("Color:" + postForm.get().color);
        System.out.print("Tamanio:" + postForm.get().tamanio);
        System.out.print("Llantas:" + postForm.get().llantas);
        System.out.print("Sillin:" + postForm.get().sillin);

        if (postForm.hasErrors()) {
            return badRequest(postForm.errorsAsJson());
        }

        Bicicleta.BicicletaBuilder builder = new Bicicleta.BicicletaBuilder();
        Bicicleta bicicleta = SetBicicleta(builder, postForm);
        bicicleta.save();

        return Results.created();
    }

    private static Bicicleta SetBicicleta(Bicicleta.BicicletaBuilder builder, Form<? extends BicicletaDTO> formBicicleta) {
        builder.color(formBicicleta.get().color);
        builder.llantas(formBicicleta.get().llantas);
        builder.sillin(formBicicleta.get().sillin);
        builder.tamanio(formBicicleta.get().tamanio);

        Bicicleta bicicleta = builder.build();
        bicicleta.save();

        for(int i =0; i < formBicicleta.get().accesorios.size(); i++) {
            Accesorio accesorio = new Accesorio();
            accesorio.nombre = formBicicleta.get().accesorios.get(i);
            accesorio.bicicleta = bicicleta;
            accesorio.save();
        }


        return bicicleta;
    }
}
