package models.perfil;

import com.avaje.ebean.Model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import play.data.validation.Constraints;

import javax.persistence.*;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

/**
 * Created by Lina8a on 05/09/2015.
 * Entidad Usuario.
 */
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(
        name = "dtype",
        discriminatorType = DiscriminatorType.STRING
)
public abstract class Usuario extends Model {

    // --------------------------------------------------------------------
    // Atributos
    // --------------------------------------------------------------------

    /**
     * Representa la llave primaria de la entidad.
     */
    @Id
    public long id;


    @Column(unique = true, nullable = true)
    public String proovedor_id;
    /**
     * Representa los nombres ingresados por el usuario en el registro.
     */
    @Column(nullable = true)
    //@Constraints.Required
    public String nombres;

    /**
     * Representa los apellidos ingresados por el usuario en el registro.
     */
    @Column(nullable = true)
    //@Constraints.Required
    public String apellidos;

    /**
     * Representa el correo electrónico ingresado por el usuario en el registro.
     */
    @Column(unique = true, nullable = true)
    //@Constraints.Required
    @Constraints.Email
    public String correoElectronico;

    /**
     * Representa la contraseña ingresada por el usuario en el registro.
     */
    @Column(nullable = true)
    //@Constraints.Required
    @JsonIgnore
    public String contrasenia;

    /**
     * Representa la ciudad ingresada por el usuario en el registro.
     */
    @Column
    //@Constraints.Required
    public String ciudad;

    /**
     * Representa el numero de celular ingresado por el usuario en el registro.
     */
    @Column(unique = true, nullable = true)
    //@Constraints.Required
    public String celular;

    /**
     * Asigna el valor del atributo contrasenia.
     */
    public void hashContrasenia(String contrasenia) {
        this.contrasenia = Base64.getEncoder().encodeToString(getSha512(contrasenia));
    }

    /**
     * Verifica la contraseña del usuario.
     */
    public boolean verificaContrasenia(String contrasenia) {
        String hashContrasenia = Base64.getEncoder().encodeToString(this.getSha512(contrasenia));
        return hashContrasenia.equals(this.contrasenia);
    }


    private byte[] getSha512(String contrasenia) {
        try {
            return MessageDigest.getInstance("SHA-512").digest(contrasenia.getBytes("UTF-8"));
        } catch (NoSuchAlgorithmException | UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    public static Finder<Long, Usuario> find = new Finder<>(Usuario.class);

}
