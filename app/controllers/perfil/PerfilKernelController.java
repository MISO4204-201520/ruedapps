package controllers.perfil;

import com.avaje.ebean.Ebean;
import models.perfil.*;
import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Results;
import views.html.login;

import java.util.ArrayList;
import java.util.List;


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
            return ok("Bienvenido!");
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
        Form<Ciclista> postForm = Form.form(Ciclista.class).bindFromRequest();
        if (postForm.hasErrors()) {
            return badRequest(postForm.errorsAsJson());
        }

        Ciclista ciclista = new Ciclista();
        SetUsuario(ciclista, postForm);
        //ciclista.fechaNacimiento = postForm.get().fechaNacimiento;
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

    public Result AgregarAmigo() {
        Form<AmigoDTO> postForm = Form.form(AmigoDTO.class).bindFromRequest();
        long usuario_id = postForm.get().usuarioId;
        long amigo_id = postForm.get().amigoId;

        Ciclista usuario = Ebean.find(Ciclista.class, usuario_id);
        Ciclista amigo = Ebean.find(Ciclista.class, amigo_id);

        if (usuario != null && amigo != null) {
            usuario.amigos.add(amigo);
            usuario.save();
            return ok(Json.toJson(usuario));
        }

        return Results.notFound();
    }

    public Result EliminarAmigo() {
        Form<AmigoDTO> postForm = Form.form(AmigoDTO.class).bindFromRequest();
        long usuario_id = postForm.get().usuarioId;
        long amigo_id = postForm.get().amigoId;

        Ciclista usuario = Ebean.find(Ciclista.class, usuario_id);

        if (usuario != null) {
            for(int i = 0; i < usuario.amigos.size(); i++) {
                Ciclista c = usuario.amigos.get(i);
                if(c.id == amigo_id) {
                    usuario.amigos.remove(i);
                    usuario.save();
                    return ok(Json.toJson(usuario));
                }
            }
        }

        return Results.notFound();
    }

    public Result Amigos(long id) {
        Ciclista usuario = Ebean.find(Ciclista.class, id);

        if (usuario != null) {
            List<Ciclista> amigos = usuario.amigos;
            return ok(Json.toJson(amigos));
        }

        return Results.notFound();
    }

    public Result NoAmigos(long id) {
        Ciclista usuario = Ebean.find(Ciclista.class, id);

        if (usuario != null) {
            List<Ciclista> amigos = usuario.amigos;
            List<Ciclista> ciclistas = Ebean.find(Ciclista.class).findList();
            List<Ciclista> noAmigos = new ArrayList<Ciclista>();

            for (int i = 0; i < ciclistas.size(); i++) {
                boolean existe = false;
                Ciclista c1 = ciclistas.get(i);

                if(c1.id != id) {
                    for (int j = 0; j < amigos.size(); j++) {
                        Ciclista c2 = amigos.get(j);
                        if(c1.id == c2.id) {
                            existe = true;
                            amigos.remove(c2);
                        }
                    }

                    if(!existe && c1.id != id) {
                        noAmigos.add(c1);
                    }
                }
            }

            return ok(Json.toJson(noAmigos));
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


}
