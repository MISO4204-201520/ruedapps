package models.perfil;

/**
 * Created by Lina8a on 06/09/2015.
 * DTO del registro
 */
public class RegistroDTO {

    // --------------------------------------------------------------------
    // Atributos
    // --------------------------------------------------------------------

    /**
     * Representa los nombres ingresados por el usuario en el registro.
     */
    private String nombres;

    /**
     * Representa los apellidos ingresados por el usuario en el registro.
     */
    private String apellidos;

    /**
     * Representa el correo electronico ingresado por el usuario en el registro.
     */
    private String correoElectronico;

    /**
     * Representa la contrasenia ingresada por el usuario en el registro.
     */
    private String contrasenia;

    /**
     * Representa la ciudad ingresada por el usuario en el registro.
     */
    private String ciudad;

    /**
     * Representa el numero de celular ingresado por el usuario en el registro.
     */
    private String celular;


    // --------------------------------------------------------------------
    // Metodos
    // --------------------------------------------------------------------

    /**
     * Retorna el atributo nombres.
     * @return nombres
     */
    public String getNombres() {
        return nombres;
    }

    /**
     * Aigna el valor del atributo nombres.
     * @param nombres
     */
    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    /**
     * Retorna el atributo apellidos.
     * @return apellidos
     */
    public String getApellidos() {
        return apellidos;
    }

    /**
     * Aigna el valor del atributo apellidos.
     * @param apellidos
     */
    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    /**
     * Retorna el atributo correo electronico.
     * @return correoElectronico
     */
    public String getCorreoElectronico() {
        return correoElectronico;
    }

    /**
     * Aigna el valor del atributo correo electronico.
     * @param correoElectronico
     */
    public void setCorreoElectronico(String correoElectronico) {
        this.correoElectronico = correoElectronico;
    }

    /**
     * Retorna el atributo contrasenia.
     * @return contrsenia
     */
    public String getContrasenia() {
        return contrasenia;
    }

    /**
     * Aigna el valor del atributo contrasenia.
     * @param contrasenia
     */
    public void setContrasenia(String contrasenia) {
        this.contrasenia = contrasenia;
    }

    /**
     * Retorna el atributo ciudad
     * @return ciudad
     */
    public String getCiudad() {
        return ciudad;
    }

    /**
     * Aigna el valor del atributo ciudad.
     * @param ciudad
     */
    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    /**
     * Retorna el atributo celular.
     * @return  celular
     */
    public String getCelular() {
        return celular;
    }

    /**
     * Aigna el valor del atributo celular.
     * @param celular
     */
    public void setCelular(String celular) {
        this.celular = celular;
    }


}
