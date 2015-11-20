package models.configurador_bicicletas;

import annotations.Feature;
import com.avaje.ebean.Model;
import play.data.validation.Constraints;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Lina8a on 06/11/2015.
 * Entidad bicicleta.
 */
@Feature(nombre = "ConfiguradorBicicletas")
@Entity
public class Bicicleta extends Model {

    // --------------------------------------------------------------------
    // Atributos
    // --------------------------------------------------------------------

    /**
     * Representa la llave primaria de la entidad.
     */
    @Id
    public long id;

    /**
     * Color de la biclicleta
     */
    @Column(nullable = false)
    @Constraints.Required
    private String color;

    /**
     * Tamanio de la bicicleta
     */
    @Column(nullable = false)
    @Constraints.Required
    private String tamanio;

    /**
     * Llantas de la bicicleta
     */
    @Column(nullable = false)
    @Constraints.Required
    private String llantas;

    /**
     * Sillin de la bicicleta
     */
    @Column(nullable = false)
    @Constraints.Required
    private String sillin;

    /**
     * Accesorios de la bicicleta
     */
    /*@OneToMany(mappedBy="bicicleta")
    private List<Accesorio> accesorios;*/

    /**
     * Constructor de la clase bicicleta
     * @param builder
     */
    public Bicicleta(BicicletaBuilder builder) {
        this.color = builder.color;
        this.tamanio = builder.tamanio;
        this.llantas = builder.llantas;
        this.sillin = builder.sillin;
        //this.accesorios = builder.accesorios;
    }

    /**
     * Getter del color
     * @return color
     */
    public String getColor() {
        return color;
    }

    /**
     * Getter del tamanio
     * @return tamanio
     */
    public String getTamanio() {
        return tamanio;
    }

    /**
     * Getter de las llantas
     * @return llantas
     */
    public String getLlantas() {
        return llantas;
    }

    /**
     * Getter del sillin
     * @return sillin
     */
    public String getSillin() {
        return sillin;
    }

    /**
     * Getter de los accesorios
     * @return
     */
    /*public List<Accesorio> getAccesorios() {
        return accesorios;
    }*/
}
