package WebPage.ElenaFranconi.Email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import WebPage.ElenaFranconi.Exceptions.MessagingException;
import WebPage.ElenaFranconi.User.User;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
	@Value("${spring.mail.username}")
	private String fromAddress;

	@Value("${app.frontend.url}")
	private String frontendUrl;

	@Autowired
	private EmailUtils emailUtils;

	private final JavaMailSender mailSender;

	public EmailService(JavaMailSender mailSender) {
		this.mailSender = mailSender;
	}

	/******************** RESET PASSWORD ************************/

	public void sendResetPasswordEmail(User user, String resetToken) throws MessagingException {
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
			String toAddress = user.getEmail();
			String subject = "Art Natura Teatro - Reset your password";
			String resetLink = frontendUrl + "/auth/reset-password?token=" + resetToken;
			String htmlBody = "<h4>Ciao " + user.getUsername() + "</h4>" + "<br>"
					+ "<p>Hai richiesto la modifica della tua password.</p>" + "<br>"
					+ "<p>Clicca il seguente link per proseguire con la procedura di modifica della password:</p>"
					+ "<p><a href=\"" + resetLink
					+ "\" style=\"color: #235425; font-weight:bold;\">Reimposta la password</a></p>" + "<br>"
					+ emailUtils.signature();
			helper.setFrom(fromAddress);
			helper.setTo(toAddress);
			helper.setSubject(subject);
			helper.setText(htmlBody, true);
			mailSender.send(message);
		} catch (jakarta.mail.MessagingException | org.springframework.mail.MailSendException e) {
			throw new MessagingException("Failed to send reset password email", e);
		}

	}

	public void sendPasswordChangedEmail(User user) throws MessagingException {
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
			String toAddress = user.getEmail();
			String subject = "Art Natura Teatro - Password Changed";
			String htmlBody = "<h4>Ciao " + user.getUsername() + "</h4>" + "<br>"
					+ "<p>La tua password è stata modificata con successo.</p>" + "<br>"
					+ "<p>Se non hai richiesto questa modifica, contattaci immediatamente.</p>" + "<br>"
					+ emailUtils.signature();
			helper.setFrom(fromAddress);
			helper.setTo(toAddress);
			helper.setSubject(subject);
			helper.setText(htmlBody, true);
			mailSender.send(message);
		} catch (jakarta.mail.MessagingException | org.springframework.mail.MailSendException e) {
			throw new MessagingException("Failed to send password change confirmation email", e);
		}

	}

}
