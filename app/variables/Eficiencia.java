package variables;

/**
 * Created by jasmo2 on 11/22/15.
 */
public class Eficiencia {
    public boolean optimizar = false;

    public boolean isOptimize() {
        return optimizar;
    }

    public Eficiencia(Boolean optimizar){
        this.optimizar = optimizar;
    }
}

