package com.sheoran.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Async
    public void sendVerificationOtpEmail(String userEmail,String otp,String subject,String text) throws MessagingException {

        try {
            MimeMessage mimeMessage=javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper= new MimeMessageHelper(mimeMessage,true,"utf-8");
            mimeMessageHelper.setSubject(subject);
            mimeMessageHelper.setText(text,true);
            mimeMessageHelper.setTo(userEmail);
            System.out.println("Before Email Send in Email Service");
            javaMailSender.send(mimeMessage);

        } catch (MailException e) {
            throw new MailSendException("failed to send email");
        }
    }

}
