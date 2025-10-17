package WebPage.ElenaFranconi.User.dto;

import java.util.UUID;

import WebPage.ElenaFranconi.User.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserTokenDto {
	private UUID id;
	private String username;
	private Role role;

}
