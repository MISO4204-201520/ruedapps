package variables;

import java.lang.reflect.Array;
import java.util.*;

/**
 * Created by jasmo2 on 11/16/15.
 */
public class RedesSociales {



    public Boolean twitter = false;
    public Boolean facebook = false;
    private HashMap<String,Boolean> redesHash = new HashMap();

    public  RedesSociales(Boolean twitter, Boolean facebook ) {
        redesHash.put("twitter", twitter);
        redesHash.put("facebook",facebook);
        this.twitter = twitter;
        this.facebook = facebook;
    }


    public Boolean hayRedSocial() {
        Boolean hayRedes = false;
        for (Map.Entry<String, Boolean> entry : this.redesHash.entrySet()) {
            if (entry.getValue()){
                hayRedes = entry.getValue();
            }
        }
        return hayRedes;
    }
    public Boolean getTwitter() {
        return twitter;
    }

    public Boolean getFacebook() {
        return facebook;
    }

}
