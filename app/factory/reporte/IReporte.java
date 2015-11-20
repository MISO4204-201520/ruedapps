package factory.reporte;

import annotations.Feature;

import java.util.Date;
import java.util.List;

/*
 * Created by franciscoluisrv on 11/14/2015.
 */
@Feature(nombre = "Reportes")
public interface IReporte {
    List ConsultarReporte(Date fechaInicio, Date fechaFin, long id);
}

