package controllers.perfil;

import com.avaje.ebean.Ebean;
import com.fasterxml.jackson.databind.JsonNode;
import models.perfil.Ciclista;
import models.perfil.LoginDTO;
import models.perfil.Proveedor;
import models.perfil.Usuario;
import play.data.Form;
import play.libs.Json;
import play.mvc.BodyParser;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Results;
import play.libs.Json;
import views.html.login;

import java.util.Date;
import java.util.List;


/**
 * Created by Lina8a on 06/09/2015.
 */
public class PerfilKernelController extends Controller {

    @BodyParser.Of(play.mvc.BodyParser.Json.class)
    public Result LoginPost()
    {
        JsonNode json = request().body().asJson();
        System.out.println("BODY " + request().body());
        System.out.println("JSON " + json);

//        Form<LoginDTO> postForm = Form.form(LoginDTO.class).bindFromRequest();
//        String correoLogin = postForm.get().getCorreoElectronico();
        List<Usuario> usuario = Usuario.find.where().eq("correoElectronico", json.findValue("correoElectronico").toString()).findList();

        if (usuario != null && usuario.size() > 0 && usuario.get(0).VerificaContrasenia(json.findValue("contrasenia").toString()))
        {
            session().put("loggedUser", String.valueOf(usuario.get(0).id));
            return ok("Bienvenido!");
        }

        return Results.unauthorized();
    }

    public Result Login() {
        return ok(login.render("Hola, por favor ingrese"));
    }

    public Result LogOut() {
        session().remove("loggedUser");
        return ok(login.render("Adiós!"));
    }

    @BodyParser.Of(play.mvc.BodyParser.Json.class)
    public Result CrearUsuario( )
    {
        JsonNode json = request().body().asJson();
        Ciclista ciclista = new Ciclista();
        SetUsuario(ciclista, json);
        ciclista.fechaNacimiento = new Date();
        //TODO: Definir fecha desde la vista
        ciclista.save();

        return Results.created();
    }

    public Result CrearProveedor()
    {
        Form<Proveedor> postForm = Form.form(Proveedor.class).bindFromRequest();
        if (postForm.hasErrors())
        {
            return badRequest(postForm.errorsAsJson());
        }

        Proveedor proveedor = new Proveedor();
        //SetUsuario(proveedor, postForm);
        proveedor.nit = postForm.get().nit;
        proveedor.nombreNegocio = postForm.get().nombreNegocio;
        proveedor.save();

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
                //SetUsuario(ciclista, postForm);
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

    private static void SetUsuario(Usuario usuario, JsonNode json)
    {
        usuario.nombres = json.findValue("nombres").toString();
        usuario.celular = json.findValue("celular").toString();
        usuario.correoElectronico = json.findValue("correoElectronico").toString();
        usuario.apellidos = json.findValue("apellidos").toString();
        usuario.ciudad = json.findValue("ciudad").toString();
        usuario.SetHashedContrasenia(json.findValue("contrasenia").toString());
    }

}
