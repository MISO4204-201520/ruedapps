package factory.reporte;

import annotations.Feature;
import com.avaje.ebean.Ebean;
import models.ruta.HistoricoRecorrido;

import java.util.Date;
import java.util.List;


/*
 * Created by franciscoluisrv on 11/14/2015.
 */
@Feature(nombre = "ReporteHistorialViajes")
public class ReporteHistoricoUsuario implements IReporte {
    @Override
    public List ConsultarReporte(Date fechaInicio, Date fechaFin, long id) {
        return Ebean.find(HistoricoRecorrido.class).where().eq("ciclista.id", id).ge("fecha", fechaInicio).lt("fecha", fechaFin).findList();
    }
}
