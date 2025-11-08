const userModel = require("./../models/user");
const jwt = require("jsonwebtoken");


async function registerUser(req, res) {
  const { body } = req;
  const existedUser = await userModel.findOne({ email: body.email });
  if (!existedUser) {
    const createdUser = await userModel.create(body);
    if (createdUser) {
      res
        .status(200)
        .json({ data: createdUser, message: "User has been Created" });
    }
  } else {
    res.status(401).json({ message: "User already exist" });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    // Plain text password comparison (⚠️ insecure, but fine for testing)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    // Exclude password from response
    const userData = await userModel.findOne({ email }, { password: 0 });

    // ✅ Use env secret, not hardcoded string
    const payload = { id: user._id, email: user.email, firstName: user.firstName };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      user: userData,
      token,
      message: "Login Successful",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



async function getAllUser(req, res) {
  try {
    const allUsers = await userModel.find();
    if (allUsers) {
      res.status(200).json({ data: allUsers, message: "All users retrieved" });
    }
  } catch (error) {
    res.send(401).json({ message: "Error while fetching All Users" });
  }
}


// async function loginUser(req, res) {
//   try {
//     const { body } = req;
//     const user = await userModel.findOne({ email: body.email });
//     if (!user) {
//       return res.status(401).json({ message: "Invalid Credentials" });
//     }
//     // Plain text password comparison
//     if (user.password === body.password) {
//       const userData = await userModel.findOne(
//         { email: body.email },
//         { password: 0 } // exclude password from response
//       );

//       jwt.sign(
//         { userData },
//         "sameed", // your secret key
//         { expiresIn: "60s" },
//         (err, token) => {
//           if (err) {
//             return res.status(500).json({ message: "Token generation failed" });
//           }

//           res.status(200).json({
//             user: userData,
//             message: "Login Successful",
//             token: token,
//           });
//         }
//       );
//     } else {
//       res.status(401).json({ message: "Invalid Credentials" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }





module.exports = { registerUser, loginUser, getAllUser };

