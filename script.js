const search = document.getElementById('search'),
  submit = document.getElementsByClassName('search_btn'),
  favDiv = document.getElementById('favDiv'),
  resultHeading = document.getElementById('result_heading'),
  mealsEl = document.getElementById('meals'),
  single_mealEl = document.getElementById('single_meal');

  
let meals = [];


  function searchMeal(e) {
    e.preventDefault();
  
    // clear single Meal
    single_mealEl.innerHTML = '';
  
    // get search value
    const dish = search.value;
  
    // Check for empty
    if (dish.trim()) {
      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${dish}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          resultHeading.innerHTML = `<h2>Search results for ' ${dish} ' :</h2>`;
  
          if (data.meals === null) {
            resultHeading.innerHTML = `<p> no meals found for ${dish}. Search another one </p>`;
          } else {
            mealsEl.innerHTML = data.meals
              .map(
                (meal) => `
                <div class = 'meal' > 
                  <img src = '${meal.strMealThumb}' alt = '${meal.strMeal}'/>
                  <span class='favourite'  data-mealID="${meal.idMeal}" onclick='addMeal(event);' > <i class="fa-regular fa-bookmark"></i> </span>
                  <a href="#single-meal">
                    <div class = 'meal-info' data-mealID="${meal.idMeal}">
                      <h3> ${meal.strMeal} </h3>
                    </div>
                  </a>
                </div>
            `
              )
              .join('');
          }
        });
    } else {
      alert('Please enter a dish');
    }
  }


  // Fetch meal by Id
function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const meal = data.meals[0];
  
        addMealToDom(meal);
      });
  }
  
  // Add meal to DOM
  function addMealToDom(meal) {
    const ingredients = [];
  
    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`]) {
        ingredients.push(
          `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
        );
      } else {
        break;
      }
    }
  
    single_mealEl.innerHTML = `
    <h1 class='heading'>${meal.strMeal}</h1>
    <div class='single-meal'>
      <div class= "flex-container1" >
        <img src = '${meal.strMealThumb}' alt = '${meal.strMeal}' />
        <div class = 'single-meal-info'>
          ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
          ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
        </div>
      </div>
  
      <div class = 'main'>
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map((img) => `<li> ${img} </li>`).join('')}
        </ul>
      </div>
  
    </div>
    `;
  }
  
//   Add meals to favourite by clicking bookmark icon
  function addMeal(e) {
    // console.log(e);
    const mealInfo = e.path.find((item) => {
      if (item.classList) {
        return item.classList.contains('favourite');
      } else {
        console.log('class not found');
        return false;
      }
    });
  
    if (mealInfo) {
      const mealID = mealInfo.getAttribute('data-mealID');
      // console.log(mealID);
      fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then((res) => res.json())
        .then((data) => {
          const meal = data.meals[0];
  
          // store object in local store
          let storeMeal = {
            thumbnail: meal.strMealThumb,
            heading: meal.strMeal,
          };
          // Push to global Array
          meals.push(storeMeal);
          window.localStorage.setItem('meal', JSON.stringify(meals));
  
          let div = document.createElement('div');
          div.innerHTML = `
            <div class='fav-container'>
             
              <img src = '${storeMeal.thumbnail}' alt = '${storeMeal.strMeal}' />
              <h1 class='heading'>${storeMeal.heading}</h1>
              <span onclick = 'deleteMeal(event);'><i class="fa-solid fa-rectangle-xmark"></i></span>
              
            </div>
          `;
          // Rendering on DOM
          favDiv.appendChild(div);
        });
    }
  }
  

  submit[0].addEventListener('click', searchMeal);


  mealsEl.addEventListener('click', (e) => {
    const mealInfo = e.path.find((item) => {
      if (item.classList) {
        return item.classList.contains('meal-info');
      } else {
        return false;
      }
    });
  
    if (mealInfo) {
      const mealID = mealInfo.getAttribute('data-mealID');
      getMealById(mealID);
    }
  });
