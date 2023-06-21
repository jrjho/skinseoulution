package server.server.controllers;

import java.io.IOException;
import java.sql.SQLException;
import java.util.Base64;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;
import jakarta.json.JsonString;
import server.server.models.UserLoginData;
import server.server.services.CallAPIService;
import server.server.services.DatabaseService;
import server.server.services.EmailSenderService;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@Controller
@RequestMapping()
public class ClientRequestController {

    @Autowired
    private CallAPIService apiSvc;

    @Autowired
    private DatabaseService dbSvc;

    @Autowired
    private EmailSenderService emailSvc;

    @PostMapping(path = "/contact", produces = MediaType.APPLICATION_JSON_VALUE)    
    public ResponseEntity<String> contact(@RequestParam String name, @RequestParam String userEmail, @RequestParam String subject, @RequestParam String content) {
        try {
        String status = emailSvc.sendSimpleMail(name, userEmail, subject, content);
        JsonObject response = Json.createObjectBuilder()
            .add("emailSentStatus", status)
            .build();
        return ResponseEntity.ok(response.toString());
        
        }catch (Exception e) {
            JsonObject err = Json.createObjectBuilder()
                    .add("emailSentStatus", e.getMessage())
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err.toString());
        }
    }

    @PostMapping(path = "/detect", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> detect(@RequestPart MultipartFile image) {

        try {
            JsonObject response = this.apiSvc.detectMultiPartFile(image);
            return ResponseEntity.ok(response.toString());

        } catch (Exception e) {
            JsonObject err = Json.createObjectBuilder()
                    .add("message", e.getMessage())
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err.toString());
        }
    }

    @PostMapping(path = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
                public ResponseEntity<String> analyze(@RequestPart MultipartFile image,
            @RequestPart(required = false) String hashedText) {

        try {
            JsonObject response = this.apiSvc.callAnalyzeAPI(image, hashedText);
            return ResponseEntity.ok(response.toString());

        } catch (Exception e) {
            JsonObject err = Json.createObjectBuilder()
                    .add("message", e.getMessage())
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err.toString());
        }
    }

    @PostMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> upload(@RequestPart MultipartFile image, @RequestPart String key) {
        try {
            JsonString response = this.dbSvc.uploadOrUpdateImage(image, key);
            return ResponseEntity.ok(response.toString());

        } catch (IOException | SQLException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    @GetMapping(path = "/login/{hashedText}")
    public ResponseEntity<String> getUserInfo(@PathVariable(required = true) String hashedText) {
        try {
            Optional<UserLoginData> object = dbSvc.getImageByKey(hashedText);
            if (!object.isPresent()) {
                // Handle the case when the image retrieval fails
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Image retrieval failed.");
            }
            String encodedString = Base64.getEncoder().encodeToString(object.get().getImage());
            JsonObject detectResponse = apiSvc.detectStringResource(encodedString);
            JsonObject response = apiSvc.callAnalyzeAPIAfterLogin(encodedString, object.get().getHashedText(), detectResponse);

            return ResponseEntity.status(HttpStatus.OK).body(response.toString());
        } catch (Exception e) {
            JsonObject err = Json.createObjectBuilder()
                    .add("message", e.getMessage())
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err.toString());
        }
    }

    @DeleteMapping(path = "/delete/{hashedText}")
    public ResponseEntity<String> deleteUser(@PathVariable(required = true) String hashedText) {

        try {
            Boolean userDeleted = dbSvc.deleteUserByKey(hashedText);
            JsonObjectBuilder builder = Json.createObjectBuilder();

            if (!userDeleted) {
                builder.add("deleteResponse", "Failed");
                JsonObject response = builder.build();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response.toString());
            }
            else{
                builder.add("deleteResponse", "Success");
                JsonObject response = builder.build();
            return ResponseEntity.status(HttpStatus.OK).body(response.toString());
            }

        } catch (Exception e) {
            JsonObject err = Json.createObjectBuilder()
                    .add("message", e.getMessage())
                    .build();
            System.out.println("error is: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err.toString());
        }

    }
}
