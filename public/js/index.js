form.addEventListener("submit", () => {
    console.log(hobby)
    const hobbies = Array.from(hobby).filter(h => h.checked).map(h => h.value)
    console.log(hobbies.join())
    console.log(region);
    const index = {
        lastName: lastName.value,
        firstName: firstName.value,
        middleName: middleName.value,
        homeAddress: homeAddress.value,
        country: country.value,
        stateId: stateId.value,
        city: city.value,
        zipCode: zipCode.value,
        gender: gender.value,
        birthdate: birthdate.value,
        hobby: hobbies.join(),
        civilStatus: civilStatus.value
    }
    fetch("/api/index", {
        method: "POST",
        body: JSON.stringify(index),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.json())
        .then(data => {
            if (data.status == "error") {
                success.style.display = "none"
                error.style.display = "block"
                error.innerText = data.error
            } else {
                error.style.display = "none"
                success.style.display = "block"
                success.innerText = data.success
            }
        })
})


