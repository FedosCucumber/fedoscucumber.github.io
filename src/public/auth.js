function auth_init() {
    supertokens.init({
        appInfo: {
            apiDomain: "http://localhost:3000",
            apiBasePath: "/auth",
            appName: "web-fi"
        },
        recipeList: [
            supertokensSession.init(),
            supertokensEmailPassword.init()
        ]
    })
    console.log("%cAuth%cSupertokens initiated", "background: linear-gradient(45deg, red, #ffc000); border-radius: 9px; padding: 5px 10px;", "padding-left: 5px")
}

window.addEventListener("DOMContentLoaded", function() {
    auth_init()

    const loginButton = this.document.getElementById("login-form-submit")
    if (loginButton) {
        loginButton.addEventListener("click", async function(event) {
            event.preventDefault()

            const email = document.getElementById("login-form-email").value
            const password = document.getElementById("login-form-password").value
    
            let response = await supertokensEmailPassword.signIn({
                formFields: [
                    {
                        "id": "email",
                        "value": email,
                    },
                    {
                        "id": "password",
                        "value": password,
                    }
                ]
            })
            if (response.status == "OK") {
                Toastify({
                    text: "Добро пожеловать!",
                    duration: 3000
                }).showToast()
                location.href = "/"
            } else {
                Toastify({
                    text: "Неправильный email или пароль",
                    duration: 3000
                }).showToast()
            }
        })
    }

    const logoutButton = this.document.getElementById("logoutbutton")
    if (logoutButton) {
        logoutButton.addEventListener("click", async function() {
            await supertokensEmailPassword.signOut()
            location.reload()
        })
    }

    const DrinkForm = this.document.getElementById("create-drink")
    try {
        DrinkForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const nameObject = document.getElementById("newdrink-name");
            const name = nameObject.value;
            const abvObject = document.getElementById("newdrink-abv");
            const abv = abvObject.value;
            const ibuObject = document.getElementById("newdrink-ibu");
            const ibu = ibuObject.value;
            const descriptionObject = document.getElementById("newdrink-description");
            const description = descriptionObject.value;

            const fileInput = document.getElementById('newdrink-image');
            const file = fileInput.files[0];

            if (name && abv && ibu && description && file) {
                const reader = new FileReader();

                reader.onload = function(event) {
                    const fileData = event.target.result;

                    websocket.emit("createDrink", {
                        name: name, 
                        abv: +abv, 
                        ibu: +ibu, 
                        description: description,
                        imageUrl: fileData,
                    })

                    Toastify({
                        text: "Напиток создан",
                        duration: 3000
                    }).showToast()
    
                    nameObject.value = "";
                    abvObject.value = "";
                    ibuObject.value = "";
                    descriptionObject.value = "";
                };

                reader.readAsDataURL(file);
            }
        })
    } catch {}
})

async function refreshSession() {
    try {
        const response = await fetch('/api/refresh-session', {
            method: 'POST',
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('Failed to refresh session');
        }
        const newSession = await response.json();
    } catch (error) {}
}

const websocket = io("http://localhost:3000")

websocket.on("connect", () => {
    console.log("%cWS%cWebsocket connected", "background: linear-gradient(45deg, #8600ff, #e91e63); border-radius: 9px; padding: 5px 10px;", "padding-left: 5px")
})

websocket.on("disconnect", () => {
    console.log("%cWS%cWebsocket disconnected", "background: linear-gradient(45deg, #8600ff, #e91e63); border-radius: 9px; padding: 5px 10px;", "padding-left: 5px")
})

websocket.on("drinksUpdate", () => {
    this.location.reload()
})

function rateDrink(drinkId, rating) {
    websocket.emit("rateDrink", {drinkId, rating})

    Toastify({
        text: `Напиток оценён в ${rating}⭐️`,
        duration: 3000
    }).showToast()
}

async function deleteDrink(drinkId) {
    websocket.emit("deleteDrink", drinkId)

    Toastify({
        text: "Напиток Удалён",
        duration: 3000
    }).showToast()
    
}

setInterval(refreshSession, 15 * 60 * 1000);