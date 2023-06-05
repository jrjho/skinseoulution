package server.server.services;

import java.io.IOException;
import java.sql.SQLException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonString;
import server.server.exceptions.Exceptions;
import server.server.models.UserLoginData;
import server.server.repositories.SQLRepository;

@Service
public class DatabaseService {

    @Autowired
    private SQLRepository sqlRepo;

    public Boolean deleteUserByKey(String key){

        Boolean userDeleted = false;
        userDeleted = this.sqlRepo.deleteUserByKey(key);
        return userDeleted;
    }


    public Boolean findUserByKey(String key) {
        Optional<String> checkUser = this.sqlRepo.findUserByHashedText(key);

        if (checkUser.isPresent()) {
            return true;
        } else {
            return false;
        }
    }

    public Optional<UserLoginData> getImageByKey(String key){
        Optional<UserLoginData> userLoginData = this.sqlRepo.getImageByKey(key);
        if(userLoginData.isPresent()){
            return userLoginData;
        }
        else{
            throw new Exceptions("User does not exist");
        }
    }


    public Boolean findProfileByKey(String key) {
        Optional<String> checkUser = this.sqlRepo.findProfileByHashedText(key);

        if (checkUser.isPresent()) {
            return true;
        } else {
            return false;
        }
    }

    public JsonString uploadOrUpdateImage(MultipartFile image, String key) throws IOException, SQLException {
        Boolean userExists = false;
        userExists = this.findUserByKey(key);

        if (!userExists) {
            this.sqlRepo.uploadNewImage(image, key);

            return Json.createValue("created");
        } else {
            this.sqlRepo.updateImage(image, key);
            return Json.createValue("updated");
        }
    }

    public void updateUserProfile(JsonObject userProfile, String key) throws SQLException, IOException {
        this.sqlRepo.updateUserProfile(key, userProfile);
    }

    public void createUserProfile(JsonObject userProfile, String key) throws SQLException, IOException {
        this.sqlRepo.uploadNewUserProfile(key, userProfile);
    }

    public JsonObject getProcedureList(JsonObject userProfile) {
        JsonObject procedureList = this.sqlRepo.getProcedureList(userProfile);
        return procedureList;
    }

}
