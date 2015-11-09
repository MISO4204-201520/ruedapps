/**
 * Created by jasmo2 on 11/7/15.
 */
package controllers.perfil;

import com.fasterxml.jackson.databind.JsonNode;
import models.perfil.Ciclista;
import models.perfil.LoginOAuth;
import models.perfil.Usuario;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Results;

import java.util.HashMap;
import java.util.List;

public class PerfilOptionalController extends Controller {


    private Usuario usuario;
    private Form<LoginOAuth> p;

    public Result LoginFacebook() {
        Form<LoginOAuth> postForm = Form.form(LoginOAuth.class).bindFromRequest();
            CheckUserExistance(postForm);
        return ok("Login externo");

    }
    public Result LoginTwitter() {
        Form<LoginOAuth> postForm = Form.form(LoginOAuth.class).bindFromRequest();
        CheckUserExistance(postForm);
        return ok("Login externo");
    }
    public Result LoginGoogle() {
        Form<LoginOAuth> postForm = Form.form(LoginOAuth.class).bindFromRequest();
        CheckUserExistance(postForm);
        return ok("Login externo");

    }
    private void CheckUserExistance(Form<LoginOAuth> postForm){
        String oauthLogin = postForm.get().getProveedor_id();

        List<Usuario> usuario = Usuario.find.where().eq("proveedor_id", oauthLogin).findList();

        if (usuario != null && usuario.size() > 0 ) {
            session().put("loggedUser", String.valueOf(usuario.get(0).id));
        } else {
            Ciclista ciclista = new Ciclista();
            SetUsuario(ciclista, postForm);
            //ciclista.fechaNacimiento = postForm.get().fechaNacimiento;
            ciclista.save();
        }
    }

    protected void SetUsuario(Usuario usuario, Form<LoginOAuth> p) {
        usuario.nombres =  p.get().getNombre();
        usuario.proveedor_id =  p.get().getProveedor_id();
    }

}
