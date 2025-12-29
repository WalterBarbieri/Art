package WebPage.ElenaFranconi.Email;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class EmailUtils {
	@Value("${image.logo.directory")
	private String logoDirectory;

	@Value("${app.frontend.url}")
	private String frontendUrl;

	public String signature() {
		String signature = "<p>Art Natura Teatro</p>" + logoToBase64();
		return signature;
	}

	public String logoToBase64() {
		try {
			byte[] fileContent = Files.readAllBytes(Paths.get(logoDirectory));
			String base64Image = Base64.getEncoder().encodeToString(fileContent);
			return "<a href=\"" + frontendUrl + "\"><img src=\"data:image/png;base64," + base64Image
					+ "\" alt=\"Logo Art Natura Teatro\" style=\"width: 100px; height: auto;\"></a>";
		} catch (IOException e) {
			System.err.println("Error during base64 image conversion: " + e.getMessage());
			return "";
		}
	}

}
