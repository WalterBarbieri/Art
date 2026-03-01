package WebPage.ElenaFranconi.runner;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import WebPage.ElenaFranconi.User.Role;
import WebPage.ElenaFranconi.User.UserService;
import WebPage.ElenaFranconi.User.dto.UserRequestDto;

@Component
@Order(1)
public class UserStartupRunner implements CommandLineRunner {

	private final UserService userService;
	private final StartupState startupState;
	private final PasswordEncoder passwordEncoder;

	public UserStartupRunner(UserService userService, StartupState startupState, PasswordEncoder passwordEncoder) {
		this.userService = userService;
		this.startupState = startupState;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public void run(String... args) {
		System.out.println("UserStartupRunner started...");
		try {
			if (userService.countUsers() == 0) {
				List<UserRequestDto> defaultAdmins = List.of(
						new UserRequestDto("Elena", "Elena", "Franconi", "info@artnaturateatro.it",
								passwordEncoder.encode("Elena1!"), Role.ADMIN),
						new UserRequestDto("Walter", "Walter", "Barbieri", "walter@walterbarbieri.it",
								passwordEncoder.encode("Fischia1!"), Role.ADMIN));
				for (UserRequestDto admin : defaultAdmins) {
					userService.saveUser(admin);
				}
				System.out.println("Database populated with default users.");
			} else {
				System.out.println("Database already populated with users. Skipping user creation.");
			}
		} catch (Exception e) {
			System.err.println("Error during UserStartupRunner: " + e.getMessage());
		} finally {
			startupState.setUserStartupCompleted(true);
			System.out.println("UserStartupRunner completed.");
		}
	}
}
