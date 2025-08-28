(function () {
  var modal, closeBtn, cancelBtn, editForm;

  function openModal(item) {
    if (!modal) return;
    document.getElementById("editId").value = item.id;
    document.getElementById("editItemName").value = item.name;
    document.getElementById("editItemCategory").value = item.category;
    document.getElementById("editItemQuantity").value = item.quantity;
    document.getElementById("editItemUnit").value = item.unit;
    document.getElementById("editItemPrice").value = item.price || 0;
    document.getElementById("editItemNotes").value = item.notes || "";
    modal.classList.add("open");
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
  }

  function setupModal() {
    modal = document.getElementById("editModal");
    if (!modal) return;
    closeBtn = modal.querySelector(".close");
    cancelBtn = document.getElementById("cancelEdit");
    editForm = document.getElementById("editForm");

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });

    if (editForm) {
      editForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var updated = {
          id: document.getElementById("editId").value,
          name: document.getElementById("editItemName").value.trim(),
          category: document.getElementById("editItemCategory").value,
          quantity: Number(document.getElementById("editItemQuantity").value),
          unit: document.getElementById("editItemUnit").value,
          price: Number(document.getElementById("editItemPrice").value || 0),
          notes: document.getElementById("editItemNotes").value.trim(),
        };
        DataManager.updateItem(updated);
        closeModal();
      });
    }
  }

  window.Modal = { open: openModal, close: closeModal, setup: setupModal };
})();
