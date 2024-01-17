import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import bcrypt from "bcrypt";
import userModel from "../dao/models/user.model.js";

const LocalStrategy = local.Strategy;

const inicializePassport = () => {

    passport.use("register", new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;

            try {
                let user = await userModel.findOne({ email: username });
                if (user) {
                    console.log('Usuario ya registrado');
                    return done(null, false)
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
                }
                const result = await userModel.create(newUser);
                return done(null, result);

            } catch (error) {
                return done(error)
            };

        }));

    passport.use("login", new LocalStrategy(
        { usernameField: "email" },
        async (username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username });
                if (!user) {
                    return done(null, false);
                }
                if (!bcrypt.compareSync(password, user.password)) {
                    return done(null, false);
                }
                return done(null, user)
            } catch (error) {
                return done(error); 
            }
        }));

    passport.serializeUser((user, done) => {
        done(null, user._id)
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    });

    passport.use('github', new GitHubStrategy({
        clientID: "Iv1.ebbda7154cc14fe0",
        clientSecret: "ff6a91b2e5c882ed1f9d51f63688a319b9b0556a",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accesToken, refreshToken, profile, done) => {
        try {
            console.log(profile._json.name);
            const first_name = profile._json.name
            let email;
            if (!profile._json.email) {
                email = profile.username;
            };

            let user = await userModel.findOne({ email: profile._json.email });
            if (user) {
                console.log('Usuario ya registrado');
                return done(null, false)
            };

            const newUser = {
                first_name,
                last_name: "",
                email,
                age: 18,
                password: ""
            }
            const result = await userModel.create(newUser);
            return done(null, result);

        } catch (error) {
            return done(error)
        }

    }));

};

export default inicializePassport;