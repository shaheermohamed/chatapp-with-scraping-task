const Yup = require("yup");

const validationSchema = Yup.object({
    username: Yup.string()
      .required("Username required")
      .min(6, "Username too short")
      .max(20, "Username too long"),
    password: Yup.string()
      .required("Password required")
      .min(6, "Password too short")
      .max(20, "Password too long"),
  });
  
const validateForm = (req, res) => {
  const formData = req.body;
  validationSchema
    .validate(formData)
    .catch((err) => {
      res.status(422).send();
      console.log(err.errors);
    })
    .then((valid) => {
      if (valid) {
        // res.status(200).send();
        console.log("form is good");
      }
    });
};

module.exports = validateForm;