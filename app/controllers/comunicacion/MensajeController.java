package controllers.comunicacion;

import com.fasterxml.jackson.databind.JsonNode;
import models.comunicacion.Mensaje;
import models.comunicacion.MensajeDTO;
import models.perfil.Ciclista;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Results;
import play.mvc.WebSocket;

import java.util.Date;
import java.util.List;

/*
 * Created by franciscoluisrv on 10/03/2015.
 */
public class MensajeController extends Controller {

    public Result MensajePost() {
        // Recibir mensaje desde forma Scala
        Form<MensajeDTO> postForm = Form.form(MensajeDTO.class).bindFromRequest();
        Mensaje mensaje = CrearMensaje(postForm.get());

        if (mensaje != null) {
            // Guardar mensaje
            mensaje.save();

            return Results.created("Mensaje enviado");
        } else {
            return Results.notFound("Usuario no encontrado");
        }
    }

    public WebSocket<JsonNode> MensajeSocket() {
        return WebSocket.whenReady((in, out) -> {
            // Recibir mensaje desde forma Angular
            in.onMessage(node -> {
                // Crear dto desde nodo Json
                MensajeDTO dto = new MensajeDTO();
                dto.remitente = node.get("remitente").asText();
                dto.destinatario = node.get("destinatario").asText();
                dto.mensaje = node.get("mensaje").asText();
                Mensaje mensaje = CrearMensaje(dto);

                if (mensaje != null) {
                    // Guardar mensaje cuando llega
                    mensaje.save();

                    // Reenviar mensaje que llegó
                    out.write(node);
                }
            });

            // Registrar cierre de socket
            in.onClose(() -> System.out.println("Cerrado mensaje socket"));
        });
    }

    private Mensaje CrearMensaje(MensajeDTO dto) {
        List<Ciclista> ciclistaFrom = Ciclista.findCiclista.where().eq("correoElectronico", dto.remitente).findList();
        List<Ciclista> ciclistaTo = Ciclista.findCiclista.where().eq("correoElectronico", dto.destinatario).findList();
        Mensaje nuevoMensaje = null;

        if (ciclistaFrom != null && ciclistaFrom.size() == 1 && ciclistaTo != null && ciclistaTo.size() == 1) {
            nuevoMensaje = new Mensaje();
            nuevoMensaje.fechaEnvio = new Date();
            nuevoMensaje.remitente = ciclistaFrom.get(0);
            nuevoMensaje.destinatario = ciclistaTo.get(0);
            nuevoMensaje.texto = dto.mensaje;
        }

        return nuevoMensaje;
    }

    public Result Mensaje() {
        return ok("");
    }
}
