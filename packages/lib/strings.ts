export function capitalizeFirstLetter(string: string | null = "") {
  if (string === null) {
    return "";
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// write a function that takes a string and truncates it to the specified length
export const truncate = (str: string, length: number) => {
  if (!str) return "";
  if (str.length > length) {
    return str.substring(0, length) + "...";
  }
  return str;
};

// write a function that takes a string and removes all characters that could cause issues with the url and truncates it to the specified length
export const sanitizeString = (str: string, delimiter: string = "_", length: number = 255) => {
  return str.replace(/[^0-9a-zA-Z\-._]+/g, delimiter).substring(0, length);
};
