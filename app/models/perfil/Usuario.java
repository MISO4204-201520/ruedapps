package models.perfil;

import com.avaje.ebean.Model;
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
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class Usuario extends Model {

    // --------------------------------------------------------------------
    // Atributos
    // --------------------------------------------------------------------

    /**
     * Representa la llave primaria de la entidad.
     */
    @Id
    public long id;

    /**
     * Representa los nombres ingresados por el usuario en el registro.
     */
    @Column(nullable = false)
    @Constraints.Required
    public String nombres;

    /**
     * Representa los apellidos ingresados por el usuario en el registro.
     */
    @Column(nullable = false)
    @Constraints.Required
    public String apellidos;

    /**
     * Representa el correo electrónico ingresado por el usuario en el registro.
     */
    @Column(unique = true, nullable = false)
    @Constraints.Required
    @Constraints.Email
    public String correoElectronico;

    /**
     * Representa la contraseña ingresada por el usuario en el registro.
     */
    @Column(nullable = false)
    @Constraints.Required
    public String contrasenia;

    /**
     * Representa la ciudad ingresada por el usuario en el registro.
     */
    @Column(unique = true)
    @Constraints.Required
    public String ciudad;

    /**
     * Representa el numero de celular ingresado por el usuario en el registro.
     */
    @Column(unique = true, nullable = false)
    @Constraints.Required
    public String celular;


    /**
     * Asigna el valor del atributo contrasenia.
     */
    public void setContrasenia(String contrasenia)
    {
        this.contrasenia = Base64.getEncoder().encodeToString(getSha512(contrasenia));
    }

    /**
     * Verifica la contraseña del usuario.
     */
    public boolean VerificaContrasenia(String contrasenia)
    {
        return Base64.getEncoder().encodeToString(this.getSha512(contrasenia)).equals(this.contrasenia);
    }


    private byte[] getSha512(String contrasenia) {
        try {
            return MessageDigest.getInstance("SHA-512").digest(contrasenia.getBytes("UTF-8"));
        }
        catch (NoSuchAlgorithmException | UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }
}
