package controllers;


import play.Play;
import play.mvc.Controller;
import play.mvc.Result;
import variables.*;
import views.html.index;

public class Application extends Controller {

    public Result index()   {
        Boolean opcionesMenu[] = this.leerOpcionesMenu();
        Boolean opcionesApp[] = this.leerOpcionesAplicacion();

        RedesSociales redesSociales = this.leerRedesSociales();
        Portabilidad portabilidad = this.leerPortabilidad();
        Eficiencia eficiencia = this.leerEficiencia();

        return ok(index.render("ok", opcionesMenu, redesSociales, portabilidad, eficiencia, opcionesApp));
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

    private Boolean[] leerOpcionesAplicacion()  {

        Boolean opciones[] = new Boolean[4];
        int index = 0;

        opciones[index++] = this.leerOpcion("derivacion.grupal");
        opciones[index++] = this.leerOpcion("derivacion.gestionAmigos");
        opciones[index++] = this.leerOpcion("derivacion.historico");
        opciones[index++] = this.leerOpcion("derivacion.directorio");

        return opciones;
    }

    private Boolean leerOpcion(String nombre) {
        String derivacion = Play.application().configuration().getString(nombre);
        return derivacion.equalsIgnoreCase("1");
    }

    private RedesSociales leerRedesSociales()  {

        RedesSociales redesSociales = new RedesSociales(this.leerOpcion("derivacion.twitter"), this.leerOpcion("derivacion.facebook"));
        return redesSociales;

    }
    private Portabilidad leerPortabilidad()  {

        Portabilidad portabilidad = new Portabilidad(this.leerOpcion("derivacion.responsive"));
        return portabilidad;

    }
    private Eficiencia leerEficiencia()  {

        Eficiencia eficiencia = new Eficiencia(this.leerOpcion("derivacion.eficiencia"));
        return eficiencia;

    }

}
