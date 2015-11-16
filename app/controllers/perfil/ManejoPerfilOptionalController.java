package controllers.perfil;

import models.perfil.Ciclista;
import models.perfil.Usuario;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Results;

import java.util.List;

/**
 * Created by Lina8a on 15/11/2015.
 */
public class ManejoPerfilOptionalController extends Controller {

    public Result ActualizarUsuario() {
        Form<Ciclista> postForm = Form.form(Ciclista.class).bindFromRequest();
        if (postForm.hasErrors()) {
            return badRequest(postForm.errorsAsJson());
        } else {
            String correoLogin = postForm.get().correoElectronico;
            List<Usuario> usuario = Usuario.find.where().eq("correoElectronico", correoLogin).findList();

            if (usuario != null && usuario.size() > 0) {
                Ciclista ciclista = (Ciclista) usuario.get(0);
                SetUsuario(ciclista, postForm);
                ciclista.update();
            } else {
                return Results.notFound();
            }
        }

        return Results.created();
    }

    private static void SetUsuario(Usuario usuario, Form<? extends Usuario> formUsuario) {
        usuario.nombres = formUsuario.get().nombres;
        usuario.celular = formUsuario.get().celular;
        usuario.correoElectronico = formUsuario.get().correoElectronico;
        usuario.apellidos = formUsuario.get().apellidos;
        usuario.ciudad = formUsuario.get().ciudad;
        usuario.hashContrasenia(formUsuario.get().contrasenia);
    }
}
