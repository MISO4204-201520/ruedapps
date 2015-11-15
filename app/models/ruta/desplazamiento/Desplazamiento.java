package models.ruta.desplazamiento;

import models.ruta.ProgramacionRuta;
import play.data.Form;

/**
 * Created by Juan on 11/15/2015.
 */
public class Desplazamiento implements IDesplazamiento {

    @Override
    public void Programar(ProgramacionRuta programacion) {
        programacion.save();
    }
}
