package models.ruta;

import com.avaje.ebean.Model;

import javax.persistence.*;
import java.util.List;

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
    @OneToOne(cascade = CascadeType.ALL)
    public Ubicacion origen;

    /**
     * Representa el punto final
     */
    @OneToOne(cascade = CascadeType.ALL)
    public Ubicacion destino;
}
