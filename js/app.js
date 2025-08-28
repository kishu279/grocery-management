(function () {
  function init() {
    Navigation.setup();
    Home.init();
    ItemDetails.init();
    Sales.init();
    Modal.setup();

    // initial renders
    document.dispatchEvent(
      new CustomEvent("items:changed", {
        detail: { items: DataManager.getItems() },
      })
    );
    document.dispatchEvent(
      new CustomEvent("offers:changed", {
        detail: { offers: DataManager.getOffers() },
      })
    );

    // default page
    Navigation.showPage("home");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
