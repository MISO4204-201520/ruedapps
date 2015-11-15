package models.ruta.desplazamiento;

import models.ruta.ProgramacionRuta;
import play.data.Form;

/**
 * Created by Juan on 11/14/2015.
 */
public abstract class DesplazamientoDecorator implements IDesplazamiento {

    private IDesplazamiento dezplazamiento;

    public DesplazamientoDecorator(IDesplazamiento dezplazamiento) {
        this.dezplazamiento = dezplazamiento;
    }

    public void Programar(ProgramacionRuta programacion) {
        this.dezplazamiento.Programar(programacion);
    }
}
