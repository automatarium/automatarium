import './warningModal.css'

export function showWarningModal(message: string) {
    // Create the necessary DOM elements
    console.log(message)
    const modal = document.createElement("div");
    modal.classList.add("modal");

    const content = document.createElement("div");
    content.classList.add("modal-content");

    const messageElem = document.createElement("p");
    messageElem.textContent = message;
    // Set text color to black, initially white for some reason
    messageElem.style.color = "black";

    const okButton = document.createElement("button");
    okButton.textContent = "OK";

    // Add the elements to the DOM
    content.appendChild(messageElem);
    content.appendChild(okButton);
    modal.appendChild(content);
    document.body.appendChild(modal);

    // Add event listener to remove the modal when the OK button is clicked
    okButton.addEventListener("click", () => {
        document.body.removeChild(modal);
    });

    // Apply styles to the modal and its content
    modal.style.display = "block";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    modal.style.zIndex = "9999";

    content.style.position = "absolute";
    content.style.top = "50%";
    content.style.left = "50%";
    content.style.transform = "translate(-50%, -50%)";
    content.style.backgroundColor = "#fff";
    content.style.padding = "20px";
    content.style.borderRadius = "5px";
    content.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";
}  