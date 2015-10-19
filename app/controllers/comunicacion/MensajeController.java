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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/*
 * Created by franciscoluisrv on 10/03/2015.
 */
public class MensajeController extends Controller {
    private static Map<String, WebSocket.Out<JsonNode>> conectados = new HashMap<>();

    public WebSocket<JsonNode> MensajeSocket() {
        final String user = session().get("loggedUser");

        return WebSocket.whenReady((WebSocket.In<JsonNode> in, WebSocket.Out<JsonNode> out) -> {
            // Agregar canal de salida a listado de usuarios conectados
            conectados.put(user, out);

            // Recibir mensaje desde forma Angular
            in.onMessage(node -> {
                // Crear mensaje desde nodo Json
                Mensaje mensaje = CrearMensaje(node);

                if (mensaje != null) {
                    // Guardar mensaje enviado
                    mensaje.save();

                    // Encontrar canal de salida del usuario conectado
                    WebSocket.Out<JsonNode> conectado = conectados.get(String.valueOf(mensaje.destinatario.id));

                    // Enviar mensaje
                    conectado.write(node);
                }
            });

            // Registrar cierre de socket
            in.onClose(() -> {
                conectados.remove(user);
                System.out.println("Cerrado mensaje socket");
            });
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
