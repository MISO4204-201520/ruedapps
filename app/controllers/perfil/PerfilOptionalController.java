/**
 * Created by jasmo2 on 11/7/15.
 */
package controllers.perfil;

import com.fasterxml.jackson.databind.JsonNode;
import com.feth.play.module.pa.providers.oauth2.facebook.FacebookAuthInfo;
import play.libs.oauth.OAuth.ConsumerKey;
import play.libs.oauth.OAuth.ServiceInfo;
import play.libs.oauth.OAuth.RequestToken;
import play.mvc.Result;
import play.mvc.Results;
import play.libs.ws.WSClient;
import play.libs.ws.WSResponse;

import javax.inject.Inject;

public class PerfilOptionalController extends PerfilKernelController {


    public Result LoginFacebook() {
        JsonNode json = request().body().asJson();
        if(json == null) {
            return badRequest("Expecting Json data");
        } else {
            String name = json.findPath("code").textValue();
//            RequestToken requestToken = PerfilOptionalController.retrieveRequestToken(url);
//
            if(name == null) {
                return badRequest("Missing parameter [name]");
            } else {
                return Results.ok("ok");
            }
        }
    }
    public Result LoginTwitter() {

        JsonNode json = request().body().asJson();
        if(json == null) {
            return badRequest("Expecting Json data");
        } else {
            String name = json.findPath("name").textValue();
            if(name == null) {
                return badRequest("Missing parameter [name]");
            } else {
                return Results.ok("ok");
            }
        }
    }
}
