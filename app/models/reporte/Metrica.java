package models.reporte;

import annotations.Feature;
import annotations.Features;

import java.util.Date;

/**
 * Created by Juan on 11/7/2015.
 */
@Features(features = {@Feature(nombre = "Metricas"),
        @Feature(nombre = "ReporteMetricas")})
public class Metrica {

    public Date fecha;

    public int valor;
}
