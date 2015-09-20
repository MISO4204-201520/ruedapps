package models.directorio_servicios;

import com.avaje.ebean.Model;
import play.data.validation.Constraints;

import javax.persistence.*;

/**
 * Created by Lina8a on 19/09/2015.
 * Entidad categoria de servicio de directorio.
 */
@Entity
public class Categoria extends Model{

    // --------------------------------------------------------------------
    // Atributos
    // --------------------------------------------------------------------

    /**
     * Representa la llave primaria de la entidad.
     */
    @Id
    public long id;

    /**
     * Representa el nombre de la categoria.
     */
    @Column(unique = true, nullable = false)
    @Constraints.Required
    public String nombre;

    /**
     * Representa la descripcion de la categoria.
     */
    @Column(nullable = false)
    @Constraints.Required
    public String descripcion;

}
