package WebPage.ElenaFranconi.User;

import java.util.UUID;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import WebPage.ElenaFranconi.Exceptions.BadRequestException;
import WebPage.ElenaFranconi.Exceptions.NotFoundException;
import WebPage.ElenaFranconi.User.dto.UserRequestDto;

@Service
public class UserService {
	private final UserRepository ur;

	public UserService(UserRepository ur) {
		this.ur = ur;
	}

	public User saveUser(UserRequestDto body) {
		Boolean existingUser = ur.findByEmail(body.getEmail()).isPresent();

		if (existingUser) {
			throw new BadRequestException("Email already exists in the database");
		} else {
			User user = new User(body.getUsername(), body.getName(), body.getSurname(), body.getEmail(),
					body.getPassword(), body.getRole());
			return ur.save(user);
		}
	}

	public User findByEmail(String email) {
		return ur.findByEmail(email).orElseThrow(() -> new NotFoundException(email));
	}

	public User findByUsername(String username) {
		return ur.findByUsername(username).orElseThrow(() -> new NotFoundException(username));
	}

	public User findById(UUID id) {
		return ur.findById(id).orElseThrow(() -> new NotFoundException(id.toString()));
	}

	public User getAuthenticatedUser(UserDetails userDetails) {
		return this.findByUsername(userDetails.getUsername());
	}

	public void deleteUserById(UUID id) {
		ur.deleteById(id);
	}
}
