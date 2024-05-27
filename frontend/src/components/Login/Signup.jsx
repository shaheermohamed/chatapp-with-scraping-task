import { useContext } from "react";
import { Form, Input, Button, Row, Col, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { AccountContext } from "../../context/AccountContext";
import axios from "axios";
const Signup = () => {
  const { user, setUser } = useContext(AccountContext);
  console.log("user:", user);
  const navigate = useNavigate();
  //validating form
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required("Please enter your username")
      .min(6, "Username too short")
      .max(20, "Username too long"),
    password: Yup.string()
      .required("Please enter your password")
      .min(6, "Password too short")
      .max(20, "Password too long"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  //form submit function
  const handleClickRegister = (data) => {
    axios.post("https://chatapp-with-scraping-task-server.onrender.com/auth/register", data, {
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(response => {
        console.log("response:", response);
        const data = response.data;
        if (data && data.loggedIn) {
          setUser({ ...data });
          message.success("Registered successfully");
          navigate("/login");
        } else {
          message.error(data.status || "Login failed");
        }
    })
    .catch(error => {
        console.error("Error during login:", error);
        message.error("Register failed");
    });
};
  return (
    <Row justify="center">
      <Col xxl={6} xl={8} md={12} sm={18} xs={24}>
        <div className="mt-20 bg-white rounded-md dark:bg-white10 shadow-regular dark:shadow-none border border-slate-300">
          <div className="px-5 py-4 text-center border-b border-gray-200 dark:border-white10">
            <h2 className="mb-0 text-xl font-semibold text-dark dark:text-white87">
              Sign Up
            </h2>
          </div>
          <div className="px-10 pt-8 pb-6">
            <Form name="login" layout="vertical">
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <Form.Item
                    label="User Name *"
                    validateStatus={errors.username ? "error" : ""}
                    help={errors.username?.message}
                    className="[&>div>div>label]:text-sm [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white60 [&>div>div>label]:font-medium"
                  >
                    <Input
                      {...field}
                      className="h-10 px-3 placeholder-gray-400"
                    />
                  </Form.Item>
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Form.Item
                    label="Password *"
                    validateStatus={errors.password ? "error" : ""}
                    help={errors.password?.message}
                    className="[&>div>div>label]:text-sm [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white60 [&>div>div>label]:font-medium"
                  >
                    <Input.Password
                      {...field}
                      className="h-10 px-3 placeholder-gray-600"
                    />
                  </Form.Item>
                )}
              />

              <Form.Item>
                <Button
                  className="w-full h-12 p-0 my-6 text-sm font-medium"
                  htmlType="submit"
                  type="primary"
                  size="large"
                  onClick={handleSubmit(handleClickRegister)}
                >
                  Create Account
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className="p-6 text-center bg-gray-100 dark:bg-white10 rounded-b-md">
            <p className="mb-0 text-sm font-medium text-body dark:text-white60">
              Already have an account?
              <Link
                to="/"
                className="ltr:ml-1.5 rtl:mr-1.5 text-info hover:text-primary"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Signup;
