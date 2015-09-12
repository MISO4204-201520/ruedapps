package models.ruta;

import com.avaje.ebean.Model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
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
    @OneToMany
    public List<Ubicacion> secuenciaUbicaciones;

    /*
     * Histórico de recorridos que se han hecho por la aplicación
     */
    @OneToMany(mappedBy = "recorrido")
    public List<HistoricoRecorrido> historicoRecorridos;
}
