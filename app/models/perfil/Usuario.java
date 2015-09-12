package models.perfil;


//import javax.persistence.Column;
//import javax.persistence.Entity;
//import javax.persistence.Id;
import javax.persistence.*;
import play.db.ebean.Model;
import play.data.validation.Constraints;

/**
 * Created by Lina8a on 05/09/2015.
 * Entidad Usuario.
 */
@Entity
public class Usuario {

    // --------------------------------------------------------------------
    // Atributos
    // --------------------------------------------------------------------

    /**
     * Representa la llave primaria de la entidad.
     */
    @Id
    private long id;

    /**
     * Representa los nombres ingresados por el usuario en el registro.
     */
    @Column(nullable = false)
    @Constraints.Required
    private String nombres;

    /**
     * Representa los apellidos ingresados por el usuario en el registro.
     */
    @Column(nullable = false)
    @Constraints.Required
    private String apellidos;

    /**
     * Representa el correo electr�nico ingresado por el usuario en el registro.
     */
    @Column(unique = true, nullable = false)
    @Constraints.Required
    @Constraints.Email
    private String correoElectronico;

    /**
     * Representa la contrasenia ingresada por el usuario en el registro.
     */
    @Column(nullable = false)
    @Constraints.Required
    private String contrasenia;

    /**
     * Representa la ciudad ingresada por el usuario en el registro.
     */
    @Column(unique = true)
    @Constraints.Required
    private String ciudad;

    /**
     * Representa el numero de celular ingresado por el usuario en el registro.
     */
    @Column(unique = true, nullable = false)
    @Constraints.Required
    private String celular;


    // --------------------------------------------------------------------
    // Metodos
    // --------------------------------------------------------------------

    /**
     * Retorna el atributo id.
     * @return id
     */
    public long getId() {
        return id;
    }

    /**
     * Aigna el valor del atributo id.
     * @param id
     */
    public void setId(long id) {
        this.id = id;
    }

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
