package models.ruta.desplazamiento;

import models.ruta.ProgramacionRuta;
import play.data.Form;

/**
 * Created by Juan on 11/14/2015.
 */
public abstract class DesplazamientoDecorator implements IDesplazamiento {

    private IDesplazamiento desplazamiento;

    public DesplazamientoDecorator(IDesplazamiento dezplazamiento) {
        this.desplazamiento = dezplazamiento;
    }

    public void Programar(ProgramacionRuta programacion) {
        this.desplazamiento.Programar(programacion);
    }
}
