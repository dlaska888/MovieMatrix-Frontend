class NotificationService {
	static notify(message, color = "green") {
		let toast = document.createElement("div");
		toast.innerHTML = `
        <div class="toast align-items-center border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body text-white">
                ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>`;
		toast = toast.firstElementChild;
		toast.style.backgroundColor = color;
        
        const toastContainer = document.querySelector(".toast-container");
        toastContainer.innerHTML = "";
        toastContainer.appendChild(toast);

        const toastBootstrap = new bootstrap.Toast(toast);
        toastBootstrap.show();
	}
}

export default NotificationService;