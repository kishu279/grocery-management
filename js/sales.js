(function () {
    var form, clearBtn, offersListEl, offerItemSelect;

    function populateItemsDropdown(items) {
        offerItemSelect.innerHTML = '<option value="">Select an item</option>';
        items.forEach(function (i) {
            var opt = document.createElement('option');
            opt.value = i.id;
            opt.textContent = i.name;
            offerItemSelect.appendChild(opt);
        });
    }

    function renderOffers(offers) {
        offersListEl.innerHTML = '';
        if (!offers || offers.length === 0) {
            var empty = document.createElement('div');
            empty.className = 'empty-state';
            empty.innerHTML = '<i class="fas fa-tags"></i><p>No offers available yet!</p>';
            offersListEl.appendChild(empty);
            return;
        }

        offers.forEach(function (offer) {
            var item = DataManager.getItems().find(function (i) { return i.id === offer.itemId; });
            var row = document.createElement('div');
            row.className = 'offer-row';
            row.innerHTML = '
                <div class="left">\n'
                + '  <div class="title">' + (item ? item.name : 'Unknown Item') + '</div>\n'
                + '  <div class="meta">' + offer.type + ' • ' + (offer.value || 0) + ' • ' + offer.startDate + ' → ' + offer.endDate + '</div>\n'
                + '</div>\n'
                + '<div class="right">\n'
                + '  <button class="btn btn-small btn-danger delete">Delete</button>\n'
                + '</div>';

            row.querySelector('.delete').addEventListener('click', function () {
                if (confirm('Delete this offer?')) {
                    DataManager.deleteOffer(offer.id);
                }
            });
            offersListEl.appendChild(row);
        });
    }

    function bindEvents() {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var payload = {
                itemId: document.getElementById('offerItem').value,
                type: document.getElementById('offerType').value,
                value: Number(document.getElementById('offerValue').value || 0),
                startDate: document.getElementById('offerStartDate').value,
                endDate: document.getElementById('offerEndDate').value,
                description: document.getElementById('offerDescription').value.trim()
            };
            if (!payload.itemId || !payload.type || !payload.startDate || !payload.endDate) return;
            DataManager.addOffer(payload);
            form.reset();
        });

        clearBtn.addEventListener('click', function () { form.reset(); });

        document.addEventListener('items:changed', function (e) {
            populateItemsDropdown(e.detail.items);
        });
        document.addEventListener('offers:changed', function (e) {
            renderOffers(e.detail.offers);
        });
    }

    function init() {
        form = document.getElementById('offerForm');
        clearBtn = document.getElementById('clearOfferForm');
        offersListEl = document.getElementById('offersList');
        offerItemSelect = document.getElementById('offerItem');
        if (!form || !offersListEl || !offerItemSelect) return;
        bindEvents();
        populateItemsDropdown(DataManager.getItems());
        renderOffers(DataManager.getOffers());
    }

    window.Sales = { init: init };
})();


