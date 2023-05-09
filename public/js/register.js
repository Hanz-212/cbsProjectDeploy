form.addEventListener("submit", ()=>{
    const register = {
        usertype: usertype.value,
        firstname: firstname.value,
        lastname: lastname.value,
        age: age.value,
        gender: gender.value,
        section: section.value,
        email: email.value,
        password: password.value,
        confirmpassword: confirmpassword.value
    }
    fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(register),
        headers: {
            "Content-Type":"application/json"
        }
    }).then(res => res.json())
        .then(data => {
            if(data.status == "error"){
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