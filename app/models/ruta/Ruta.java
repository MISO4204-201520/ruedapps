package models.ruta;

import com.avaje.ebean.Model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
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
    @OneToOne
    public Ubicacion origen;

    /**
     * Representa el punto final
     */
    @OneToOne
    public Ubicacion destino;

    /*
     * Representa los recorridos asociados a esta ruta
     */
    @OneToMany(mappedBy = "ruta")
    public List<Recorrido> recorridos;
}
