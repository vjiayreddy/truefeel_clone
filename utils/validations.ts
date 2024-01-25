export const isValidateEmail = (input: string) => {
  let pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (pattern.test(input)) {
    return true;
  }
  return "Please enter a valid email address";
};

export const isValidPassword = (password: string) => {
  let lengthRegex = /.{8,}/;
  let uppercaseRegex = /[A-Z]/;
  let lowercaseRegex = /[a-z]/;
  let digitRegex = /[0-9]/;
  let specialCharRegex = /[!@#$%^&*]/;
  let isValid = true;
  if (!lengthRegex.test(password)) {
    return "Password must be at least 8 characters long.";
  }
  if (!uppercaseRegex.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!lowercaseRegex.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }
  if (!digitRegex.test(password)) {
    return "Password must contain at least one digit (0-9).";
  }
  if (!specialCharRegex.test(password)) {
    return "Password must contain at least one special character (!@#$%^&*).";
  }
  if (isValid) {
    return true;
  }
};
