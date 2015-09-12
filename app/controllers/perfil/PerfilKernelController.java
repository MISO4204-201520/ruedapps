package controllers.perfil;

import models.perfil.LoginDTO;
import play.mvc.Controller;

import javax.xml.transform.Result;

/**
 * Created by Lina8a on 06/09/2015.
 */
public class PerfilKernelController extends Controller {

    public static Result login(LoginDTO loginDTO) {
        return (Result) ok("Hola");
    }

    public static Result registro(LoginDTO loginDTO) {
        return (Result) ok("Hola");
    }
}
