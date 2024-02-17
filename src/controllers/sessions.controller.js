
export const registerUser = async (req, res) => {

    res.send({ status: "success", message: "Usuario registrado" });
};

export const loginUser = async (req, res) => {

    if (!req.user) {
        res.status(400).send();
        return;
    }

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
    };

    res.send({ status: "success", payload: req.user });
};

export const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send({
                status: "error",
                error: "Error al cerrar sesión",
            });
        }

        res.redirect("/login");
    });
};

export const githubAuth = passport.authenticate("github", { scope: ["user:email"] });

export const githubAuthCallback = passport.authenticate("github", { failureRedirect: "/login" });

export const failRegister = async (req, res) => {
    res.send({ error: "Error al registrarse" });
};

export const failLogin = (req, res) => {
    res.send({ error: "Error al iniciar sesión" });
};
