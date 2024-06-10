let button = document.createElement("button");
button.textContent = "Get Prompt";
button.id = "pf";

button.type = "button";

document
  .querySelector(
    ".overflow-hidden.flex.flex-col.w-full.flex-grow.relative.border.rounded-2xl.bg-token-main-surface-primary.border-token-border-medium"
  )
  .appendChild(button);

button.disabled = true;

document.getElementById("prompt-textarea").addEventListener("input", (e) => {
  button.disabled = e.target.value == "";
});
