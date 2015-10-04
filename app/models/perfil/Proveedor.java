package models.perfil;

import play.data.validation.Constraints;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Created by franciscoluisrv on 09/12/2015.
 * Entidad Ciclista.
 */
@Entity
@DiscriminatorValue("Proveedor")
public class Proveedor extends Usuario  {

    // --------------------------------------------------------------------
    // Atributos
    // --------------------------------------------------------------------
    /**
     * Representa el NIT del provedor
     */
    @Column(nullable = false)
    @Constraints.Required
    public String nit;

    /**
     * Representa el nombre del local o empresa donde el proveedor presta sus servicios
     */
    @Column(nullable = false)
    @Constraints.Required
    public String nombreNegocio;
}
