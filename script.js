
async function searchCountry(countryName) {
    const spinner = document.getElementById('loading-spinner');
    const countryInfo = document.getElementById('country-info');
    const borderContainer = document.getElementById('bordering-countries');

    try {
        
        countryInfo.innerHTML = "";
        borderContainer.innerHTML = "";

     
        spinner.style.display = "block";

        
        const response = await fetch(
            `https://restcountries.com/v3.1/name/${countryName}?fullText=true`
        );

        if (!response.ok) {
            throw new Error("Country not found");
        }

        const data = await response.json();
        const country = data[0];

        
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital?.[0] || "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag" width="150">
        `;

    
        if (country.borders && country.borders.length > 0) {

            borderContainer.innerHTML = `<h3>Bordering Countries:</h3>`;

            const borderPromises = country.borders.map(code =>
                fetch(`https://restcountries.com/v3.1/alpha/${code}`)
                    .then(res => res.json())
            );

            const borderResults = await Promise.all(borderPromises);

            borderResults.forEach(result => {
                const borderCountry = result[0];
                borderContainer.innerHTML += `
                    <div style="display:inline-block; margin:10px;">
                        <p>${borderCountry.name.common}</p>
                        <img src="${borderCountry.flags.svg}" width="60">
                    </div>
                `;
            });

        } else {
            borderContainer.innerHTML = `
                <p><strong>Borders:</strong> None</p>
            `;
        }

    } catch (error) {
        countryInfo.innerHTML = `<p style="color:red;">${error.message}</p>`;
        borderContainer.innerHTML = "";
    } finally {
        spinner.style.display = "none";
    }
}


document.getElementById('search-btn').addEventListener('click', () => {
    const country = document.getElementById('country-input').value.trim();
    if (country) {
        searchCountry(country);
    }
});