package models.perfil;

import models.ruta.HistoricoRecorrido;
import play.data.validation.Constraints;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.Date;
import java.util.List;

/**
 * Created by franciscoluisrv on 09/12/2015.
 * Entidad Ciclista.
 */
@Entity
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
    @OneToMany
    public List<HistoricoRecorrido> historicoRecorridos;
}
