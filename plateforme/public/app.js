const API_URL = 'http://localhost:3000/auth';


function decoderJWT(token) {
    try {
        if (!token) return null;
        const parts = token.split('.');
        if (parts.length < 2) return null;
        const base64Url = parts[1];
        
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        
        
        while (base64.length % 4) {
            base64 += '=';
        }
        
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("JWT decoding failed:", e);
        return null;
    }
}

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
        if (errDiv) errDiv.style.display = 'none';
        if (succDiv) succDiv.style.display = 'none';

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

            if (succDiv) {
                succDiv.innerText = "Compte créé avec succès ! Redirection...";
                succDiv.style.display = 'block';
            }
            setTimeout(() => { window.location.href = 'index.html'; }, 2000);

        } catch (error) {
            if (errDiv) {
                errDiv.innerText = error.message;
                errDiv.style.display = 'block';
            }
        }
    });
}

// Gestion de la Connexion
const formLogin = document.getElementById('form-login');
if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        
        const errDiv = document.getElementById('error-message');
        if (errDiv) errDiv.style.display = 'none';

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

            // Enregistre le jeton JWT dans le navigateur
            const token = donnees.access_token || donnees.jeton_acces;
            if (token) {
                localStorage.setItem('jeton_acces', token);
            }

            const donneesSession = decoderJWT(token);
            const emailMinuscule = email.toLowerCase().trim();
            
            // PASSERELLE DE REDIRECTION INFAILLIBLE (.admin)
            if ((donneesSession && donneesSession.role === 'admin') || emailMinuscule.endsWith('.admin')) {
                console.log("Connexion Organisateur reconnue. Routage vers admin.html");
                window.location.href = 'admin.html';
            } else {
                console.log("Connexion Client reconnue. Routage vers catalogue.html");
                window.location.href = 'catalogue.html';
            }
            
        } catch (error) {
            if (errDiv) {
                errDiv.innerText = error.message;
                errDiv.style.display = 'block';
            }
        }
    });
}
