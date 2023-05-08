import './warningModal.css'

export function showWarningModal(message: string) {
    // Create the necessary DOM elements
    const modal = document.createElement("div");
    modal.classList.add("modal");

    const content = document.createElement("div");
    content.classList.add("modal-content");

    const title = document.createElement("h2");
    title.textContent = "Warning";

    const messageElem = document.createElement("p");
    messageElem.textContent = message;

    const okButton = document.createElement("button");
    okButton.textContent = "OK";

    // Add the elements to the DOM
    content.appendChild(title);
    content.appendChild(messageElem);
    content.appendChild(okButton);
    modal.appendChild(content);
    document.body.appendChild(modal);

    // Add event listener to remove the modal when the OK button is clicked
    okButton.addEventListener("click", () => {
        document.body.removeChild(modal);
    });

    // Apply styles to the modal and its content
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    modal.style.zIndex = "9999";

    content.style.display = "flex";
    content.style.flexDirection = "column";
    content.style.alignItems = "center";
    content.style.backgroundColor = "#fff";
    content.style.padding = "20px";
    content.style.borderRadius = "5px";
    content.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";

    title.style.color = "#f44336";
    title.style.fontSize = "24px";
    title.style.marginBottom = "20px";

    messageElem.style.color = "#000";
    messageElem.style.marginBottom = "20px";

    okButton.style.padding = "10px";
    okButton.style.backgroundColor = "#f44336";
    okButton.style.color = "#fff";
    okButton.style.border = "none";
    okButton.style.borderRadius = "5px";
    okButton.style.cursor = "pointer";

    okButton.addEventListener("mouseenter", () => {
        okButton.style.backgroundColor = "#d32f2f";
    });

    okButton.addEventListener("mouseleave", () => {
        okButton.style.backgroundColor = "#f44336";
    });
}
