package server.server.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import server.server.exceptions.Exceptions;

@Service
public class EmailSenderService {
    
    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}") private String sender;
 
    // Method 1
    // To send a simple email
    public String sendSimpleMail(String name, String userEmail, String subject, String content)
    {
        System.out.println("------------------------");
        System.out.println("entered service");
        System.out.println("name is: " + name);
        System.out.println("userEmail: "+userEmail);
        System.out.println("subject is: " + subject);
        System.out.println("content is: " + content);

        try {
            String msgBody = "You got an email from: " + name + "\n\nEmail: " + userEmail + "\n\nMessage:" + content;
            System.out.println("msgBody is: " + msgBody);
            SimpleMailMessage mailMessage = new SimpleMailMessage();
 
            mailMessage.setFrom(sender);
            mailMessage.setTo(userEmail);
            mailMessage.setText(msgBody);
            mailMessage.setSubject(subject);
 
            javaMailSender.send(mailMessage);
            return "Success";
        }
 
        // Catch block to handle the exceptions
        catch (Exception e) {
            throw new Exceptions("Error: " + e.getMessage());
        }
    }

}

