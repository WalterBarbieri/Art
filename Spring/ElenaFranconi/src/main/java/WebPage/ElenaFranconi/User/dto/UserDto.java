package WebPage.ElenaFranconi.User.dto;

import java.util.UUID;

import WebPage.ElenaFranconi.User.Role;
import WebPage.ElenaFranconi.User.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserDto {

	private UUID id;

	private String username;

	private String name;

	private String surname;

	private String email;

	private Role role;

	private String logo;

	public static UserDto fromUser(User user) {
		return new UserDto(user.getId(), user.getUsername(), user.getName(), user.getSurname(), user.getEmail(),
				user.getRole(), user.getLogo() != null ? user.getLogo() : null);
	}

}
