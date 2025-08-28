(function () {
    var form, clearBtn, listContainer, totalItemsEl, totalValueEl;
    var searchInput, categoryFilter, clearFiltersBtn;
    var itemNameDatalist;

    function clearFormFields() {
        form.reset();
    }

    function createItemCard(item) {
        var card = document.createElement('div');
        card.className = 'grocery-item';
        card.innerHTML = `
            <div class="item-main">
                <div class="item-title">${item.name}</div>
                <div class="item-meta">${item.quantity} ${item.unit} • ${item.category}</div>
            </div>
            <div class="item-right">
                <div class="item-price">$${Number(item.price || 0).toFixed(2)}</div>
                <div class="item-actions">
                    <button class="btn btn-small btn-outline edit">Edit</button>
                    <button class="btn btn-small btn-danger delete">Delete</button>
                </div>
            </div>`;

        card.querySelector('.edit').addEventListener('click', function () {
            Modal.open(item);
        });
        card.querySelector('.delete').addEventListener('click', function () {
            if (confirm('Delete "' + item.name + '"?')) {
                DataManager.deleteItem(item.id);
            }
        });
        return card;
    }

    function applyFilters(items) {
        var q = (searchInput.value || '').toLowerCase();
        var cat = categoryFilter.value || '';
        return items.filter(function (i) {
            var matchesText = !q || (i.name && i.name.toLowerCase().includes(q)) || (i.notes && i.notes.toLowerCase().includes(q));
            var matchesCat = !cat || i.category === cat;
            return matchesText && matchesCat;
        });
    }

    function renderList(items) {
        var filtered = applyFilters(items);
        listContainer.innerHTML = '';
        if (filtered.length === 0) {
            var empty = document.createElement('div');
            empty.className = 'empty-state';
            empty.innerHTML = '<i class="fas fa-shopping-basket"></i><p>No items match your filters.</p>';
            listContainer.appendChild(empty);
        } else {
            filtered.forEach(function (item) {
                listContainer.appendChild(createItemCard(item));
            });
        }

        var totals = filtered.reduce(function (acc, i) {
            acc.count += 1;
            acc.value += Number(i.price || 0) * Number(i.quantity || 0);
            return acc;
        }, { count: 0, value: 0 });
        totalItemsEl.textContent = 'Total Items: ' + totals.count;
        totalValueEl.textContent = 'Total Value: $' + totals.value.toFixed(2);
    }

    function updateItemNameSuggestions(items) {
        if (!itemNameDatalist) return;
        var uniqueNames = Array.from(new Set(items.map(function (i) { return i.name; }).filter(Boolean))).sort();
        itemNameDatalist.innerHTML = '';
        uniqueNames.forEach(function (name) {
            var opt = document.createElement('option');
            opt.value = name;
            itemNameDatalist.appendChild(opt);
        });
    }

    function bindEvents() {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var item = {
                name: document.getElementById('itemName').value.trim(),
                category: document.getElementById('itemCategory').value,
                quantity: Number(document.getElementById('itemQuantity').value),
                unit: document.getElementById('itemUnit').value,
                price: Number(document.getElementById('itemPrice').value || 0),
                notes: document.getElementById('itemNotes').value.trim()
            };
            if (!item.name || !item.category || !item.quantity || !item.unit) return;
            DataManager.addItem(item);
            clearFormFields();
        });

        clearBtn.addEventListener('click', function () {
            clearFormFields();
        });

        searchInput.addEventListener('input', function () {
            renderList(DataManager.getItems());
        });
        categoryFilter.addEventListener('change', function () {
            renderList(DataManager.getItems());
        });
        clearFiltersBtn.addEventListener('click', function () {
            searchInput.value = '';
            categoryFilter.value = '';
            renderList(DataManager.getItems());
        });

        document.addEventListener('items:changed', function (e) {
            renderList(e.detail.items);
            updateItemNameSuggestions(e.detail.items);
        });
    }

    function init() {
        form = document.getElementById('groceryForm');
        clearBtn = document.getElementById('clearForm');
        listContainer = document.getElementById('groceryList');
        totalItemsEl = document.getElementById('totalItems');
        totalValueEl = document.getElementById('totalValue');
        searchInput = document.getElementById('searchInput');
        categoryFilter = document.getElementById('categoryFilter');
        clearFiltersBtn = document.getElementById('clearFilters');
        itemNameDatalist = document.getElementById('itemNameList');

        if (!form || !listContainer) return;
        bindEvents();
        var items = DataManager.getItems();
        renderList(items);
        updateItemNameSuggestions(items);
    }

    window.Home = { init: init };
})();


