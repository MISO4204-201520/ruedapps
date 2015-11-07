package models.ruta;

import com.avaje.ebean.Model;

import javax.persistence.*;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

/**
 * Created by franciscoluisrv on 09/12/2015.
 * Entidad Recorrido.
 */
@Entity
public class Recorrido extends Model {

    // --------------------------------------------------------------------
    // Atributos
    // --------------------------------------------------------------------
    /**
     * Llave primaria de la entidad.
     */
    @Id
    public long id;

    /**
     * Ruta asociada al recorrido
     */
    @ManyToOne
    public Ruta ruta;

    /**
     * Descripción de la ruta
     */
    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    public List<Ubicacion> secuenciaUbicaciones;



    public int CalcularDistancia()
    {
        int distancia = 0;
        Ubicacion anterior = null;

        for (Ubicacion ubicacion : this.secuenciaUbicaciones.stream().sorted((f1, f2) -> Long.compare(f2.id, f1.id)).collect(Collectors.toList())) {

            if (anterior != null)
            {
                distancia += distance(anterior.latitud, ubicacion.latitud, anterior.longitud, ubicacion.longitud, 0, 0);
            }

            anterior = ubicacion;
        }

        return distancia;
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
