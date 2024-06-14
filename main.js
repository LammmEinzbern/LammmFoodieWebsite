document.addEventListener("DOMContentLoaded", () => {
  const menuList = document.getElementById("menu-list");
  const searchButton = document.getElementById("search-button");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");
  const hamburgerButton = document.getElementById("hamburger-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modal-content");
  const closeModal = document.getElementById("close-modal");
  const sliderInner = document.getElementById("slider-inner");
  const faqItems = document.querySelectorAll(".faq-item");

  hamburgerButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      answer.classList.toggle("hidden");
    });
  });

  fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=")
    .then((response) => response.json())
    .then((data) => {
      const sliderInner = document.getElementById("slider-inner");
      if (data.meals) {
        data.meals.slice(0, 5).forEach((meal) => {
          const imgElement = document.createElement("img");
          imgElement.src = meal.strMealThumb;
          imgElement.alt = meal.strMeal;
          imgElement.classList.add(
            "inline-block",
            "w-full",
            "h-96",
            "object-cover"
          );
          sliderInner.appendChild(imgElement);
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching images:", error);
    });

  fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=")
    .then((response) => response.json())
    .then((data) => {
      const meals = data.meals;
      menuList.innerHTML = meals
        .map(
          (meal) => `
              <div class="border p-4 rounded shadow-lg cursor-pointer" data-id="${meal.idMeal}">
                  <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full h-48 object-cover rounded mb-4">
                  <h3 class="text-2xl font-bold mb-2">${meal.strMeal}</h3>
              </div>
          `
        )
        .join("");
      document.querySelectorAll("#menu-list > div").forEach((item) => {
        item.addEventListener("click", () =>
          showMealDetails(item.getAttribute("data-id"))
        );
      });
    })
    .catch((error) => console.error("Error fetching menu:", error));

  searchButton.addEventListener("click", () => {
    const query = searchInput.value;
    if (query) {
      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
        .then((response) => response.json())
        .then((data) => {
          const meals = data.meals;
          searchResults.innerHTML = meals
            ? meals
                .map(
                  (meal) => `
                          <div class="border p-4 rounded shadow-lg cursor-pointer" data-id="${meal.idMeal}">
                              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full h-48 object-cover rounded mb-4">
                              <h3 class="text-2xl font-bold mb-2">${meal.strMeal}</h3>
                          </div>
                      `
                )
                .join("")
            : "<p>No results found</p>";
          document.querySelectorAll("#search-results > div").forEach((item) => {
            item.addEventListener("click", () =>
              showMealDetails(item.getAttribute("data-id"))
            );
          });
        })
        .catch((error) => console.error("Error searching menu:", error));
    }
  });

  function showMealDetails(id) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then((response) => response.json())
      .then((data) => {
        const meal = data.meals[0];
        let modalContentHTML = `
          <h2 class="text-3xl font-bold mb-4">${meal.strMeal}</h2>
          <img src="${meal.strMealThumb}" alt="${
          meal.strMeal
        }" class="w-full h-full object-cover rounded mb-4" style="max-width: 100%; height: auto;">
          <p>${meal.strInstructions}</p>
          <ul class="mt-4">
            <li><strong>Category:</strong> ${meal.strCategory}</li>
            <li><strong>Area:</strong> ${meal.strArea}</li>
            <li><strong>Tags:</strong> ${
              meal.strTags ? meal.strTags.split(",").join(", ") : "None"
            }</li>
          </ul>
        `;

        if (meal.strYoutube) {
          modalContentHTML += `
            <div class="mt-4">
              <strong>YouTube Video:</strong> <a href="${meal.strYoutube}" target="_blank" class="text-blue-600">${meal.strYoutube}</a>
            </div>
          `;
        }

        modalContentHTML += `
          <div class="flex justify-center mb-4">
            <span class="text-2xl font-bold"></span>
            <span class="text-2xl font-bold ml-2">${
              meal.strMeasure ? meal.strMeasure : ""
            }</span>
          </div>
        `;

        modalContent.innerHTML = modalContentHTML;
        modal.classList.remove("hidden");
      })
      .catch((error) => console.error("Error fetching meal details:", error));
  }
  closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.add("hidden");
    }
  });

  function initSlider() {
    const slides = document.querySelectorAll("#slider-inner > div");
    let totalSlides = slides.length;
    let slideIndex = 0;

    function showSlide(index) {
      sliderInner.style.transform = `translateX(-${index * 100}%)`;
    }

    function autoSlide() {
      slideIndex = (slideIndex + 1) % totalSlides;
      showSlide(slideIndex);
    }

    let intervalId = setInterval(autoSlide, 3000);

    sliderInner.addEventListener("mouseenter", () => {
      clearInterval(intervalId);
    });

    sliderInner.addEventListener("mouseleave", () => {
      intervalId = setInterval(autoSlide, 3000);
    });
  }
});
