package models.perfil;

import com.fasterxml.jackson.annotation.JsonIgnore;
import models.comunicacion.Mensaje;
import models.ruta.HistoricoRecorrido;
import play.data.validation.Constraints;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

/**
 * Created by franciscoluisrv on 10/03/2015.
 * Entidad Ciclista.
 */
@Entity
@DiscriminatorValue("Ciclista")
public class Ciclista extends Usuario {

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
    @OneToMany(mappedBy = "ciclista", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    public List<HistoricoRecorrido> historicoRecorridos;

    /*
     * Mensajes que ha recibido el usuario
     */
    @OneToMany(mappedBy = "destinatario", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    public List<Mensaje> recibidos;

    /*
     * Mensajes que ha enviado el usuario
     */
    @OneToMany(mappedBy = "remitente", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    public List<Mensaje> enviados;

    public static Finder<Long, Ciclista> findCiclista = new Finder<>(Ciclista.class);
}
