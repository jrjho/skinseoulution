package server.server.services;

import java.io.IOException;
import java.io.StringReader;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import jakarta.json.Json;
import jakarta.json.JsonBuilderFactory;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;
import jakarta.json.JsonReader;
import server.server.exceptions.Exceptions;

@Service
public class CallAPIService {

    @Autowired
    private AnalyzeSkinService analyzeSkinSvc;

    @Autowired
    private DatabaseService dbSvc;

    @Value("${detectface.api.url}")
    private String faceApiUrl;

    @Value("${analyzeface.api.url}")
    private String analyzeFaceApiUrl;

    @Value("${checkeye.api.url}")
    private String eyeApiUrl;

    @Value("${detectface.api.secretkeys}")
    private String faceApiPrivateKey;

    @Value("${detectface.api.key}")
    private String faceApiPublicKey;

    private static final String BASE64_PREFIX = "data:image/png;base64,";

    public JsonObject callAnalyzeAPIAfterLogin(String imageResource, String hashedText, JsonObject detectResponse)throws IOException {
        HttpHeaders headers = setHeaders();
        RestTemplate restTemplate = new RestTemplate();
        // Set up the request body
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("api_key", faceApiPublicKey);
        body.add("api_secret", faceApiPrivateKey);
        body.add("image_base64", imageResource);
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        try {
            JsonBuilderFactory factory = Json.createBuilderFactory(null);
            JsonObjectBuilder builder = Json.createObjectBuilder();
            JsonObjectBuilder userProfile = Json.createObjectBuilder();
            JsonObjectBuilder resultBuilder = factory.createObjectBuilder();
            // Send the request
            ResponseEntity<String> response = restTemplate.exchange(analyzeFaceApiUrl, HttpMethod.POST, requestEntity,
                    String.class);
            // Extract the response body
            String responseBody = response.getBody();
            JsonReader reader = Json.createReader(new StringReader(responseBody));
            JsonObject resultObject = reader.readObject().getJsonObject("result");
            // analyze skin
            builder = analyzeSkinSvc.analyzeSkin(builder, resultObject, userProfile);
            // build the jsonobjects
            JsonObject profile = userProfile.build();
            JsonObject analysisResults = builder.build();
            JsonObject imageObject = Json.createObjectBuilder().add("image", BASE64_PREFIX + imageResource).build();
           //to indicate that this is login and display alert window in angular
            resultBuilder.add("uploadOrUpdateImage", "login");
            resultBuilder.add("image", imageObject);
            resultBuilder.add("detectResponse", detectResponse);
            // check user profile for fields that are true, and return the corresponding procedure list
            JsonObject procedureList = dbSvc.getProcedureList(profile);
            // build the final jsonobject
            resultBuilder.add("toreturn", analysisResults);
            resultBuilder.add("procedureList", procedureList);
            JsonObject result = resultBuilder.build();

            return result;
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            throw new Exceptions("Error: " + e.getMessage());
        }
    }

    public JsonObject callAnalyzeAPI(MultipartFile image, String hashedText) throws IOException {
        HttpHeaders headers = setHeaders();
        RestTemplate restTemplate = new RestTemplate();
        ByteArrayResource imageResource = getImageInByte(image);
        System.out.println("\n\nhashedText is: " + hashedText);
        // Set up the request body
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("api_key", faceApiPublicKey);
        body.add("api_secret", faceApiPrivateKey);
        body.add("image_file", imageResource);
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        try {
            JsonBuilderFactory factory = Json.createBuilderFactory(null);
            JsonObjectBuilder builder = Json.createObjectBuilder();
            JsonObjectBuilder userProfile = Json.createObjectBuilder();
            JsonObjectBuilder resultBuilder = factory.createObjectBuilder();
            // Send the request
            ResponseEntity<String> response = restTemplate.exchange(analyzeFaceApiUrl, HttpMethod.POST, requestEntity,
                    String.class);
            // Extract the response body
            String responseBody = response.getBody();
            JsonReader reader = Json.createReader(new StringReader(responseBody));
            JsonObject resultObject = reader.readObject().getJsonObject("result");
            System.out.println("response body is: " + responseBody);
            // analyze skin
            builder = analyzeSkinSvc.analyzeSkin(builder, resultObject, userProfile);
            // build the jsonobjects
            JsonObject profile = userProfile.build();
            JsonObject analysisResults = builder.build();
            // user inputted details, and already have an existing account
            if ((hashedText != null) && (this.dbSvc.findUserByKey(hashedText))) {
                this.dbSvc.uploadOrUpdateImage(image, hashedText);
                dbSvc.updateUserProfile(profile, hashedText);
                resultBuilder.add("uploadOrUpdateImage", "updated");
            }
            // user inputted details, and is a new user
            if ((hashedText != null) && (!this.dbSvc.findUserByKey(hashedText))) {
                this.dbSvc.uploadOrUpdateImage(image, hashedText);
                dbSvc.createUserProfile(profile, hashedText);
                resultBuilder.add("uploadOrUpdateImage", "created");
            }
            // check user profile for fields that are true, and return the corresponding procedure list
            JsonObject procedureList = dbSvc.getProcedureList(profile);
            // build the final jsonobject
            resultBuilder.add("toreturn", analysisResults);
            resultBuilder.add("procedureList", procedureList);
            JsonObject result = resultBuilder.build();

            return result;
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            throw new Exceptions("Error: " + e.getMessage());
        }
    }

    public JsonObject detectMultiPartFile(MultipartFile image) throws IOException{

        ByteArrayResource imageResource = getImageInByte(image);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("api_key", faceApiPublicKey);
        body.add("api_secret", faceApiPrivateKey);
        body.add("image_file", imageResource); // 'image' is a MultipartFile
        body.add("return_attributes", "eyestatus,skinstatus,age");
        JsonObject result = callDetectAPI(body);

        return result;
    }

    public JsonObject detectStringResource(String imageResource) throws IOException{

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("api_key", faceApiPublicKey);
        body.add("api_secret", faceApiPrivateKey);
        body.add("image_base64", imageResource);
        body.add("return_attributes", "eyestatus,skinstatus,age");
        JsonObject result = callDetectAPI(body);

        return result;
    }

    public JsonObject callDetectAPI(MultiValueMap<String, Object>  body) throws IOException {

        // String faceToken;
        HttpHeaders headers = setHeaders();
        RestTemplate restTemplate = new RestTemplate();
    
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        try {
            JsonObjectBuilder builder = Json.createObjectBuilder();
            // Send the request
            ResponseEntity<String> response = restTemplate.exchange(faceApiUrl, HttpMethod.POST, requestEntity,
                    String.class);
            // Extract the response body
            String responseBody = response.getBody();
            // Convert the response body into a JSON object
            JsonReader reader = Json.createReader(new StringReader(responseBody));
            JsonObject jsonObject = reader.readObject();
            // check if face is detected
            if (jsonObject.getJsonArray("faces").isEmpty()) {
                throw new Exceptions("No hooman face detected");
            }
            // check how many face is detected. Only 1 face is allowed
            JsonObject attributes = jsonObject.getJsonArray("faces").getJsonObject(0).getJsonObject("attributes");
            int numberOfFaces = jsonObject.getInt("face_num");
            if (numberOfFaces > 1) {
                throw new Exceptions("Please upload photo with only 1 face");
            }
            // check skin health
            int skinHealth = attributes.getJsonObject("skinstatus").getInt("health");
            if (skinHealth < 50) {
                builder.add("skinHealth", "Unhealthy");
            } else {
                builder.add("skinHealth", "Healthy");
            }
            // if image fulfills the requirements, return age, skinstatus and whether
            // glasses is worn
            builder.add("age", attributes.getJsonObject("age").getInt("value"));
            builder.add("glass", attributes.getJsonObject("glass").getString("value"));

            JsonObject result = builder.build();
            reader.close();

            return result;

        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new Exceptions("error: " + e.getMessage());
        }
    }

    private HttpHeaders setHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        return headers;
    }

    public ByteArrayResource getImageInByte(MultipartFile image) throws IOException {
        ByteArrayResource imageResource = new ByteArrayResource(image.getBytes()) {
            @Override
            public String getFilename() {
                return image.getOriginalFilename();
            }
        };
        return imageResource;
    }

}
