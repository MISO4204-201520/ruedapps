package controllers.configurador_bicicletas;

import annotations.Feature;
import com.avaje.ebean.Ebean;
import models.configurador_bicicletas.Accesorio;
import models.configurador_bicicletas.Bicicleta;
import models.configurador_bicicletas.BicicletaBuilder;
import models.configurador_bicicletas.BicicletaDTO;
import models.perfil.Ciclista;
import models.perfil.Usuario;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Results;

import java.util.ArrayList;
import java.util.List;

import static play.libs.Json.toJson;

/**
 * Created by Lina8a on 06/11/2015.
 */
@Feature(nombre = "ConfiguradorBicicletas")
public class ConfiguradorBicicletasController extends Controller {

    public Result CrearBicicleta() {
        Form<BicicletaDTO> postForm = Form.form(BicicletaDTO.class).bindFromRequest();
        if (postForm.hasErrors()) {
            return badRequest(postForm.errorsAsJson());
        } else {
            BicicletaBuilder builder = new BicicletaBuilder();
            Bicicleta bicicleta = SetBicicleta(builder, postForm);
            bicicleta.save();

            if (adicionarBicicletaCiclista(bicicleta)) {
                return Results.created();
            } else {
                return Results.badRequest();
            }
        }
    }

    private static Bicicleta SetBicicleta(BicicletaBuilder builder, Form<? extends BicicletaDTO> formBicicleta) {
        builder.color(formBicicleta.get().color);
        builder.llantas(formBicicleta.get().llantas);
        builder.sillin(formBicicleta.get().sillin);
        builder.tamanio(formBicicleta.get().tamanio);

        Bicicleta bicicleta = builder.build();
        bicicleta.save();

        for (int i = 0; i < formBicicleta.get().accesorios.size(); i++) {
            Accesorio accesorio = new Accesorio();
            accesorio.nombre = formBicicleta.get().accesorios.get(i);
            accesorio.bicicleta = bicicleta;
            accesorio.save();
        }

        return bicicleta;
    }

    private boolean adicionarBicicletaCiclista(Bicicleta bicicleta) {
        String usuarioLogueado = session().get("loggedUser");
        Usuario usuario = Usuario.find.byId(Long.valueOf(usuarioLogueado));

        if (usuario != null && usuario instanceof Ciclista) {
            Ciclista ciclista = (Ciclista) usuario;
            ciclista.bicicletas.add(bicicleta);
            ciclista.update();
            return true;
        } else {
            return false;
        }
    }

    public Result obtenerAccesoriosBicicleta(long idBicicleta) {
        Bicicleta bicicleta = Ebean.find(Bicicleta.class, idBicicleta);
        List<Accesorio> accesorios = new ArrayList<>();
        if (bicicleta != null) {
            accesorios = Ebean.find(Accesorio.class).where().eq("bicicleta", bicicleta).findList();
        }
        return ok(toJson(accesorios));
    }
}
