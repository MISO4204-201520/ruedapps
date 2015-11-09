package models.perfil;

/**
 * Created by jasmo2 on 11/8/15.
 */
public class LoginOAuth {
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setProveedor_id(String proveedor_id) {
        this.proveedor_id = proveedor_id;
    }


    public String getProveedor_id() {
        return proveedor_id;
    }

    public String getNombre() {
        return nombre;
    }

    private String nombre;


    private String proveedor_id;

}
