package models.perfil;

/**
 * Created by Lina8a on 06/09/2015.
 * DTO del login
 */
public class LoginDTO {

    // --------------------------------------------------------------------
    // Atributos
    // --------------------------------------------------------------------

    /**
     * Representa el correo electronico ingresado por el usuario en el login.
     */
    private String correoElectronico;

    /**
     * Representa la contrasenia ingreseda por el usuario en el login.
     */
    private String contrasenia;


    // --------------------------------------------------------------------
    // Metodos
    // --------------------------------------------------------------------

    /**
     * Retorna el atributo correo electronico
     *
     * @return correoElectronico
     */
    public String getCorreoElectronico() {
        return correoElectronico;
    }

    /**
     * Asigna el valor del atributo correo electronico
     *
     * @param correoElectronico Nuevo correo
     */
    public void setCorreoElectronico(String correoElectronico) {
        this.correoElectronico = correoElectronico;
    }

    /**
     * Retorna el atributo contraseña
     *
     * @return contraseña
     */
    public String getContrasenia() {
        return contrasenia;
    }

    /**
     * Asigna el valor del atributo contraseña
     *
     * @param contrasenia Nueva contraseña
     */
    public void setContrasenia(String contrasenia) {
        this.contrasenia = contrasenia;
    }
}
