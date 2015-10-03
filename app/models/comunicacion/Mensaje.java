package models.comunicacion;

import com.avaje.ebean.Model;
import models.perfil.Ciclista;
import play.data.validation.Constraints;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.util.Date;

/**
 * Created by franciscoluisrv on 10/03/2015.
 * Entidad Mensaje.
 */
@Entity
public class Mensaje extends Model {
    // --------------------------------------------------------------------
    // Atributos
    // --------------------------------------------------------------------

    /**
     * Representa la llave primaria de la entidad.
     */
    @Id
    public long id;

    /**
     * Representa la fecha en que se envió el mensaje
     */
    @Column(nullable = false)
    @Constraints.Required
    public Date fechaEnvio;

    /**
     * Representa el texto del mensaje
     */
    @Column(nullable = false)
    @Constraints.Required
    public String texto;

    /*
     * Representa el remitente del mensaje
     */
    @ManyToOne
    @Constraints.Required
    public Ciclista remitente;

    /*
     * Representa el destinatario del mensaje
     */
    @ManyToOne
    @Constraints.Required
    public Ciclista destinatario;
}
