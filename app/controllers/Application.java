package controllers;


import play.Play;
import play.mvc.Controller;
import play.mvc.Result;
import variables.*;
import views.html.index;


import java.util.HashMap;

public class Application extends Controller {

    RedesSociales redesSociales = new RedesSociales(true, false);
    Portabilidad portabilidad = new Portabilidad(false);

    public Result index()   {
        Boolean opcionesMenu[] = this.leerOpcionesMenu();
        return ok(index.render("ok", opcionesMenu,redesSociales,portabilidad));
    }

    private Boolean[] leerOpcionesMenu()  {

        String derivacionmenu = Play.application().configuration().getString("derivacion.menu");
        String[] opciones = derivacionmenu.split(",");
        Boolean opcionesMenu[] = new Boolean[12];
        int index = 0;

        for (String opcion : opciones) {
            opcionesMenu[index++] = opcion.equalsIgnoreCase("1");
        }

        return opcionesMenu;
    }
}
