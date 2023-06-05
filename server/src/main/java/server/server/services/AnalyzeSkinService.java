package server.server.services;

import org.springframework.stereotype.Service;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;

@Service
public class AnalyzeSkinService {

    //setting to true indicates that procedures can be recommended. 0 indicates that no procedures are needed.
    public JsonObjectBuilder analyzeSkin(JsonObjectBuilder builder, JsonObject resultObject, JsonObjectBuilder userProfile) {
        builder = checkForPores(builder, resultObject, userProfile);
        builder = checkForBlackheads(builder, resultObject, userProfile);
        builder = checkForAcnes(builder, resultObject, userProfile);
        builder = checkForDarkCircles(builder, resultObject, userProfile);
        builder = checkForWrinkes(builder, resultObject, userProfile);
        builder = checkForSpots(builder, resultObject, userProfile);
        builder = checkForEyePouch(builder, resultObject, userProfile);
        builder = checkLeftEyeLids(builder, resultObject, userProfile);
        builder = checkRightEyeLids(builder, resultObject, userProfile);
        builder = checkForMole(builder, resultObject, userProfile);
        userProfile.add("default_value", true);
        return builder;
    }

    public JsonObjectBuilder checkForPores(JsonObjectBuilder builder, JsonObject resultObject,
            JsonObjectBuilder userProfile) {
        JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
        // left and right is reversed because of mirror image.
        int poresLeftCheekValue = resultObject.getJsonObject("pores_left_cheek").getInt("value");
        if (poresLeftCheekValue != 0)
            arrayBuilder.add("Right Cheek");
        int poresRightCheekValue = resultObject.getJsonObject("pores_right_cheek").getInt("value");
        if (poresRightCheekValue != 0)
            arrayBuilder.add("Left Cheek");
        int poreForehead = resultObject.getJsonObject("pores_forehead").getInt("value");
        if (poreForehead != 0)
            arrayBuilder.add("Forehead");
        int poresJaws = resultObject.getJsonObject("pores_jaw").getInt("value");
        if (poresJaws != 0)
            arrayBuilder.add("Jaws");

        JsonArray poresArray = arrayBuilder.build();
        if (poresArray.size() > 0) {
            builder.add("pores", poresArray);
            userProfile.add("pores", true);
        } else {
            builder.add("pores", "None");
            userProfile.add("pores", false);
        }
        return builder;

    }

    public JsonObjectBuilder checkForWrinkes(JsonObjectBuilder builder, JsonObject resultObject,
            JsonObjectBuilder userProfile) {
        JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
        // left and right is reversed because of mirror image.
        int nasolabial_fold = resultObject.getJsonObject("nasolabial_fold").getInt("value");
        if (nasolabial_fold != 0)
            arrayBuilder.add("Nasolabial Fold");
        int forehead_wrinkle = resultObject.getJsonObject("forehead_wrinkle").getInt("value");
        if (forehead_wrinkle != 0)
            arrayBuilder.add("Forehead");
        int crows_feet = resultObject.getJsonObject("crows_feet").getInt("value");
        if (crows_feet != 0)
            arrayBuilder.add("Crows feet");
        int glabella_wrinkle = resultObject.getJsonObject("glabella_wrinkle").getInt("value");
        if (glabella_wrinkle != 0)
            arrayBuilder.add("Glabella");

        JsonArray wrinkeArray = arrayBuilder.build();
        if (wrinkeArray.size() > 0) {
            builder.add("wrinkles", wrinkeArray);
            userProfile.add("wrinkles", true);
        } else {
            builder.add("wrinkles", "None");
            userProfile.add("wrinkles", false);
        }
        return builder;

    }

    public JsonObjectBuilder checkForBlackheads(JsonObjectBuilder builder, JsonObject resultObject,
    JsonObjectBuilder userProfile) {
        int blackhead = resultObject.getJsonObject("blackhead").getInt("value");
        if (blackhead != 0) {
            builder.add("blackheads", "Blackheads like strawberry");
            userProfile.add("blackheads", true);
        } else {
            builder.add("blackheads", "None");
            userProfile.add("blackheads", false);
        }

        return builder;
    }

    public JsonObjectBuilder checkForMole(JsonObjectBuilder builder, JsonObject resultObject,
            JsonObjectBuilder userProfile) {
        int blackhead = resultObject.getJsonObject("mole").getInt("value");
        if (blackhead != 0) {
            builder.add("mole", "Mole detected");
            userProfile.add("mole", true);
        } else {
            builder.add("mole", "None");
            userProfile.add("mole", false);
        }
        return builder;
    }

    public JsonObjectBuilder checkForAcnes(JsonObjectBuilder builder, JsonObject resultObject,
            JsonObjectBuilder userProfile) {
        int acne = resultObject.getJsonObject("acne").getInt("value");
        if (acne != 0) {
            builder.add("acne", "Acnes detected");
            userProfile.add("acne", true);
        } else {
            builder.add("acne", "None");
            userProfile.add("acne", false);
        }

        return builder;
    }

    public JsonObjectBuilder checkForEyePouch(JsonObjectBuilder builder, JsonObject resultObject,
            JsonObjectBuilder userProfile) {
        int eye_pouch = resultObject.getJsonObject("eye_pouch").getInt("value");
        if (eye_pouch != 0) {
            builder.add("eye_pouch", "Eyepouch detected");
            userProfile.add("eye_pouch", true);
        } else {
            builder.add("eye_pouch", "None");
            userProfile.add("eye_pouch", false);
        }

        return builder;
    }

    public JsonObjectBuilder checkForDarkCircles(JsonObjectBuilder builder, JsonObject resultObject,
            JsonObjectBuilder userProfile) {
        int dark_circle = resultObject.getJsonObject("dark_circle").getInt("value");
        if (dark_circle != 0) {
            builder.add("dark_circle", "Hello panda!");
            userProfile.add("dark_circle", true);
        } else {
            builder.add("dark_circle", "None");
            userProfile.add("dark_circle", false);
        }

        return builder;
    }

    public JsonObjectBuilder checkForSpots(JsonObjectBuilder builder, JsonObject resultObject,
            JsonObjectBuilder userProfile) {
        int skin_spot = resultObject.getJsonObject("skin_spot").getInt("value");
        if (skin_spot != 0) {
            builder.add("skin_spot", "Oink, pig, pigmentation detected");
            userProfile.add("skin_spot", true);
        } else {
            builder.add("skin_spot", "None");
            userProfile.add("skin_spot", false);
        }

        return builder;
    }

    public JsonObjectBuilder checkLeftEyeLids(JsonObjectBuilder builder, JsonObject resultObject,
            JsonObjectBuilder userProfile) {
        int left_eyelids = resultObject.getJsonObject("left_eyelids").getInt("value");
        if (left_eyelids == 0) {
            builder.add("left_eyelids", "Single");
            userProfile.add("left_eyelids", true);
        }
        if (left_eyelids == 1) {
            builder.add("left_eyelids", "Parallel double-fold");
            userProfile.add("left_eyelids", false);
        } else {
            builder.add("left_eyelids", "Tapered double-fold");
            userProfile.add("left_eyelids", false);
        }

        return builder;
    }

    public JsonObjectBuilder checkRightEyeLids(JsonObjectBuilder builder, JsonObject resultObject,
        JsonObjectBuilder userProfile) {
        int right_eyelids = resultObject.getJsonObject("right_eyelids").getInt("value");
        if (right_eyelids == 0) {
            builder.add("right_eyelids", "Single");
            userProfile.add("right_eyelids", true);
        }
        if (right_eyelids == 1) {
            builder.add("right_eyelids", "Parallel double-fold");
            userProfile.add("right_eyelids", false);
        } else {
            builder.add("right_eyelids", "Tapered double-fold");
            userProfile.add("right_eyelids", false);
        }
        return builder;
    }

}
