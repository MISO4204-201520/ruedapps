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

    /**
     * Representa la fecha de nacimiento del usuario.
     */
    public String fechaNacimiento;


    // --------------------------------------------------------------------
    // Metodos
    // --------------------------------------------------------------------

    /**
     * Retorna el atributo nombres.
     *
     * @return nombres
     */
    public String getNombres() {
        return nombres;
    }

    /**
     * Asigna el valor del atributo nombres.
     *
     * @param nombres Nuevo nombre
     */
    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    /**
     * Retorna el atributo apellidos.
     *
     * @return apellidos
     */
    public String getApellidos() {
        return apellidos;
    }

    /**
     * Asigna el valor del atributo apellidos.
     *
     * @param apellidos Nuevo apellido
     */
    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    /**
     * Retorna el atributo correo electronico.
     *
     * @return correoElectronico
     */
    public String getCorreoElectronico() {
        return correoElectronico;
    }

    /**
     * Asigna el valor del atributo correo electrónico.
     *
     * @param correoElectronico Nuevo correo electrónico
     */
    public void setCorreoElectronico(String correoElectronico) {
        this.correoElectronico = correoElectronico;
    }

    /**
     * Retorna el atributo contrasenia.
     *
     * @return contrsenia
     */
    public String getContrasenia() {
        return contrasenia;
    }

    /**
     * Asigna el valor del atributo contraseña.
     *
     * @param contrasenia Nueva contraseña
     */
    public void setContrasenia(String contrasenia) {
        this.contrasenia = contrasenia;
    }

    /**
     * Retorna el atributo ciudad
     *
     * @return ciudad
     */
    public String getCiudad() {
        return ciudad;
    }

    /**
     * Asigna el valor del atributo ciudad.
     *
     * @param ciudad Nueva ciudad
     */
    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    /**
     * Retorna el atributo celular.
     *
     * @return celular
     */
    public String getCelular() {
        return celular;
    }

    /**
     * Asigna el valor del atributo celular.
     *
     * @param celular Nuevo celular
     */
    public void setCelular(String celular) {
        this.celular = celular;
    }

    /**
     * Retorna el atributo fecha nacimiento.
     *
     * @return celular
     */
    public String getFechaNacimiento() {
        return fechaNacimiento;
    }

    /**
     * Asigna el valor del atributo fecha nacimiento.
     *
     * @param fechaNacimiento Nueva fecha de nacimiento
     */
    public void setFechaNacimiento(String fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }
}
