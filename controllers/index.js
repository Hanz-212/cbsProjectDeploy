const db = require("../routes/db-config");

function getRandomPrime(min, max) {
  // Generate a random number between min and max
  var num = Math.floor(Math.random() * (max - min + 1)) + min;
  
  // Check if the number is prime
    while (!isPrime(num)) {
    // If it's not prime, generate a new random number
    num = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  // Return the random prime number
  return num;
}
  
function isPrime(num) {
  // Check if the number is less than 2 or not an integer
  if (num < 2 || !Number.isInteger(num)) {
    return false;
  }

  // Check if the number is 2
  if (num === 2) {
    return true;
  }

  // Check if the number is even
  if (num % 2 === 0) {
    return false;
  }

  // Check for factors up to the square root of the number
  for (var i = 3; i <= Math.sqrt(num); i += 2) {
    if (num % i === 0) {
      return false;
    }
  }

  // If no factors are found, the number is prime
  return true;
}

// Shift key for affine encryption
let shiftKeyA = getRandomPrime(0, 25);
const shiftKeyB = Math.floor(Math.random() * 26);

// ---------- section for affine encryption ----------
// declaring characters 
function affineEncrypt(plaintext, a, b) {
  var ciphertext = "";
  for (var i = 0; i < plaintext.length; i++) {
    var charCode = plaintext.charCodeAt(i);
    var cipherCode;
    if (charCode >= 65 && charCode <= 90) { // Capital letters
      cipherCode = ((a * (charCode - 65) + b) % 26) + 65;
    } else if (charCode >= 97 && charCode <= 122) { // Small letters
      cipherCode = ((a * (charCode - 97) + b) % 26) + 97;
    } else { // Special characters
      cipherCode = charCode;
    }
    ciphertext += String.fromCharCode(cipherCode);
  }
  return ciphertext;
}

// AFFINE DECRYPT FOR FUTURE USE
//   function affineDecrypt(ciphertext, a, b) {
//     var plaintext = "";
//     var a_inv = modInverse(a, 26);
//     for (var i = 0; i < ciphertext.length; i++) {
//       var charCode = ciphertext.charCodeAt(i);
//       var plainCode;
//       if (charCode >= 65 && charCode <= 90) { // Capital letters
//         plainCode = ((a_inv * ((charCode - 65) - b + 26)) % 26) + 65;
//       } else if (charCode >= 97 && charCode <= 122) { // Small letters
//         plainCode = ((a_inv * ((charCode - 97) - b + 26)) % 26) + 97;
//       } else { // Special characters
//         plainCode = charCode;
//       }
//       plaintext += String.fromCharCode(plainCode);
//     }
//     return plaintext;
//   }
  
//   // Helper function to calculate modular inverse
//   function modInverse(a, m) {
//     for (var x = 1; x < m; x++) {
//       if ((a * x) % m == 1) {
//         return x;
//       }
//     }
//     return -1; // If modular inverse doesn't exist
//   }

const index = async (req, res) => {         
	const { lastName, firstName, middleName, homeAddress, country, stateId, city, zipCode, birthdate, gender, hobby, civilStatus } = req.body

  console.log(stateId);
  const encryptedFirstName = affineEncrypt(firstName, shiftKeyA, shiftKeyB);
  const encryptedLastName = affineEncrypt(lastName, shiftKeyA, shiftKeyB);

	if(country === ""){
    return res.json({ status: "error", error: "Please Select a Valid Country." });
  }else if(stateId === ""){
    return res.json({ status: "error", error: "Please Select a Valid State/Region." });
  }else if(city === ""){
    return res.json({ status: "error", error: "Please Select a Valid City." });
  }else if(!firstName || !lastName || !middleName || !birthdate || !gender || !homeAddress || !zipCode || !hobby || !civilStatus) {
    return res.json({ status: "error", error: "Please fill all fields." });
	}else if (!zipCode.search(/^[0-9]*$/) < 0) {
    return res.json({ status: "error", error: "Zip Code should all be numbers and should only contain digits" });
  }else if (firstName <= 2) {
    return res.json({ status: "error", error: "First Name should be at least 2 characters" });
  }else if (lastName <= 2) {
    return res.json({ status: "error", error: "Last Name should be at least 2 characters" });
  }else if (middleName <= 2) {
    return res.json({ status: "error", error: "Middle Name should be at least 2 characters" });
  }else if (!zipCode == 4) {
    return res.json({ status: "error", error: "Zip code should contain only 4 digits" });
  }else {
    db.query('INSERT INTO infouser SET ?', { lastName: encryptedLastName, firstName: encryptedFirstName, middleName: middleName, homeAddress: homeAddress, city: city, region: stateId, country: country, gender: gender, zipCode: zipCode, birthdate: birthdate, hobby: hobby, civilStatus: civilStatus, shiftKeyA: shiftKeyA, shiftKeyB: shiftKeyB }, (error, results) => {
	  	if (error) throw error;
		
      return res.json({ status: "success", success: "User has been registered successfully!" })
		})
	}
}

module.exports = index;


