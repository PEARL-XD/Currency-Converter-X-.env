console.log("CURRENCY CONVERTER BY - PEARL - ");



const dropd = document.querySelectorAll(".dropd select");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");

// Populate currency dropdowns
for (let select of dropd) {
    for (let code in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = code;
        newOption.value = code;
        select.append(newOption);

        if (select.name === "from" && code === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && code === "INR") {
            newOption.selected = "selected";
        }
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Function to update currency flag
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newsrc = `https://flagsapi.com/${countryCode}/shiny/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newsrc;
};

// Function to fetch conversion rate from Node.js server
const fetchConversionRate = async (from, to) => {
    try {
        let response = await fetch(`/convert?from=${from}&to=${to}`);
        let result = await response.json();

        if (result.conversion_rate) {
            return result.conversion_rate;
        } else {
            console.error("Invalid response:", result);
            return null;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};

// Handle button click
let btn = document.querySelector("form button");
btn.addEventListener("click", async (evt) => {
    evt.preventDefault();

    let amount = document.querySelector("input");
    let amountValue = amount.value;

    if (amountValue === "" || amountValue < 1) {
        amountValue = 1;
        amount.value = 1;
    }

    let fromCurrency = fromCurr.value;
    let toCurrency = toCurr.value;

    let conversionRate = await fetchConversionRate(fromCurrency, toCurrency);
    
    if (conversionRate) {
        let finalAmount = amountValue * conversionRate;
        document.querySelector(".res").innerText = `${amountValue} ${fromCurrency} = ${finalAmount} ${toCurrency}`;
    } else {
        document.querySelector(".res").innerText = "Conversion failed. Try again.";
    }
});
