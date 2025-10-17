package WebPage.ElenaFranconi.Storage;

public enum FileType {

	IMAGE("images"), FILE("files"), VIDEO("videos");

	private final String directoryName;

	FileType(String directoryName) {
		this.directoryName = directoryName;
	}

	public String getDirectoryName() {
		return directoryName;
	}

	public static FileType fromString(String type) {
		return switch (type.toLowerCase()) {
		case "image" -> IMAGE;
		case "file" -> FILE;
		case "video" -> VIDEO;
		default -> throw new IllegalArgumentException("Unknown file type: " + type);
		};
	}

}
