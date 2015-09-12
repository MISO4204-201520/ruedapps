package models.perfil;

import play.data.validation.Constraints;

import javax.persistence.Column;
import javax.persistence.Entity;

/**
 * Created by franciscoluisrv on 09/12/2015.
 * Entidad Ciclista.
 */
@Entity
public class Proveedor extends Usuario  {

    // --------------------------------------------------------------------
    // Atributos
    // --------------------------------------------------------------------
    /**
     * Representa el NIT del provedor
     */
    @Column(nullable = false)
    @Constraints.Required
    public String NIT;

    /**
     * Representa el nombre del local o empresa donde el proveedor presta sus servicios
     */
    @Column(nullable = false)
    @Constraints.Required
    public String NombreNegocio;
}
