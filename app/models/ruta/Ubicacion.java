package models.ruta;

import com.avaje.ebean.Model;
import play.data.validation.Constraints;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

/**
 * Created by franciscoluisrv on 9/12/2015.
 * Entidad Ubicacion
 */
@Entity
public class Ubicacion extends Model {

    /**
     * Representa la llave primaria de la entidad.
     */
    @Id
    public long id;

    /*
     * Nombre del lugar
     */
    @Column(nullable = false)
    @Constraints.Required
    public String nombre;

    // --------------------------------------------------------------------
    // Atributos
    // --------------------------------------------------------------------
    /**
     * Posición vertical
     */
    @Column(nullable = false)
    @Constraints.Required
    public float latitud;

    /**
     * Posición horizontal
     */
    @Column(nullable = false)
    @Constraints.Required
    public float longitud;
}
