import { Modal, Form, Input, Button, message } from "antd";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
const AddFriendModal = ({ isModalOpen, handleCancel, handleOk }) => {
  // validating forms
  const validationSchema = Yup.object().shape({
    friendName: Yup.string()
      .required("Please enter your username")
      .min(6, "invalid username")
      .max(20, "invalid username"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  return (
    <>
      <Modal
        title="Add a friend"
        open={isModalOpen}
        onOk={handleSubmit(handleOk)}
        onCancel={handleCancel}
      >
        <div className="px-10 pt-8 pb-6">
          <Form name="login" layout="vertical">
            <Controller
              name="friendName"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label="Friend Name *"
                  validateStatus={errors.friendName ? "error" : ""}
                  help={errors.friendName?.message}
                  className="[&>div>div>label]:text-sm [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white60 [&>div>div>label]:font-medium"
                >
                  <Input
                    {...field}
                    className="h-10 px-3 placeholder-gray-400"
                  />
                </Form.Item>
              )}
            />
          </Form>
        </div>
      </Modal>
    </>
  );
};

AddFriendModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleOk: PropTypes.func.isRequired,
};

export default AddFriendModal;
