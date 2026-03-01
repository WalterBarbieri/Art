package WebPage.ElenaFranconi.runner;

import org.springframework.stereotype.Component;

@Component
public class StartupState {
	private boolean userStartupCompleted = false;

	public boolean isUserStartupCompleted() {
		return userStartupCompleted;
	}

	public void setUserStartupCompleted(boolean completed) {
		this.userStartupCompleted = completed;
	}
}
