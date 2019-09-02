/**
 * Password Masking
 */
export function passwordMasking() {
	const elPassword = $(".password");
	if (elPassword) {
		elPassword
			.focus(function() {
				this.type = "text";
			})
			.blur(function() {
				this.type = "password";
			});
	}
}
