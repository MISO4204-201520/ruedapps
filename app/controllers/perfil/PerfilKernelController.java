package controllers.perfil;

import com.avaje.ebean.Ebean;
import com.fasterxml.jackson.databind.JsonNode;
import models.perfil.Ciclista;
import models.perfil.LoginDTO;
import models.perfil.Usuario;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Results;
import views.html.login;
import play.libs.Json;

import java.util.List;


/**
 * Created by Lina8a on 06/09/2015.
 */
public class PerfilKernelController extends Controller {

    public Result LoginPost()
    {
        Form<LoginDTO> postForm = Form.form(LoginDTO.class).bindFromRequest();
        String correoLogin = postForm.get().getCorreoElectronico();
        List<Usuario> usuario = Usuario.find.where().eq("correoElectronico", correoLogin).findList();

        if (usuario != null && usuario.size() > 0 && usuario.get(0).VerificaContrasenia(postForm.get().getContrasenia()))
        {
            session("loggedUser", correoLogin);
            return ok("loginOk");
        }

        return Results.unauthorized();
    }

    public Result Login() {
        return ok(login.render("is ok"));
    }

    public Result LogOut() {
        session().remove("loggedUser");
        return ok(login.render("is ok"));
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
            String correoLogin = postForm.get().correoElectronico;
            List<Usuario> usuario = Usuario.find.where().eq("correoElectronico", correoLogin).findList();

            if (usuario != null && usuario.size() > 0) {
                Ciclista ciclista = (Ciclista) usuario.get(0);
                SetUsuario(ciclista, postForm);
                ciclista.update();
            }
            else
            {
                return Results.notFound();
            }
        }

        return Results.created();
    }

    public Result ConsultarUsuarioPorId(long id)
    {
        Ciclista usuario = Ebean.find(Ciclista.class, id);

        if (usuario != null)
        {
            return ok(Json.toJson(usuario));
        }

        return Results.notFound();
    }

    private static void SetUsuario(Usuario usuario, Form<? extends Usuario> formUsuario)
    {
        usuario.nombres = formUsuario.get().nombres;
        usuario.celular = formUsuario.get().celular;
        usuario.correoElectronico = formUsuario.get().correoElectronico;
        usuario.apellidos = formUsuario.get().apellidos;
        usuario.ciudad = formUsuario.get().ciudad;
        usuario.SetHashedContrasenia(formUsuario.get().contrasenia);
    }

}
