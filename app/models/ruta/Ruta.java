package models.ruta;

import com.avaje.ebean.Model;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

/**
 * Created by franciscoluisrv on 09/12/2015.
 * Entidad Ruta.
 */
@Entity
public class Ruta extends Model {

    // --------------------------------------------------------------------
    // Atributos
    // --------------------------------------------------------------------
    /**
     * Representa la llave primaria de la entidad.
     */
    @Id
    public long id;

    /**
     * Representa el punto inicial de la ruta
     */
    @ManyToOne(cascade = CascadeType.ALL)
    public Ubicacion origen;

    /**
     * Representa el punto final
     */
    @ManyToOne(cascade = CascadeType.ALL)
    public Ubicacion destino;
}
