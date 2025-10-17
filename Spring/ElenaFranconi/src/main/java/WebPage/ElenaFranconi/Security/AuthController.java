package WebPage.ElenaFranconi.Security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import WebPage.ElenaFranconi.Exceptions.UnauthorizedException;
import WebPage.ElenaFranconi.User.User;
import WebPage.ElenaFranconi.User.UserService;
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

	@PostMapping("/register")
	@ResponseStatus(HttpStatus.CREATED)
	public User saveUser(@Valid @RequestBody UserRequestDto body) throws IOException {
		body.setPassword(passwordEncoder.encode(body.getPassword()));
		User user = us.saveUser(body);
		return user;
	}

	@PostMapping("/login")
	public ResponseEntity<TokenResponse> login(@RequestBody UserLoginDto body) {
		User user = us.findByEmail(body.getEmail());
		if (user != null && passwordEncoder.matches(body.getPassword(), user.getPassword())) {
			String token = jtTools.createToken(user);
			return new ResponseEntity<>(new TokenResponse(token, user), HttpStatus.OK);
		} else {
			throw new UnauthorizedException(
					"Invalid credentials, please check that the password and/or email are correct");
		}
	}

}
