package server.server.repositories;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import jakarta.json.Json;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;
import server.server.exceptions.Exceptions;
import server.server.models.UserLoginData;

@Repository
public class SQLRepository {

    private static final String INSERT_USER_SQL = "INSERT INTO users( image, hashedText) VALUES (?,?)";

    private static final String FIND_USER_BY_HASH_SQL = "SELECT hashedText FROM users WHERE hashedText =?";

    private static final String FIND_PROFILE_BY_HASH_SQL = "SELECT hashedText FROM userprofile WHERE hashedText =?";

    private static final String UPDATE_USER_BY_HASH_SQL = "UPDATE users SET image = ? WHERE hashedText = ?";

    private static final String INSERT_USER_PROFILE_SQL = "INSERT INTO userprofile( hashedText, pores, blackheads, acnes, darkcircles, wrinkles, spots, eyepouch, lefteyelids, righteyelids, mole, default_value) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";

    private static final String UPDATE_USER_PROFILE_SQL = "UPDATE userprofile SET pores = ?, blackheads = ?, acnes = ?, darkcircles = ?, wrinkles = ?, spots = ?, eyepouch = ?, lefteyelids = ?, righteyelids = ?, mole = ?, default_value = ? WHERE hashedText = ?";
    
    private static final String GET_IMAGE_BY_KEY_SQL = "select hashedText, image from users where hashedText=?";

    private static final String DELETE_USER_PROFILE_SQL = "DELETE FROM userprofile WHERE hashedText = ?";

    private static final String DELETE_USER_BY_HASH_SQL = "DELETE FROM users WHERE hashedText =?";

    

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private DataSource dataSource;

    public Boolean deleteUserByKey(String key) {
        System.out.println("key: " + key);
        Integer userProfileDeleted=0;
        Integer userDeleted=0;
        try {
            userProfileDeleted = jdbcTemplate.update(DELETE_USER_PROFILE_SQL, key);
            System.out.println("userProfileDeleted: "+userProfileDeleted);

            if(userProfileDeleted > 0){
                userDeleted = jdbcTemplate.update(DELETE_USER_BY_HASH_SQL, key);
                System.out.println("userDeleted: "+userDeleted);

            }
            return ((userProfileDeleted&userDeleted) > 0) ? true : false;

        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new Exceptions("User does not exist: " + e.getMessage());
        }
    }

    public Optional<UserLoginData> getImageByKey(String key){
        try{
        Optional<UserLoginData> results = jdbcTemplate.query(GET_IMAGE_BY_KEY_SQL, (ResultSet rs)->{
            if(!rs.next())
                return Optional.empty();

            final UserLoginData userLoginData = UserLoginData.populate(rs);
            return Optional.of(userLoginData);
            }, key);
        return results;
        
        }catch (Exception e) {
            System.out.println(e.getMessage());
            throw new Exceptions("User does not exist: " + e.getMessage());
        }
    }


    public void uploadNewImage(MultipartFile image, String hashedText)
            throws SQLException, IOException {
        try (Connection connection = dataSource.getConnection();
                PreparedStatement ps = connection.prepareStatement(INSERT_USER_SQL)) {
            InputStream is = image.getInputStream();
            ps.setBinaryStream(1, is, image.getSize());
            ps.setString(2, hashedText);
            ps.executeUpdate();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new Exceptions("Upload failed: " + e.getMessage());
        }
    }

    public void updateImage(MultipartFile image, String hashedText)
            throws SQLException, IOException {

        try (Connection connection = dataSource.getConnection();
                PreparedStatement ps = connection.prepareStatement(UPDATE_USER_BY_HASH_SQL)) {
            InputStream is = image.getInputStream();
            ps.setBinaryStream(1, is, image.getSize());
            ps.setString(2, hashedText);
            ps.executeUpdate();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new Exceptions("Upload failed: " + e.getMessage());
        }

    }

    public Optional<String> findUserByHashedText(String hashedText) {

        try {
            String key = jdbcTemplate.queryForObject(FIND_USER_BY_HASH_SQL, String.class, hashedText);
            return Optional.of(key);

        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Optional<String> findProfileByHashedText(String hashedText) {

        try {
            String key = jdbcTemplate.queryForObject(FIND_PROFILE_BY_HASH_SQL, String.class, hashedText);
            return Optional.of(key);

        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public void uploadNewUserProfile(String hashedText, JsonObject userProfile) throws SQLException, IOException {

        try (Connection connection = dataSource.getConnection();
                PreparedStatement ps = connection.prepareStatement(INSERT_USER_PROFILE_SQL)) {
            ps.setString(1, hashedText);
            ps.setBoolean(2, userProfile.getBoolean("pores"));
            ps.setBoolean(3, userProfile.getBoolean("blackheads"));
            ps.setBoolean(4, userProfile.getBoolean("acne"));
            ps.setBoolean(5, userProfile.getBoolean("dark_circle"));
            ps.setBoolean(6, userProfile.getBoolean("wrinkles"));
            ps.setBoolean(7, userProfile.getBoolean("skin_spot"));
            ps.setBoolean(8, userProfile.getBoolean("eye_pouch"));
            ps.setBoolean(9, userProfile.getBoolean("left_eyelids"));
            ps.setBoolean(10, userProfile.getBoolean("right_eyelids"));
            ps.setBoolean(11, userProfile.getBoolean("mole"));
            ps.setBoolean(12, userProfile.getBoolean("default_value"));
            ps.executeUpdate();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new Exceptions("Upload failed: " + e.getMessage());
        }
    }

    public void updateUserProfile(String hashedText, JsonObject userProfile) throws SQLException, IOException {

        try (Connection connection = dataSource.getConnection();
                PreparedStatement ps = connection.prepareStatement(UPDATE_USER_PROFILE_SQL)) {
            ps.setBoolean(1, userProfile.getBoolean("pores"));
            ps.setBoolean(2, userProfile.getBoolean("blackheads"));
            ps.setBoolean(3, userProfile.getBoolean("acne"));
            ps.setBoolean(4, userProfile.getBoolean("dark_circle"));
            ps.setBoolean(5, userProfile.getBoolean("wrinkles"));
            ps.setBoolean(6, userProfile.getBoolean("skin_spot"));
            ps.setBoolean(7, userProfile.getBoolean("eye_pouch"));
            ps.setBoolean(8, userProfile.getBoolean("left_eyelids"));
            ps.setBoolean(9, userProfile.getBoolean("right_eyelids"));
            ps.setBoolean(10, userProfile.getBoolean("mole"));
            ps.setBoolean(11, userProfile.getBoolean("default_value"));
            ps.setString(12, hashedText);
            ps.executeUpdate();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new Exceptions("Upload failed: " + e.getMessage());
        }
    }

    public JsonObject getProcedureList(JsonObject userProfile) {
        JsonObjectBuilder jsonObjectBuilder = Json.createObjectBuilder();
        JsonArrayBuilder jsonArrayBuilder = Json.createArrayBuilder();
        System.out.println("--------------------");
        System.out.println("userprofile: " + userProfile);
        boolean default_value = userProfile.getBoolean("default_value");
        boolean pores = userProfile.getBoolean("pores");
        boolean blackheads = userProfile.getBoolean("blackheads");
        boolean acne = userProfile.getBoolean("acne");
        boolean darkcircles = userProfile.getBoolean("dark_circle");
        boolean wrinkles = userProfile.getBoolean("wrinkles");
        boolean spots = userProfile.getBoolean("skin_spot");
        boolean eyepouch = userProfile.getBoolean("eye_pouch");
        boolean lefteyelids = userProfile.getBoolean("left_eyelids");
        boolean righteyelids = userProfile.getBoolean("right_eyelids");
        boolean mole = userProfile.getBoolean("mole");
    
        List<String> trueTags = new ArrayList<>();
        if (default_value) trueTags.add("'default_value'");
        if (spots) trueTags.add("'spots'");
        if (acne) trueTags.add("'acne'");
        if (pores) trueTags.add("'pores'");
        if (blackheads) trueTags.add("'blackheads'");
        if (darkcircles) trueTags.add("'darkcircles'");
        if (wrinkles) trueTags.add("'wrinkles'");
        if (eyepouch) trueTags.add("'eyepouch'");
        if (lefteyelids || righteyelids ) trueTags.add("'eyelids'");
        if (mole) trueTags.add("'mole'");
    
        String joinedTags = String.join(", ", trueTags);
        String SELECT_PROCEDURES_SQL = "SELECT * FROM procedures WHERE procedure_tag IN (" + joinedTags + ")";

        try (Connection conn = dataSource.getConnection();
                PreparedStatement statement = conn.prepareStatement(SELECT_PROCEDURES_SQL)) {

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    JsonObjectBuilder procedureBuilder = Json.createObjectBuilder();
                    procedureBuilder.add("procedure_id", resultSet.getInt("procedure_id"))
                            .add("location", resultSet.getString("location"))
                            .add("procedure_tag", resultSet.getString("procedure_tag"))
                            .add("procedure_name", resultSet.getString("procedure_name"))
                            .add("partner_name", resultSet.getString("partner_name"))
                            .add("image", resultSet.getString("image"))
                            .add("url", resultSet.getString("url"))
                            .add("current_price", resultSet.getString("current_price"))
                            .add("usual_price", resultSet.getString("usual_price"))
                            .add("average_price", resultSet.getString("average_price"));
                    jsonArrayBuilder.add(procedureBuilder);
                }
            }

            jsonObjectBuilder.add("procedures", jsonArrayBuilder);
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return jsonObjectBuilder.build();
    }
}
