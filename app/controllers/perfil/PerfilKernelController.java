package controllers.perfil;

import models.perfil.LoginDTO;
import play.mvc.*;
import views.html.login;

import javax.xml.transform.Result;

/**
 * Created by Lina8a on 06/09/2015.
 */
public class PerfilKernelController extends Controller {

    public static Result login() {
        return (Result)(login.render("is ok"));
    }
    public static Result auth(LoginDTO loginDTO) {
        return null;
    }

    public static Result registro(LoginDTO loginDTO) {
        return (Result) ok("Hola");
    }
}
