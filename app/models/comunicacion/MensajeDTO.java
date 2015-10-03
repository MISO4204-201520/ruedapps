package models.comunicacion;

/**
 * Created by franciscoluisrv on 10/03/2015.
 * DTO del envío de mensajes
 */
public class MensajeDTO {

    // --------------------------------------------------------------------
    // Atributos
    // --------------------------------------------------------------------

    private String to;

    private String text;

    /**
     * Destinatario del mensaje
     */
    public String getTo() {
        return to;
    }

    /**
     * Texto del mensaje
     */
    public String getText() {
        return text;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public void setText(String text) {
        this.text = text;
    }
}
