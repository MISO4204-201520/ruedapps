package controllers;

import play.mvc.Controller;
import play.mvc.Result;
import views.html.index;

public class Application extends Controller {
    Boolean opcionesMenu[] = {true, true, true, true, true, true, true, true, true, true, true, true};
    public Result index() {
        return ok(index.render("ok", opcionesMenu));
    }
}
