package controllers.perfil;

import com.avaje.ebean.Ebean;
import com.fasterxml.jackson.databind.JsonNode;
import models.perfil.Ciclista;
import models.perfil.LoginDTO;
import models.perfil.Usuario;
import models.ruta.Ubicacion;
import play.api.libs.json.Json;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Results;


/**
 * Created by Lina8a on 06/09/2015.
 */
public class PerfilKernelController extends Controller {

    public Result login()
    {
        Form<LoginDTO> postForm = Form.form(LoginDTO.class).bindFromRequest();
        Usuario usuario = Ebean.find(Usuario.class, postForm.get().getCorreoElectronico());
        if (usuario != null &&  usuario.VerificaContrasenia(postForm.get().getContrasenia()))
        {
            return (Result) ok("loginOk");
        }

        return (Result) ok("loginFailed");
    }

    public Result CrearUsuario()
    {
        Form<Ciclista> postForm = Form.form(Ciclista.class).bindFromRequest();
        if (postForm.hasErrors()) {
            return badRequest(postForm.errorsAsJson());
        } else {
            Ciclista ciclista = new Ciclista();
            SetUsuario(ciclista, postForm);
            ciclista.fechaNacimiento = postForm.get().fechaNacimiento;
            ciclista.save();
        }

        return Results.created();
    }

    public Result ActualizarUsuario()
    {
        Form<Ciclista> postForm = Form.form(Ciclista.class).bindFromRequest();
        if (postForm.hasErrors()) {
            return badRequest(postForm.errorsAsJson());
        } else {

            Ciclista usuario = Ebean.find(Ciclista.class, postForm.get().correoElectronico);

            if (usuario != null) {
                Ciclista ciclista = new Ciclista();
                SetUsuario(ciclista, postForm);
                ciclista.update();
            }
        }

        return Results.created();
    }

    public Result ConsultarUsuario()
    {
        Form<LoginDTO> postForm = Form.form(LoginDTO.class).bindFromRequest();
        Ciclista usuario = Ebean.find(Ciclista.class, postForm.get().getCorreoElectronico());

        /*
        TODO Falta revisar error al serializar a json
        JsonNode personJson = Json.toJson(usuario);

        if (usuario != null)
        {
            return ok(Json.toJson(usuario));
        }
*/
        return (Result) ok("ok");
    }

    private static void SetUsuario(Usuario usuario, Form<? extends Usuario> formUsuario)
    {
        usuario.nombres = formUsuario.get().nombres;
        usuario.celular = formUsuario.get().celular;
        usuario.correoElectronico = formUsuario.get().correoElectronico;
        usuario.apellidos = formUsuario.get().apellidos;
        usuario.ciudad = formUsuario.get().ciudad;
        usuario.ciudad = formUsuario.get().ciudad;
        usuario.setContrasenia(formUsuario.get().contrasenia);
    }

}
