package WebPage.ElenaFranconi.Exceptions;

import java.util.UUID;

@SuppressWarnings("serial")
public class NotFoundException extends RuntimeException {
	public NotFoundException(String message) {
		super(message + " not found");
	}

	public NotFoundException(UUID id) {
		super(id + " not found");
	}
}
