package controllers.reporte;

import com.avaje.ebean.Ebean;
import models.reporte.Metrica;
import models.ruta.HistoricoRecorrido;
import models.ruta.ProgramacionRuta;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Created by Juan on 11/7/2015.
 */
public class ReporteController extends Controller {


    public Result ConsultarMetricaPorDistancia(String fechaInicio, String fechaFin, long id) {

        if (id == 0)
        {
            id = Long.valueOf(session().get("loggedUser"));
        }

        try {
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            Date fechaInicioDate = format.parse(fechaInicio);
            Date fechaFinDate = addDays(format.parse(fechaFin), 1);

            List<HistoricoRecorrido> historicoRecorridos = Ebean.find(HistoricoRecorrido.class).where().eq("ciclista.id", id).ge("fecha", fechaInicioDate).lt("fecha", fechaFinDate).findList();
            Set<Map.Entry<String, Integer>> set = historicoRecorridos.stream().collect(Collectors.groupingBy(h -> format.format(h.fecha), Collectors.summingInt(s -> s.recorrido.CalcularDistancia()))).entrySet();

            List<Metrica> m = new ArrayList<>();
            for (Map.Entry<String, Integer> entry : set)
            {
                Metrica mt = new Metrica();
                mt.fecha = format.parse(entry.getKey());
                mt.valor = entry.getValue();
                m.add(mt);
            }

            return ok(Json.toJson(m.stream().sorted((x, y) -> x.fecha.compareTo(y.fecha)).collect(Collectors.toList())));
        }
        catch (ParseException ex)
        {
            return badRequest();
        }
    }

    public Result ConsultarMetricaPorTiempo(String fechaInicio, String fechaFin, long id) {

        if (id == 0)
        {
            id = Long.valueOf(session().get("loggedUser"));
        }

        try {
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            Date fechaInicioDate = format.parse(fechaInicio);
            Date fechaFinDate = addDays(format.parse(fechaFin), 1);

            List<HistoricoRecorrido> historicoRecorridos = Ebean.find(HistoricoRecorrido.class).where().eq("ciclista.id", id).ge("fecha", fechaInicioDate).lt("fecha", fechaFinDate).findList();
            Set<Map.Entry<String, Integer>> set = historicoRecorridos.stream().collect(Collectors.groupingBy(h -> format.format(h.fecha), Collectors.summingInt(s -> s.duracion))).entrySet();

            List<Metrica> m = new ArrayList<>();
            for (Map.Entry<String, Integer> entry : set)
            {
                Metrica mt = new Metrica();
                mt.fecha = format.parse(entry.getKey());
                mt.valor = entry.getValue();
                m.add(mt);
            }

            return ok(Json.toJson(m.stream().sorted((x, y) -> x.fecha.compareTo(y.fecha)).collect(Collectors.toList())));
        }
        catch (ParseException ex)
        {
            return badRequest();
        }
    }


    public Result ConsultarHistoricoPorUsuario(String fechaInicio, String fechaFin, long id)  {

        if (id == 0)
        {
            id = Long.valueOf(session().get("loggedUser"));
        }

        try {
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            Date fechaInicioDate = format.parse(fechaInicio);
            Date fechaFinDate = addDays(format.parse(fechaFin), 1);

            List<HistoricoRecorrido> historicoRecorridos = Ebean.find(HistoricoRecorrido.class).where().eq("ciclista.id", id).ge("fecha", fechaInicioDate).lt("fecha", fechaFinDate).findList();
            return ok(Json.toJson(historicoRecorridos));
        }
        catch (ParseException ex)
        {
            return badRequest();
        }
    }

    public Result ConsultarRutasPorUsusario(String fechaInicio, String fechaFin, long id) {

        if (id == 0)
        {
            id = Long.valueOf(session().get("loggedUser"));
        }

        try {
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            Date fechaInicioDate = format.parse(fechaInicio);
            Date fechaFinDate = addDays(format.parse(fechaFin), 1);

            List<ProgramacionRuta> programacionRecorrido = Ebean.find(ProgramacionRuta.class).where().ge("fechaInicio", fechaInicioDate).lt("fechaInicio", fechaFinDate).or(com.avaje.ebean.Expr.eq("participantes.id", id), com.avaje.ebean.Expr.eq("organizador.id", id)).findList();
            return ok(Json.toJson(programacionRecorrido));
        }
        catch (ParseException ex)
        {
            return badRequest();
        }
    }

    public static Date addDays(Date date, int days)
    {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.DATE, days); //minus number would decrement the days
        return cal.getTime();
    }

}
