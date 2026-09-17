const API_URL = 'http://localhost:3000/auth';

// Gestion de l'Inscription
const formRegister = document.getElementById('form-register');
if (formRegister) {
    formRegister.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nom = document.getElementById('register-nom').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        
        const errDiv = document.getElementById('error-message');
        const succDiv = document.getElementById('success-message');
        errDiv.style.display = 'none';
        succDiv.style.display = 'none';

        try {
            const reponse = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nom, email, password })
            });

            const donnees = await reponse.json();

            if (!reponse.ok) {
                throw new Error(donnees.message || "Une erreur est survenue lors de l'inscription.");
            }

            succDiv.innerText = "Compte créé avec succès ! Redirection...";
            succDiv.style.display = 'block';
            setTimeout(() => { window.location.href = 'index.html'; }, 2000);

        } catch (error) {
            errDiv.innerText = error.message;
            errDiv.style.display = 'block';
        }
    });
}

// Gestion de la Connexion
const formLogin = document.getElementById('form-login');
if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        const errDiv = document.getElementById('error-message');
        errDiv.style.display = 'none';

        try {
            const reponse = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const donnees = await reponse.json();

            if (!reponse.ok) {
                throw new Error(donnees.message || "Identifiants incorrects.");
            }

            // Enregistre le jeton JWT de l'examen dans le navigateur
            localStorage.setItem('jeton_acces', donnees.access_token);
            alert('Connexion réussie ! Jeton JWT enregistré.');
            
            // code pour rediriger vers la page des événements.....
            
        } catch (error) {
            errDiv.innerText = error.message;
            errDiv.style.display = 'block';
        }
    });
}
