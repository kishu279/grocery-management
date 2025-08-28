(function () {
  var categoryListEl, contentEl;

  function groupByCategory(items) {
    return items.reduce(function (acc, item) {
      var key = item.category || "Other";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }

  function renderCategories(items) {
    var groups = groupByCategory(items);
    categoryListEl.innerHTML = "";
    Object.keys(groups)
      .sort()
      .forEach(function (cat) {
        var btn = document.createElement("button");
        btn.className = "category-item";
        btn.textContent = cat + " (" + groups[cat].length + ")";
        btn.addEventListener("click", function () {
          renderCategoryContent(cat, groups[cat]);
        });
        categoryListEl.appendChild(btn);
      });
    if (Object.keys(groups).length === 0) {
      categoryListEl.innerHTML =
        '<div class="empty-state"><p>No categories yet.</p></div>';
    }
  }

  function renderCategoryContent(category, items) {
    contentEl.innerHTML = "";
    var header = document.createElement("div");
    header.className = "details-header";
    header.innerHTML = "<h3>" + category + "</h3>";
    contentEl.appendChild(header);

    if (!items || items.length === 0) {
      var empty = document.createElement("div");
      empty.className = "empty-state";
      empty.innerHTML = "<p>No items in this category.</p>";
      contentEl.appendChild(empty);
      return;
    }

    items.forEach(function (item) {
      var row = document.createElement("div");
      row.className = "details-row";
      row.innerHTML =
        '<div class="left">' +
        item.name +
        " - " +
        item.quantity +
        " " +
        item.unit +
        "</div>" +
        '<div class="right">$' +
        Number(item.price || 0).toFixed(2) +
        "</div>";
      contentEl.appendChild(row);
    });
  }

  function init() {
    categoryListEl = document.getElementById("categoryList");
    contentEl = document.getElementById("itemDetailsContent");
    if (!categoryListEl || !contentEl) return;

    document.addEventListener("items:changed", function (e) {
      renderCategories(e.detail.items);
    });

    // initial
    renderCategories(DataManager.getItems());
  }

  window.ItemDetails = { init: init };
})();
