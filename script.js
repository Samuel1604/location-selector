const locations = [
  { name: "Market", type: "productive" },
  { name: "Gym", type: "productive" },
  { name: "Club", type: "fun" },
  { name: "Spa", type: "fun" },
  { name: "Office", type: "productive" },
];

// This array stores the user's click history, as object with name(location) and count(number of times selected)
let locationhistory = [];

// Grab the DOM elements once so we can reuse them throughout the script.
const selector = document.getElementById("locationSelect");
const suggestionBtn = document.getElementById("suggestBtn");
const locationsList = document.getElementById("locationsContainer");
const historyList = document.getElementById("historyList");

// Render the location suggestion cards based on the list we pass in.
function showLocations(locationOptions) {
  locationsList.innerHTML = "";

  // If nothing matches the selected category, show a clear empty state instead of a blank area.
  if (locationOptions.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "No locations match that type yet. Try another option.";
    locationsList.appendChild(emptyState);
    return;
  }

  // Create one card for each location suggestion.
  // Clicking a card adds that location to history or increases its count if it already exists.
  locationOptions.forEach((location) => {
    const card = document.createElement("article");
    const title = document.createElement("h3");
    const badge = document.createElement("span");

    card.className = "location-card";
    title.textContent = location.name;
    badge.className = `badge ${location.type}`;
    badge.textContent = location.type;

    card.append(title, badge);
    locationsList.appendChild(card);

    card.addEventListener("click", function () {
      // Check whether the clicked location already exists in the history list.
      // If it does, we increase its count and move it to the top.
      let existingLocation = locationhistory.find(
        (item) => item.name === location.name,
      );

      if (existingLocation) {
        existingLocation.count++;

        // Remove the old copy so we can reinsert the updated entry at the beginning.
        // This keeps the newest interaction visible first in the history section.
        locationhistory = locationhistory.filter(
          (loca) => loca.name !== location.name,
        );
        locationhistory.unshift(existingLocation);
      } else {
        // If this location has never been selected before, add it with a starting count of 1.
        locationhistory.unshift({ name: location.name, count: 1 });
      }

      showHistory();
    });
  });
}

// When the button is clicked, read the selected type and decide what to show.
// "All" displays every location, while the other options filter the data by type.
suggestionBtn.addEventListener("click", function () {
  const selectedType = selector.value;
  let filtered = locations;

  // If the user has not chosen anything yet, keep the interface helpful with a short message.
  if (selectedType === "") {
    showLocations([]);
    return;
  }

  if (selectedType !== "all") {
    filtered = locations.filter((location) => location.type === selectedType);
  }

  showLocations(filtered);
});

// Render the history list from the current history array.
// Each list item shows the location name, how many times it was selected, and supports removal on click.
function showHistory() {
  historyList.innerHTML = "";

  // Show an instructional message if the user has not selected any suggestions yet.
  if (locationhistory.length === 0) {
    const emptyHistory = document.createElement("li");
    emptyHistory.className = "empty-state";
    emptyHistory.textContent = "Your selection history will appear here.";
    historyList.appendChild(emptyHistory);
    return;
  }

  locationhistory.forEach((location) => {
    const li = document.createElement("li");
    const name = document.createElement("span");
    const count = document.createElement("span");

    name.className = "history-name";
    count.className = "history-count";

    name.textContent = location.name;
    count.textContent = `Selected ${location.count} time${location.count > 1 ? "s" : ""}`;

    li.title = `Remove ${location.name} history`;
    li.append(name, count);

    // Clicking a history item removes it from the history array, then redraws the list.
    li.addEventListener("click", function () {
      locationhistory = locationhistory.filter(
        (local) => local.name !== location.name,
      );
      showHistory();
    });
    historyList.appendChild(li);
  });
}

// Draw the default history state when the page first loads.
showHistory();
