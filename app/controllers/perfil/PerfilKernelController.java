package controllers.perfil;


import com.avaje.ebean.Ebean;
import models.configurador_bicicletas.Bicicleta;
import models.perfil.*;
import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Results;
import views.html.login;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static play.libs.Json.toJson;


/*
 * Created by Lina8a on 06/09/2015.
 */
public class PerfilKernelController extends Controller {


    public Result LoginPost() {
        Form<LoginDTO> postForm = Form.form(LoginDTO.class).bindFromRequest();
        String correoLogin = postForm.get().getCorreoElectronico();
        List<Usuario> usuario = Usuario.find.where().eq("correoElectronico", correoLogin).findList();

        if (usuario != null && usuario.size() > 0 && usuario.get(0).verificaContrasenia(postForm.get().getContrasenia())) {
            session().put("loggedUser", String.valueOf(usuario.get(0).id));
            return ok( String.valueOf(usuario.get(0).id));
        } else {
            return Results.unauthorized("El usuario y la clave no coinciden");
        }
    }

    public Result Login() {
        return ok(login.render("Hola, por favor ingrese"));
    }

    public Result LogOut() {
        session().remove("loggedUser");
        return ok(login.render("Adiós!"));
    }

    public Result CrearUsuario() {
        Form<RegistroDTO> postForm = Form.form(RegistroDTO.class).bindFromRequest();
        if (postForm.hasErrors()) {
            return badRequest(postForm.errorsAsJson());
        }

        Ciclista ciclista = new Ciclista();
        SetCiclista(ciclista, postForm);
        ciclista.save();

        return Results.created();
    }

    public Result CrearProveedor() {
        Form<Proveedor> postForm = Form.form(Proveedor.class).bindFromRequest();
        if (postForm.hasErrors()) {
            return badRequest(postForm.errorsAsJson());
        }

        Proveedor proveedor = new Proveedor();
        SetUsuario(proveedor, postForm);
        proveedor.nit = postForm.get().nit;
        proveedor.nombreNegocio = postForm.get().nombreNegocio;
        proveedor.save();

        return Results.created();
    }

    public Result ConsultarUsuarioPorId(long id) {
        Ciclista usuario = Ebean.find(Ciclista.class, id);

        if (usuario != null) {
            return ok(Json.toJson(usuario));
        }

        return Results.notFound();
    }

    public Result Ciclistas() {
        List<Ciclista> ciclistas = Ebean.find(Ciclista.class).findList();
        return ok(Json.toJson(ciclistas));
    }

    public Result ConsultarUsuarioPorEmail(String email) {
        if(email != null) {
            List<Usuario> usuario = Usuario.find.where().eq("correoElectronico", email).findList();

            if (usuario != null && usuario.size() > 0) {
                Ciclista ciclista = (Ciclista) usuario.get(0);
                return ok(Json.toJson(ciclista.id));
            }
            else {
                return Results.notFound();
            }
        }

        return Results.notFound();
    }

    private static void SetUsuario(Usuario usuario, Form<? extends Usuario> formUsuario) {
        usuario.nombres = formUsuario.get().nombres;
        usuario.celular = formUsuario.get().celular;
        usuario.correoElectronico = formUsuario.get().correoElectronico;
        usuario.apellidos = formUsuario.get().apellidos;
        usuario.ciudad = formUsuario.get().ciudad;
        usuario.hashContrasenia(formUsuario.get().contrasenia);
    }

    private static void SetCiclista(Ciclista usuario, Form<? extends RegistroDTO> formUsuario) {
        usuario.nombres = formUsuario.get().getNombres();
        usuario.celular = formUsuario.get().getCelular();
        usuario.correoElectronico = formUsuario.get().getCorreoElectronico();
        usuario.apellidos = formUsuario.get().getApellidos();
        usuario.ciudad = formUsuario.get().getCiudad();

        try {
            DateFormat formato = new SimpleDateFormat("yyyy/MM/dd");
            usuario.fechaNacimiento = formato.parse(formUsuario.get().fechaNacimiento);
        }
        catch (Exception e) {
            usuario.fechaNacimiento = new Date();
        }

        usuario.hashContrasenia(formUsuario.get().getContrasenia());
    }

    public Result ObtenerBicicletasUsuario(long idUsuario) {
        Usuario usuario = Ebean.find(Usuario.class, idUsuario);

        List<Bicicleta> bicicletas = new ArrayList<>();
        if (usuario != null && usuario instanceof Ciclista) {
            Ciclista ciclista = (Ciclista) usuario;
            bicicletas = ciclista.bicicletas;
        }
        return ok(toJson(bicicletas));
    }

}
