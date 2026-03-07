package com.sheoran.service;

import com.sendgrid.SendGrid;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.Method;

import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Email;
import com.sendgrid.helpers.mail.objects.Content;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class EmailService {

    @Value("${MAIL_PASS}")
    private String sendGridApiKey;

    @Async
    public void sendVerificationOtpEmail(String userEmail, String otp, String subject, String text) {

        Email from = new Email("sahilsheo444@gmail.com", "BuyBaazar");
        Email to = new Email(userEmail);

        Content content = new Content("text/html", text);
        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);

            System.out.println("✅ Email sent. Status Code: " + response.getStatusCode());

        } catch (IOException ex) {
            System.out.println("❌ SENDGRID ERROR");
            ex.printStackTrace();
        }
    }
}