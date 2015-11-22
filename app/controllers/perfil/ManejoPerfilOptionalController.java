package controllers.perfil;

import annotations.Feature;
import models.perfil.Ciclista;
import models.perfil.RegistroDTO;
import models.perfil.Usuario;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Results;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * Created by Lina8a on 15/11/2015.
 */
@Feature(nombre = "ManejoPerfiles")
public class ManejoPerfilOptionalController extends Controller {

    public Result ActualizarUsuario() {
        Form<RegistroDTO> postForm = Form.form(RegistroDTO.class).bindFromRequest();
        if (postForm.hasErrors()) {
            return badRequest(postForm.errorsAsJson());
        } else {
            String correoLogin = postForm.get().getCorreoElectronico();
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

    private static void SetUsuario(Ciclista usuario, Form<? extends RegistroDTO> formUsuario) {
        usuario.nombres = formUsuario.get().getNombres();
        usuario.celular = formUsuario.get().getCelular();
        usuario.correoElectronico = formUsuario.get().getCorreoElectronico();
        usuario.apellidos = formUsuario.get().getApellidos();
        usuario.ciudad = formUsuario.get().getCiudad();

        try {
            DateFormat formato = new SimpleDateFormat("yyyy/MM/dd");
            usuario.fechaNacimiento = formato.parse(formUsuario.get().getFechaNacimiento());
        }
        catch (Exception e) {
            usuario.fechaNacimiento = new Date();
        }

        usuario.hashContrasenia(formUsuario.get().getContrasenia());
    }
}
