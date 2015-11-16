package controllers;


import play.mvc.Controller;
import play.mvc.Result;
import variables.*;
import views.html.index;


import java.util.HashMap;

public class Application extends Controller {
    RedesSociales redesSociales = new RedesSociales(true, false);
    Portabilidad portabilidad = new Portabilidad(false);

    Boolean opcionesMenu[] = {true, true, true, true, true, true, true, true, true, true, true, true};
    public Result index() {
        return ok(index.render("ok", opcionesMenu,redesSociales,portabilidad));
    }
}
