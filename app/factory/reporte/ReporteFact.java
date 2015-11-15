package factory.reporte;

/*
 * Created by franciscoluisrv on 11/14/2015.
 */
public class ReporteFact {
    public static IReporte crearReporte(TipoReporte tipo) {
        switch (tipo) {
            case MetricaDistancia:
                return new ReporteMetricaDistancia();

            case MetricaTiempo:
                return new ReporteMetricaTiempo();

            case HistoricoUsuario:
                return new ReporteHistoricoUsuario();

            case RutasUsuario:
                return new ReporteRutaUsuario();

            default:
                throw new IllegalArgumentException("tipo");
        }
    }
}
