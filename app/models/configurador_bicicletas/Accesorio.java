package models.configurador_bicicletas;

import annotations.Feature;
import com.avaje.ebean.Model;
import play.data.validation.Constraints;

import javax.persistence.*;

/**
 * Created by Lina8a on 06/11/2015.
 */
@Feature(nombre = "ConfiguradorBicicletas")
@Entity
public class Accesorio extends Model {
    @Id
    public long id;

    @Column(nullable = false)
    @Constraints.Required
    public String nombre;

    @ManyToOne
    @JoinColumn(name="bicicleta_id")
    public Bicicleta bicicleta;
}
