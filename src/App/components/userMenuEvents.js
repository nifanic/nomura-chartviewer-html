/**
 * User Menu Events: "Log Out" and "Cancel" buttons
 */
import i18next from "./i18next";

const elGlobalHeader = $("header.global");
const tmplModalLogOff = i18next => `<div class="modal fade" id="modalLogout" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-sm" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button
          type="button"
          class="close"
          data-dismiss="modal"
          aria-label="Close"
        ><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">${i18next.t("button.logOut")}</h4>
      </div>
      <div class="modal-body">
        <p>${i18next.t("youAreAboutToLogOut")}</p>
      </div>
      <div class="modal-footer">
	      <button
		      type="button"
		      id="cancel"
		      class="btn btn-default"
		      data-dismiss="modal"
	      >${i18next.t("button.cancel")}</button>
	      <button
		      type="button"
		      id="logout"
		      class="btn btn-primary logout"
	      ><i class="fa fa-sign-out"></i> ${i18next.t("button.logOut")}</button>
      </div>
    </div>
  </div>
</div>
`;

export function userMenuEvents() {
	elGlobalHeader.find("button.cancel").dropdown("toggle");
	elGlobalHeader.find("button.logout").click(() => {
		if (typeof $().modal != "function") {
			console.error("Modal not available right now.");
			return;
		}

		if (!$("#modalLogout").length) {
			document.body.insertAdjacentHTML("afterbegin", tmplModalLogOff(i18next));
		}
		$("#modalLogout")
			.on("hidden.bs.modal", () => $("#modalLogout").remove())
			.on("show.bs.modal", () => {
				const ccc = i18next.t("button.logOut");
				$(".user-menu")
					.find("[data-toggle=dropdown]")
					.dropdown("toggle");
			})
			.modal("show");
	});
	onUserMenuTabsClicked();
}

/**
 * The event won't be propagated to the document NODE and therefore events delegated to document won't be fired
 */
function onUserMenuTabsClicked() {
	const elUserMenu = $(".user-menu");
	elUserMenu.find(".dropdown-menu").click(event => {
		event.stopPropagation();
	});

	elUserMenu.find(".dropdown-menu .nav-tabs > li > a").click(({ target }) => {
		$(target).tab("show");
	});
}
