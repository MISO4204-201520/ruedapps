package controllers.reporte;

import com.avaje.ebean.Ebean;
import models.ruta.HistoricoRecorrido;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

/**
 * Created by Juan on 11/7/2015.
 */
public class ReporteController extends Controller {


    public Result ConsultarMetricaPorDistancia(String fechaInicio, String fechaFin, long id) {

        if (id == 0)
        {
            id = Long.valueOf(session().get("loggedUser"));
        }

        List<HistoricoRecorrido> historicoRecorridos = Ebean.find(HistoricoRecorrido.class).where().eq("ciclista.id", id).ge("fecha", fechaInicio).le("fecha", fechaFin).findList();
        return ok(Json.toJson(historicoRecorridos));
    }

    public Result ConsultarMetricaPorTiempo(String fechaInicio, String fechaFin, long id) {

        if (id == 0)
        {
            id = Long.valueOf(session().get("loggedUser"));
        }

        List<HistoricoRecorrido> historicoRecorridos = Ebean.find(HistoricoRecorrido.class).where().eq("ciclista.id", id).findList();
        return ok(Json.toJson(historicoRecorridos));
    }


    public Result ConsultarHistoricoPorUsuario(String fechaInicio, String fechaFin, long id) throws ParseException {

        if (id == 0)
        {
            id = Long.valueOf(session().get("loggedUser"));
        }

        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        Date fechaInicioDate = format.parse(fechaInicio);
        Date fechaFinDate = format.parse(fechaFin);

        List<HistoricoRecorrido> historicoRecorridos = Ebean.find(HistoricoRecorrido.class).where().eq("ciclista.id", id).ge("fecha", fechaInicioDate).le("fecha", fechaFinDate).findList();
        return ok(Json.toJson(historicoRecorridos));
    }

    public Result ConsultarRutasPorUsusario(String fechaInicio, String fechaFin, long id) {

        if (id == 0)
        {
            id = Long.valueOf(session().get("loggedUser"));
        }

        List<HistoricoRecorrido> historicoRecorridos = Ebean.find(HistoricoRecorrido.class).where().eq("ciclista.id", id).findList();
        return ok(Json.toJson(historicoRecorridos));
    }


    /*
     * Calculate distance between two points in latitude and longitude taking
     * into account height difference. If you are not interested in height
     * difference pass 0.0. Uses Haversine method as its base.
     *
     * lat1, lon1 Start point lat2, lon2 End point el1 Start altitude in meters
     * el2 End altitude in meters
     * @returns Distance in Meters
     */
    public static double distance(double lat1, double lat2, double lon1,
                                  double lon2, double el1, double el2) {

        final int R = 6371; // Radius of the earth

        Double latDistance = Math.toRadians(lat2 - lat1);
        Double lonDistance = Math.toRadians(lon2 - lon1);
        Double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        Double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distance = R * c * 1000; // convert to meters

        double height = el1 - el2;

        distance = Math.pow(distance, 2) + Math.pow(height, 2);

        return Math.sqrt(distance);
    }

}
