package models.directorio_servicios;

import com.avaje.ebean.Model;
import models.perfil.Proveedor;
import play.data.validation.Constraints;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Lina8a on 19/09/2015.
 * Entidad de servicio de directorio.
 */
@Entity
public class Servicio extends Model {

    // --------------------------------------------------------------------
    // Atributos
    // --------------------------------------------------------------------

    /**
     * Representa la llave primaria de la entidad.
     */
    @Id
    public long id;

    /**
     * Representa el nombre del servicio.
     */
    @Column(nullable = false)
    @Constraints.Required
    public String nombre;

    /**
     * Representa la descripción del servicio.
     */
    @Column(nullable = false)
    @Constraints.Required
    public String descripcion;

    /**
     * Representa el horario de atención del proveedor.
     * La cadena se concatena desde el lado del cliente.
     */
    @Column(nullable = false)
    @Constraints.Required
    public String horario;

    /**
     * Representa el precio del servicio.
     */
    @Column(nullable = false)
    @Constraints.Required
    public float precio;

    /**
     * Representa el teléfono donde se puede contactar al
     * proveedor para solicitar el servicio.
     */
    @Column
    public String telefono;

    /**
     * Define si el proveedor presta el servicio a domicilio
     * o solo desde el establecimiento.
     */
    @Column(nullable = false)
    @Constraints.Required
    public boolean domicilios;

    /**
     * Representa al proveedor que entrega el servicio.
     */
    @ManyToOne
    public Proveedor proveedor;

    /**
     * Representa la categoria a la que pertenece el servicio.
     */
    @ManyToOne
    public Categoria categoria;

}
