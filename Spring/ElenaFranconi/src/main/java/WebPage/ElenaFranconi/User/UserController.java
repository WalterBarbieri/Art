package WebPage.ElenaFranconi.User;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import WebPage.ElenaFranconi.User.dto.UserDto;

@RestController
@RequestMapping("/user")
public class UserController {

	private final UserService us;

	@Autowired
	public UserController(UserService us) {
		this.us = us;
	}

	@GetMapping(params = "id")
	public UserDto findUserById(@RequestParam(name = "id") UUID id) {
		User user = us.findById(id);
		return UserDto.fromUser(user);
	}

}
