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
    public WebSocket<JsonNode> MensajeSocket() {
        return WebSocket.whenReady((in, out) -> {
            // Recibir mensaje desde forma Angular
            in.onMessage(node -> {
                // Crear mensaje desde nodo Json
                Mensaje mensaje = CrearMensaje(node);

                if (mensaje != null) {
                    // Guardar mensaje enviado
                    mensaje.save();

                    // Reenviar mensaje que llegó
                    out.write(node);
                }
            });

            // Registrar cierre de socket
            in.onClose(() -> System.out.println("Cerrado mensaje socket"));
        });
    }

    private Mensaje CrearMensaje(JsonNode node) {
        Ciclista ciclistaFrom = BuscarCiclistaPorCorreo(node.get("remitente").asText());
        Ciclista ciclistaTo = BuscarCiclistaPorCorreo(node.get("destinatario").asText());
        Mensaje nuevoMensaje = null;

        if (ciclistaFrom != null && ciclistaTo != null) {
            nuevoMensaje = new Mensaje();
            nuevoMensaje.fechaEnvio = new Date();
            nuevoMensaje.remitente = ciclistaFrom;
            nuevoMensaje.destinatario = ciclistaTo;
            nuevoMensaje.texto = node.get("mensaje").asText();
        }

        return nuevoMensaje;
    }

    private Mensaje CrearMensaje(MensajeDTO dto) {
        Ciclista ciclistaFrom = BuscarCiclistaPorCorreo(dto.remitente);
        Ciclista ciclistaTo = BuscarCiclistaPorCorreo(dto.destinatario);
        Mensaje nuevoMensaje = null;

        if (ciclistaFrom != null && ciclistaTo != null) {
            nuevoMensaje = new Mensaje();
            nuevoMensaje.fechaEnvio = new Date();
            nuevoMensaje.remitente = ciclistaFrom;
            nuevoMensaje.destinatario = ciclistaTo;
            nuevoMensaje.texto = dto.mensaje;
        }

        return nuevoMensaje;
    }


    private Ciclista BuscarCiclistaPorCorreo(String correo) {
        List<Ciclista> ciclistas = Ciclista.findCiclista.where().eq("correoElectronico", correo).findList();
        Ciclista ciclista = null;

        if (ciclistas != null && ciclistas.size() == 1) {
            ciclista = ciclistas.get(0);
        }

        return ciclista;
    }

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

    public Result Mensaje() {
        // Respuesta para forma Scala
        return ok("");
    }
}
