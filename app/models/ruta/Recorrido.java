package models.ruta;

import com.avaje.ebean.Model;

import javax.persistence.*;
import java.util.List;

/**
 * Created by franciscoluisrv on 09/12/2015.
 * Entidad Recorrido.
 */
@Entity
public class Recorrido extends Model {

    // --------------------------------------------------------------------
    // Atributos
    // --------------------------------------------------------------------
    /**
     * Llave primaria de la entidad.
     */
    @Id
    public long id;

    /**
     * Ruta asociada al recorrido
     */
    @ManyToOne
    public Ruta ruta;

    /**
     * Descripción de la ruta
     */
    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    public List<Ubicacion> secuenciaUbicaciones;

}
