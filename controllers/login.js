const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {decrypt} = require('caesar-encrypt');

const caesarDecrypt = {
  toDecrypt: function(stringToDecrypt, shift) {
    let decryptedFinal = '';

    for (let i = 0; i < stringToDecrypt.length; i++) {
      let charText = stringToDecrypt.charCodeAt(i);
      if ((charText >= 65 && charText <= 90) || (charText >= 97 && charText <= 122) || 
          (charText >= 48 && charText <= 57) || (charText >= 32 && charText <= 47) || 
          (charText >= 58 && charText <= 64) || (charText >= 91 && charText <= 96) || 
          (charText >= 123 && charText <= 126)) {
        decryptedFinal += String.fromCharCode(((charText - 32 - shift + 94) % 94) + 32);
      } else {
        decryptedFinal += stringToDecrypt.charAt(i);
      }
    }
    return decryptedFinal;
  }
}

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ status: "Please fill all fields." });
  } else {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.json({ status: "error", error: "Incorrect Email or Password." });
      }

      const origPassword = user.password;
      const origShiftKey = user.shiftKey;

      // Console Log Outputs
      console.log("This is the Original Shift Key: " + origShiftKey);
      console.log("This is the Original Password: " + origPassword);
      console.log("This is the User's inputted Password: " + password);
      console.log("This is the Decrypted Original Password: " + caesarDecrypt.toDecrypt(origPassword, origShiftKey));

      // Actual Decryption
      const decryptedPass = caesarDecrypt.toDecrypt(origPassword, origShiftKey);


      if (!(decryptedPass === password)) {
        return res.json({ status: "error", error: "Incorrect Email or Password." });
      } else if (decryptedPass === password) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES,
        });

        const cookieOptions = {
          expiresIn: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
          httpOnly: true
        };

        res.cookie("userRegistered", token, cookieOptions);
        return res.json({ status: "success", success: "User has been logged in. Please go to the Landing Page immediately." });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: "error", error: "Server error" });
    }
  }
};

module.exports = login;
