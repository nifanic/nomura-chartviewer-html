/**
 * Clear button
 */
export function clearButton() {
	const elInputClearable = $("input.clearable");
	if (elInputClearable) {
		elInputClearable
			.wrap('<div class="input-clear"></div>')
			.after(
				'<button type="button" class="btn btn-link clear" data-toggle="button" aria-pressed="false" tabindex="0">Clear</button>'
			)
			.keyup(function() {
				$(this)
					.siblings("button")
					.toggle(Boolean($(this).val()));
			})
			.css("padding-right", function() {
				const $btnClear = $(this).siblings("button");
				$btnClear.css({
					position: "absolute",
					visibility: "hidden",
					display: "block"
				});

				const $btnClearWidth = $btnClear.outerWidth(true);
				$btnClear.css({ position: "", visibility: "", display: "" });
				return $btnClearWidth + "px";
			});

		$(".clear")
			.hide(
				$(this)
					.siblings("input")
					.val()
			)
			.click(function() {
				// FIXME: SlickGrid/Input is not focused on when "Clean" button is clicked.
				$(this)
					.siblings("input")
					.val("");
				$(this).hide();
				$(this)
					.siblings("input")
					.focus();
			});
	}
}
