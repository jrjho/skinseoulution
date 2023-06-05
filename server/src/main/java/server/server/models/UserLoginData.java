package server.server.models;

import java.io.Serializable;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UserLoginData implements Serializable {
    
    private byte[] image;
    private String hashedText;

    public byte[] getImage() {
        return image;
    }
    public void setImage(byte[] image) {
        this.image = image;
    }
    public String getHashedText() {
        return hashedText;
    }
    public void setHashedText(String hashedText) {
        this.hashedText = hashedText;
    }
    // public String getYearOfBirth() {
    //     return yearOfBirth;
    // }
    // public void setYearOfBirth(String yearOfBirth) {
    //     this.yearOfBirth = yearOfBirth;
    // }

    public static UserLoginData populate(ResultSet rs) throws SQLException{
        final UserLoginData userDataresults = new UserLoginData();
        userDataresults.setImage(rs.getBytes("image"));
        userDataresults.setHashedText(rs.getString("hashedText"));
        return userDataresults;
    }
    
    
}
