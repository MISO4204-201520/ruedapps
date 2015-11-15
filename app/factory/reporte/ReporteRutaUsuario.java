package factory.reporte;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.Expr;
import models.ruta.ProgramacionRuta;

import java.util.Date;
import java.util.List;

/*
 * Created by franciscoluisrv on 11/14/2015.
 */
public class ReporteRutaUsuario implements IReporte {
    @Override
    public List ConsultarReporte(Date fechaInicio, Date fechaFin, long id) {
        return Ebean.find(ProgramacionRuta.class).where().ge("fechaInicio", fechaInicio).lt("fechaInicio", fechaFin).or(Expr.eq("participantes.id", id), Expr.eq("organizador.id", id)).findList();
    }
}
