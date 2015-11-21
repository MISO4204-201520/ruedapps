package models.ruta.desplazamiento;

import annotations.Feature;
import com.avaje.ebean.Ebean;
import models.perfil.Ciclista;
import models.ruta.ProgramacionRuta;
import play.data.Form;

import javax.persistence.Entity;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by Juan on 11/14/2015.
 */
@Feature(nombre = "Grupal")
public class DesplazamientoGrupal extends DesplazamientoDecorator {

    public List<Ciclista> participantes;

    public DesplazamientoGrupal(IDesplazamiento dezplazamiento, List<Ciclista> participantes) {
        super(dezplazamiento);

        this.participantes = participantes;
    }

    @Override
    public void Programar(ProgramacionRuta programacion) {

        if (this.participantes != null) {
            for (Ciclista ciclista : this.participantes) {
                Ciclista participante = Ebean.find(Ciclista.class, ciclista.id);

                if (programacion.participantes == null) {
                    programacion.participantes = new LinkedList<Ciclista>();
                }

                if (participante != null) {
                    programacion.participantes.add(participante);
                }
            }
        }

        super.Programar(programacion);
    }
}
