package models.perfil;

import models.ruta.HistoricoRecorrido;
import play.data.validation.Constraints;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

/**
 * Created by franciscoluisrv on 09/12/2015.
 * Entidad Ciclista.
 */
@Entity
@DiscriminatorValue("Ciclista")
public class Ciclista extends Usuario  {

    // --------------------------------------------------------------------
    // Atributos
    // --------------------------------------------------------------------
    /**
     * Representa la edad del usuario
     */
    @Column(nullable = false)
    @Constraints.Required
    public Date fechaNacimiento;

    /**
     * Representa el sexo del usuario
     */
    @Column(nullable = false)
    @Constraints.Required
    public char sexo;

    /*
     * Representa los recorridos que ha hecho el usuario
     */
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    public List<HistoricoRecorrido> historicoRecorridos;
}
