package models.ruta;

import com.avaje.ebean.Model;
import play.data.validation.Constraints;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.util.Date;

/**
 * Created by franciscoluisrv on 09/12/2015.
 * Entidad HistoricoRecorrido.
 */
@Entity
public class HistoricoRecorrido extends Model {

    // --------------------------------------------------------------------
    // Atributos
    // --------------------------------------------------------------------
    /**
     * Llave primaria de la entidad.
     */
    @Id
    public long id;

    /**
     * :
     */
    @ManyToOne
    public Recorrido recorrido;

    /**
     * Fecha y hora del recorrido
     */
    @Column
    @Constraints.Required
    public Date fecha;

    /**
     * Duración del recorrido en minutos
     */
    @Column
    @Constraints.Required
    public int duracion;
}