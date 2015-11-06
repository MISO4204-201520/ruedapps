package models.configurador_bicicletas;

import com.avaje.ebean.Model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import play.data.validation.Constraints;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Lina8a on 06/11/2015.
 * Entidad bicicleta.
 */
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
    private final String color;

    /**
     * Tamanio de la bicicleta
     */
    @Column(nullable = false)
    @Constraints.Required
    private final String tamanio;

    /**
     * Llantas de la bicicleta
     */
    @Column(nullable = false)
    @Constraints.Required
    private final String llantas;

    /**
     * Sillin de la bicicleta
     */
    @Column(nullable = false)
    @Constraints.Required
    private final String sillin;

    /**
     * Accesorios de la bicileta
     */
    //@OneToMany(mappedBy = "bicicleta", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    //@JsonIgnore
    private final List<String> accesorios;

    /**
     * Constructor de la clase bicicleta
     * @param builder
     */
    private Bicicleta(BicicletaBuilder builder) {
        this.color = builder.color;
        this.tamanio = builder.tamanio;
        this.llantas = builder.llantas;
        this.sillin = builder.sillin;
        this.accesorios = builder.accesorios;
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
    public List<String> getAccesorios() {
        return accesorios;
    }

    /**
     * Builder de una bicicleta.
     */
    public static class BicicletaBuilder {

        /**
         * Color de la biclicleta
         */
        private String color;

        /**
         * Tamanio de la bicicleta
         */
        private String tamanio;

        /**
         * Llantas de la bicicleta
         */
        private String llantas;

        /**
         * Sillin de la bicicleta
         */
        private String sillin;

        /**
         * Accesorios de la bicileta
         */
        private List<String> accesorios;

        /**
         * Constructor del builder
         */
        public BicicletaBuilder() {
            this.accesorios = new ArrayList<String>();
        }

        /**
         * Setter del color
         * @param color
         * @return builder
         */
        public BicicletaBuilder color(String color) {
            if(color.equals(BicicletaConstantes.COLOR_AZUL) ||
                    color.equals(BicicletaConstantes.COLOR_BLANCO) ||
                    color.equals(BicicletaConstantes.COLOR_VERDE)) {
                this.color = color;
            }
            return this;
        }

        /**
         * Setter del tamanio
         * @param tamanio
         * @return builder
         */
        public BicicletaBuilder tamanio(String tamanio) {
            if(tamanio.equals(BicicletaConstantes.TAMAANIO_GRANDE) ||
                    tamanio.equals(BicicletaConstantes.TAMANIO_MEDIANA) ||
                    tamanio.equals(BicicletaConstantes.TAMANIO_PEQUENIA)) {
                this.tamanio = tamanio;
            }
            return this;
        }

        /**
         * Setter de las llantas
         * @param llantas
         * @return builder
         */
        public BicicletaBuilder llantas(String llantas) {
            if(llantas.equals(BicicletaConstantes.LLANTAS_CIUDAD) ||
                    llantas.equals(BicicletaConstantes.LLANTAS_MONTANIA) ||
                    llantas.equals(BicicletaConstantes.LLANTAS_VELOCIDAD)) {
                this.llantas = llantas;
            }
            return this;
        }

        /**
         * Setter del sillin
         * @param sillin
         * @return builder
         */
        public BicicletaBuilder sillin(String sillin) {
            if(sillin.equals(BicicletaConstantes.SILLIN_ANCHO) ||
                    sillin.equals(BicicletaConstantes.SILLIN_CARRERA) ||
                    sillin.equals(BicicletaConstantes.SILLIN_CON_ABERTURA)) {
                this.sillin = sillin;
            }
            return this;
        }

        /**
         * Setter de los accesorios
         * @param accesorio
         * @return builder
         */
        public BicicletaBuilder accesorios(String accesorio) {
            if(accesorio.equals(BicicletaConstantes.ACCESORIOS_CANASTA) ||
                    accesorio.equals(BicicletaConstantes.ACCESORIOS_PITO)) {
                this.accesorios.add(accesorio);
            }
            return this;
        }

        /**
         * Método encargado de construir una bicicleta a partir del builder.
         * @return bicicleta
         */
        public Bicicleta build() {
            return new Bicicleta(this);
        }
    }
}
