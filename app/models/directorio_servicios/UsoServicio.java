package models.directorio_servicios;

import com.avaje.ebean.Model;
import models.perfil.Ciclista;
import play.data.validation.Constraints;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import java.util.Date;

/**
 * Created by Lina8a on 19/09/2015.
 * Entidad de uso de servicio.
 */
public class UsoServicio extends Model {

    // --------------------------------------------------------------------
    // Atributos
    // --------------------------------------------------------------------

    /**
     * Llave primaria de la entidad.
     */
    @Id
    public long id;

    /**
     * Representa al ciclista que solicitó el servicio.
     */
    @OneToOne
    public Ciclista ciclista;

    /**
     * Representa el servicio solicitado por el ciclista.
     */
    @OneToOne
    public Servicio servicio;

    /**
     * Fecha y hora de la solicitud del servicio.
     */
    @Column(nullable = false)
    @Constraints.Required
    public Date fechaInicio;

    /**
     * Fecha en la que culmina el préstamo del servicio.
     */
    @Column(nullable = false)
    @Constraints.Required
    public Date fechaFin;
}
