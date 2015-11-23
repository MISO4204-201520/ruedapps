package factory.reporte;

import annotations.Feature;
import com.avaje.ebean.Ebean;
import models.reporte.Metrica;
import models.ruta.HistoricoRecorrido;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

/*
 * Created by franciscoluisrv on 11/14/2015.
 */
public class ReporteMetricaTiempo implements IReporte {
    @Override
    public List ConsultarReporte(Date fechaInicio, Date fechaFin, long id) {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");

        try {
            List<HistoricoRecorrido> historicoRecorridos = Ebean.find(HistoricoRecorrido.class).where().eq("ciclista.id", id).ge("fecha", fechaInicio).lt("fecha", fechaFin).findList();
            Set<Map.Entry<String, Integer>> set = historicoRecorridos.stream().collect(Collectors.groupingBy(h -> format.format(h.fecha), Collectors.summingInt(s -> s.duracion))).entrySet();

            List<Metrica> m = new ArrayList<>();
            for (Map.Entry<String, Integer> entry : set) {
                Metrica mt = new Metrica();
                mt.fecha = format.parse(entry.getKey());
                mt.valor = entry.getValue();
                m.add(mt);
            }

            return m.stream().sorted((x, y) -> x.fecha.compareTo(y.fecha)).collect(Collectors.toList());

        } catch (ParseException ex) {
            return null;
        }
    }
}
