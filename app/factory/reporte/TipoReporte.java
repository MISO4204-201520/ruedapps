package factory.reporte;

import annotations.Feature;

@Feature(nombre = "Reportes")
public enum TipoReporte {
    MetricaDistancia,
    MetricaTiempo,
    HistoricoUsuario,
    RutasUsuario
}
