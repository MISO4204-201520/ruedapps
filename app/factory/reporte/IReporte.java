package factory.reporte;

import java.util.Date;
import java.util.List;

/*
 * Created by franciscoluisrv on 11/14/2015.
 */
public interface IReporte {
    List ConsultarReporte(Date fechaInicio, Date fechaFin, long id);
}

