package controllers.perfil;

import com.avaje.ebean.Ebean;
import models.perfil.Ciclista;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Results;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Lina8a on 15/11/2015.
 */
public class AmigosOptionalController extends Controller {

    public Result AgregarAmigo(long id, long idAmigo) {
        Ciclista usuario = Ebean.find(Ciclista.class, id);
        Ciclista amigo = Ebean.find(Ciclista.class, idAmigo);

        if (usuario != null && amigo != null) {
            usuario.amigos.add(amigo);
            usuario.save();
            return ok(Json.toJson(usuario));
        } else {
            return Results.notFound();
        }
    }

    public Result EliminarAmigo(long id, long idAmigo) {
        Ciclista usuario = Ebean.find(Ciclista.class, id);

        if (usuario != null) {
            for(int i = 0; i < usuario.amigos.size(); i++) {
                Ciclista c = usuario.amigos.get(i);
                if (c.id == idAmigo) {
                    usuario.amigos.remove(i);
                    usuario.save();
                }
            }

            return ok(Json.toJson(usuario));
        } else {
            return Results.notFound();
        }
    }

    public Result Amigos(long id) {
        Ciclista usuario = Ebean.find(Ciclista.class, id);

        if (usuario != null) {
            List<Ciclista> amigos = usuario.amigos;
            return ok(Json.toJson(amigos));
        } else {
            return Results.notFound();
        }
    }

    public Result NoAmigos(long id) {
        Ciclista usuario = Ebean.find(Ciclista.class, id);

        if (usuario != null) {
            List<Ciclista> amigos = usuario.amigos;
            List<Ciclista> ciclistas = Ebean.find(Ciclista.class).findList();
            List<Ciclista> noAmigos = new ArrayList<>();

            for (Ciclista ciclista : ciclistas) {
                boolean existe = false;

                if (ciclista.id != id) {
                    for (int j = 0; j < amigos.size(); j++) {
                        Ciclista c2 = amigos.get(j);
                        if (ciclista.id == c2.id) {
                            existe = true;
                            amigos.remove(c2);
                        }
                    }

                    if (!existe && ciclista.id != id) {
                        noAmigos.add(ciclista);
                    }
                }
            }

            return ok(Json.toJson(noAmigos));
        } else {
            return Results.notFound();
        }
    }
}
