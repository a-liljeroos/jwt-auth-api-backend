const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
require("dotenv").config();

var securityKey;
var newUser;
var userDataBase = [
  {
    username: "admin2",
    password: "$2b$10$LEAmbUJRCyMB8NJBbkiKaOcNtdhYROalXfw0IsiTkqtEviXlyp7xa",
    email: "josh.dean@dean.com",
  },
];

router.get("/", (req, res) => {
  res.sendStatus(200);
});

router.post("/register", (req, res) => {
  var userData = req.body.formData;
  if (userData !== undefined) {
    delete userData["repeatPw"];
    newUser = req.body.formData;
    securityKey = generateNewId(1000, 9999);
    res.json({ key: securityKey });
  }
});

router.post("/verifyemail", async (req, res) => {
  var code = req.body.verificationCode;

  if (code === securityKey) {
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    userDataBase.push(newUser);

    res.status(200).json({ msg: "User added" });
  } else {
    res
      .status(422)
      .json({ errors: [{ msg: `Wrong code. The code was ${securityKey}` }] });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const loggingUser = userDataBase.find((user) => {
    return user.username === username;
  });

  if (!loggingUser) {
    return res
      .status(200)
      .json({ errors: [{ msg: "Wrong username and password" }] });
  }

  const passOk = await bcrypt.compare(password, loggingUser.password);

  if (!passOk) {
    return res.status(200).json({ errors: [{ msg: "Wrong password" }] });
  }

  const accessToken = await JWT.sign(
    { user: loggingUser.username },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: "10s",
    }
  );

  res.json({
    accessToken,
  });
});

const generateNewId = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

module.exports = router;
