package models.configurador_bicicletas;

import annotations.Feature;

import java.util.List;

/**
 * Created by Lina8a on 06/11/2015.
 */
@Feature(nombre = "ConfiguradorBicicletas")
public class BicicletaDTO {
    /**
     * Color de la biclicleta
     */
    public String color;

    /**
     * Tamanio de la bicicleta
     */
    public String tamanio;

    /**
     * Llantas de la bicicleta
     */
    public String llantas;

    /**
     * Sillin de la bicicleta
     */
    public String sillin;

    /**
     * Accesorios de la bicileta
     */
    public List<String> accesorios;
}
