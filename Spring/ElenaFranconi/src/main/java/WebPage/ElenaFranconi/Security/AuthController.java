package WebPage.ElenaFranconi.Security;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import WebPage.ElenaFranconi.Email.EmailService;
import WebPage.ElenaFranconi.Exceptions.NotFoundException;
import WebPage.ElenaFranconi.Exceptions.UnauthorizedException;
import WebPage.ElenaFranconi.User.User;
import WebPage.ElenaFranconi.User.UserService;
import WebPage.ElenaFranconi.User.dto.RequestResetToken;
import WebPage.ElenaFranconi.User.dto.ResetPasswordDto;
import WebPage.ElenaFranconi.User.dto.UserLoginDto;
import WebPage.ElenaFranconi.User.dto.UserRequestDto;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

	@Autowired
	private UserService us;

	@Autowired
	private JWTTools jtTools;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private EmailService es;

	// Register and Login

	@PostMapping("/register")
	@ResponseStatus(HttpStatus.CREATED)
	public User saveUser(@Valid @RequestBody UserRequestDto body) throws IOException {
		body.setPassword(passwordEncoder.encode(body.getPassword()));
		User user = us.saveUser(body);
		return user;
	}

	@PostMapping("/login")
	public ResponseEntity<TokenResponse> login(@RequestBody UserLoginDto body) {
		try {
			User user = us.findByEmail(body.getEmail());
			if (passwordEncoder.matches(body.getPassword(), user.getPassword())) {
				String token = jtTools.createToken(user);
				return new ResponseEntity<>(new TokenResponse(token, user), HttpStatus.OK);
			} else {
				throw new UnauthorizedException(
						"Invalid credentials, please check that the password and/or email are correct");
			}
		} catch (NotFoundException ex) {
			throw new UnauthorizedException(
					"Invalid credentials, please check that the password and/or email are correct");
		}
	}

	// Reset Password

	@PostMapping("/request-password-reset")
	public ResponseEntity<String> requestPasswordReset(@RequestBody RequestResetToken body) {

		if (!isValidEmail(body.getEmail())) {
			return new ResponseEntity<>("Invalid email format", HttpStatus.BAD_REQUEST);
		}

		User user = us.findByEmail(body.getEmail());

		if (user != null) {
			sendPasswordResetEmail(user);

			return new ResponseEntity<>("Password reset email sent", HttpStatus.OK);
		} else {
			return new ResponseEntity<>("Email not found", HttpStatus.NOT_FOUND);
		}
	}

	@PostMapping("/reset-password")
	public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordDto body) {
		try {
			jtTools.verifyResetToken(body.getResetToken());
			String userId = jtTools.extractSubject(body.getResetToken());
			User user = us.findById(UUID.fromString(userId));
			if (user != null) {
				user.setPassword(passwordEncoder.encode(body.getNewPassword()));
				user.setResetToken(null);
				user.setResetTokenExpirationDate(null);
				us.updateUser(user);
				sendPasswordChangedEmail(user);
				return new ResponseEntity<>("Password successfully changed", HttpStatus.OK);
			} else {
				return new ResponseEntity<>("Invalid token", HttpStatus.UNAUTHORIZED);
			}
		} catch (UnauthorizedException e) {
			return new ResponseEntity<>("Invalid token", HttpStatus.UNAUTHORIZED);
		}

	}

	// Helpers

	private void sendPasswordResetEmail(User user) {
		String resetToken = jtTools.createResetToken(user);

		es.sendResetPasswordEmail(user, resetToken);
	}

	private void sendPasswordChangedEmail(User user) {
		es.sendPasswordChangedEmail(user);
	}

	private boolean isValidEmail(String email) {
		String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
		return email.matches(emailRegex);
	}

}
