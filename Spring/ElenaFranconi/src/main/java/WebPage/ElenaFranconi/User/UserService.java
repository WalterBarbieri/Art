package WebPage.ElenaFranconi.User;

import java.util.UUID;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import WebPage.ElenaFranconi.Exceptions.BadRequestException;
import WebPage.ElenaFranconi.Exceptions.NotFoundException;
import WebPage.ElenaFranconi.User.dto.UserRequestDto;

@Service
public class UserService {
	private final UserRepository ur;

	public UserService(UserRepository ur) {
		this.ur = ur;
	}

	// POST METHODS

	@Transactional
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

	// GET METHODS
	@Transactional(readOnly = true)
	public User findByEmail(String email) {
		return ur.findByEmail(email).orElseThrow(() -> new NotFoundException(email));
	}

	@Transactional(readOnly = true)
	public User findByUsername(String username) {
		return ur.findByUsername(username).orElseThrow(() -> new NotFoundException(username));
	}

	@Transactional(readOnly = true)
	public User findById(UUID id) {
		return ur.findById(id).orElseThrow(() -> new NotFoundException(id));
	}

	@Transactional(readOnly = true)
	public User getAuthenticatedUser(UserDetails userDetails) {
		return this.findByUsername(userDetails.getUsername());
	}

	public long countUsers() {
		return ur.count();
	}

	// PUT METHODS
	public User updateUser(User user) {
		return ur.save(user);
	}

	// DELETE METHODS
	@Transactional
	public void deleteUserById(UUID id) {
		ur.deleteById(id);
	}
}
