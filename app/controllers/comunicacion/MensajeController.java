package controllers.comunicacion;

import models.comunicacion.Mensaje;
import models.comunicacion.MensajeDTO;
import models.perfil.Ciclista;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.comunicacion.mensaje;

import java.util.Date;
import java.util.List;

/**
 * Created by franciscoluisrv on 10/03/2015.
 */
public class MensajeController extends Controller {

    public Result MensajePost()
    {
        Form<MensajeDTO> postForm = Form.form(MensajeDTO.class).bindFromRequest();
        String to = postForm.get().getTo();
        String text = postForm.get().getText();

        Ciclista ciclistaFrom = Ciclista.findCiclista.byId(Long.parseLong(session("loggedUser")));
        List<Ciclista> ciclistaTo = Ciclista.findCiclista.where().eq("correoElectronico", to).findList();

        if (ciclistaFrom != null && ciclistaTo != null && ciclistaTo.size() == 1)
        {
            // TODO: Enviar mensaje

            // Guardar mensaje
            Mensaje nuevoMensaje = new Mensaje();
            nuevoMensaje.fechaEnvio = new Date();
            nuevoMensaje.remitente = ciclistaFrom;
            nuevoMensaje.destinatario = ciclistaTo.get(0);
            nuevoMensaje.texto = text;
            nuevoMensaje.save();

            return ok(mensaje.render("Mensaje enviado"));
        }
        else
        {
            return ok(mensaje.render("Usuario no encontrado"));
        }
    }

    public Result Mensaje() {
        return ok(mensaje.render(""));
    }
}
