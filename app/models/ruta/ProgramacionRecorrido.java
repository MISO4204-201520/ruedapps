package models.ruta;

import com.avaje.ebean.Model;
import models.perfil.Ciclista;
import play.data.validation.Constraints;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

/**
 * Created by Juan on 10/25/2015.
 */
@Entity
public class ProgramacionRecorrido  extends Model {

    // --------------------------------------------------------------------
    // Atributos
    // --------------------------------------------------------------------
    /*
     * Llave primaria de la entidad.
     */
    @Id
    public long id;


    /*
 * Fecha y hora inicio del recorrido
 */
    @Column
    @Constraints.Required
    public Date fechaInicio;


    /*
 * Fecha y hora inicio del recorrido
 */
    @Column
    @Constraints.Required
    public String descripcion;


    /*
 * Fecha y hora inicio del recorrido
 */
    /*
     * Recorrido programado
     */
    @ManyToOne
    public Recorrido recorrido;


    /*
 * ciclistas participantes
 */
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    public List<Ciclista> participantes;

    /*
 * Mensajes que ha recibido el usuario
 */
    @ManyToOne
    public Ciclista organizador;
}
