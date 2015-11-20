package controllers.reporte;

import annotations.Feature;
import factory.reporte.IReporte;
import factory.reporte.ReporteFact;
import factory.reporte.TipoReporte;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/*
 * Created by Juan on 11/7/2015.
 */
@Feature(nombre = "Reportes")
public class ReporteController extends Controller {

    public Result ConsultarMetricaPorDistancia(String fechaInicio, String fechaFin, long id) {
        if (id == 0) {
            id = Long.valueOf(session().get("loggedUser"));
        }

        Date fechaInicioDate, fechaFinDate;
        try {
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            fechaInicioDate = format.parse(fechaInicio);
            fechaFinDate = addDays(format.parse(fechaFin), 1);
        } catch (ParseException ex) {
            return badRequest();
        }

        IReporte reporte = ReporteFact.crearReporte(TipoReporte.MetricaDistancia);
        List data = reporte.ConsultarReporte(fechaInicioDate, fechaFinDate, id);

        if (data != null) {
            return ok(Json.toJson(data));
        } else {
            return badRequest();
        }
    }

    public Result ConsultarMetricaPorTiempo(String fechaInicio, String fechaFin, long id) {
        if (id == 0) {
            id = Long.valueOf(session().get("loggedUser"));
        }

        Date fechaInicioDate, fechaFinDate;
        try {
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            fechaInicioDate = format.parse(fechaInicio);
            fechaFinDate = addDays(format.parse(fechaFin), 1);
        } catch (ParseException ex) {
            return badRequest();
        }

        IReporte reporte = ReporteFact.crearReporte(TipoReporte.MetricaTiempo);
        List data = reporte.ConsultarReporte(fechaInicioDate, fechaFinDate, id);

        if (data != null) {
            return ok(Json.toJson(data));
        } else {
            return badRequest();
        }
    }

    public Result ConsultarHistoricoPorUsuario(String fechaInicio, String fechaFin, long id)  {
        if (id == 0) {
            id = Long.valueOf(session().get("loggedUser"));
        }

        Date fechaInicioDate, fechaFinDate;
        try {
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            fechaInicioDate = format.parse(fechaInicio);
            fechaFinDate = addDays(format.parse(fechaFin), 1);
        } catch (ParseException ex) {
            return badRequest();
        }

        IReporte reporte = ReporteFact.crearReporte(TipoReporte.HistoricoUsuario);
        List data = reporte.ConsultarReporte(fechaInicioDate, fechaFinDate, id);

        if (data != null) {
            return ok(Json.toJson(data));
        } else {
            return badRequest();
        }
    }

    public Result ConsultarRutasPorUsuario(String fechaInicio, String fechaFin, long id) {
        if (id == 0) {
            id = Long.valueOf(session().get("loggedUser"));
        }

        Date fechaInicioDate, fechaFinDate;
        try {
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            fechaInicioDate = format.parse(fechaInicio);
            fechaFinDate = addDays(format.parse(fechaFin), 1);
        } catch (ParseException ex) {
            return badRequest();
        }

        IReporte reporte = ReporteFact.crearReporte(TipoReporte.RutasUsuario);
        List data = reporte.ConsultarReporte(fechaInicioDate, fechaFinDate, id);

        if (data != null) {
            return ok(Json.toJson(data));
        } else {
            return badRequest();
        }
    }

    private Date addDays(Date date, int days) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.DATE, days); //minus number would decrement the days
        return cal.getTime();
    }

}
