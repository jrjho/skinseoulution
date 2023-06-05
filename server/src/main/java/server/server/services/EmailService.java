package server.server.services;

import server.server.models.EmailDetails;

// Interface
public interface EmailService {
 
    // Method
    // To send a simple email
    String sendSimpleMail(EmailDetails details);
 
    // Method
    // To send an email with attachment
    // String sendMailWithAttachment(EmailDetails details);
}
