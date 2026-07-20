export function toAccept(types: string[]) {
  if (types.some((type) => type === "*" || type === "*/*")) return "";
  return types
    .map((type) =>
      type.includes("/") || type.startsWith(".") ? type : `.${type}`,
    )
    .join(",");
}

export function matchesAcceptedType(file: File, accepted: string[]) {
  const extension = getExtension(file.name);

  return accepted.some((type) => {
    const value = type.toLowerCase();
    if (value === "*" || value === "*/*") return true;
    if (value.includes("/")) return matchMime(file.type, value);
    return value.replace(".", "") === extension;
  });
}

export function getExtension(fileName: string) {
  const name = fileName.toLowerCase();
  const index = name.lastIndexOf(".");

  return index > -1 ? name.slice(index + 1) : "";
}

export function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
  }

  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(1)}KB`;
  }

  return `${bytes}B`;
}

function matchMime(fileType: string, acceptedType: string) {
  if (acceptedType.endsWith("/*")) {
    return fileType.startsWith(acceptedType.replace("*", ""));
  }

  return fileType === acceptedType;
}

