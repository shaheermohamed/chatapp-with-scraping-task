import { useState, useEffect } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Layout, Menu, theme, Typography, message, Input, Button } from "antd";
import {
  MessageOutlined,
  SendOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import { useContext } from "react";
import { FriendContext } from "../../context/FriendContext";
import AddFriendModal from "./AddFriendModal";
import useSocketSetup from "./useSocketSetup";
import socket from "../../socket";
import { AccountContext } from "../../context/AccountContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Paragraph } = Typography;
const { Header, Content, Footer, Sider } = Layout;
const Home = () => {
  const navigate = useNavigate();
  useSocketSetup();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { friendList } = useContext(FriendContext);
  const { user } = useContext(AccountContext);
  console.log("home user:", user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [currentReceiverId, setCurrentReceiverId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [refresh, setRefresh] = useState(false);
  console.log("currentReceiverId:", currentReceiverId);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = (data) => {
    console.log("modal data:", data);
    socket.emit("add_friend", data.friendName, ({ errorMsg, done }) => {
      if (done) {
        setIsModalOpen(false);
        return;
      }
      message.error("No valid name");
    });
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleInput = (event) => {
    console.log("value:", event.target.value);
    setCurrentMessage(event.target.value);
  };

  //message sending function
  const handleSend = () => {
    console.log("currentMessage:", currentMessage);
    if (currentMessage !== (null || "") && currentReceiverId !== null) {
      axios
        .post(
          "http://localhost:4000/chat/send-message",
          {
            message: currentMessage,
            receiverId: currentReceiverId,
            type: "sent",
            // senderId: user?.userid,
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("response:", response);
          const data = response.data;
          setRefresh(true);
          setCurrentMessage(null);
          console.log("message sent response:", data);
          message.success("message is sent");
          setTimeout(() => {
            setRefresh(false);
          }, 500);
        })
        .catch((error) => {
          console.error("Error during message sent:", error);
          message.error("message failed to sent");
        });
    } else {
      message.error("Please enter message");
    }
  };
  useEffect(() => {
    handleCurrentUserMessage();
  }, [refresh, user, currentReceiverId]);

  //fetching current user messages
  const handleCurrentUserMessage = () => {
    axios
      .get(`http://localhost:4000/chat/messages/${currentReceiverId}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("response:", response);
        console.log("messages of current user:", response.data);
        console.log("messages refetched");
        setChatMessages(response.data?.messages);
      })
      .catch((error) => {
        console.error("Error during friends fetching:", error);
      });
  };
  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="demo-logo-vertical" />
        <Paragraph
          copyable={{
            icon: [
              <MessageOutlined key="copy-icon" />,
              <MessageOutlined key="copied-icon" className="" />,
            ],
            tooltips: ["click here", "you clicked!!"],
          }}
          className="flex justify-center text-white mt-3 cursor-pointer"
          onClick={showModal}
        >
          Add Friends
        </Paragraph>
        <Menu
          theme="dark"
          mode="inline"
          items={friendList
            ?.filter((item) => item.userid !== user.userid)
            ?.map((item, index) => ({
              key: String(index + 1),
              icon: (
                <UserOutlined
                  style={{ color: "green" }}
                  onClick={() => {
                    console.log("item:", item);
                    setCurrentReceiverId(item.userid);
                  }}
                />
              ),
              label: ` ${item.username}`,
              userid: item.userid,
            }))}
        />
        <AddFriendModal
          isModalOpen={isModalOpen}
          handleCancel={handleCancel}
          handleOk={handleOk}
        />
        <Paragraph
          copyable={{
            icon: [
              <DatabaseOutlined key="copy-icon" />,
              <DatabaseOutlined key="copied-icon" className="" />,
            ],
            tooltips: ["click here", "you clicked!!"],
          }}
          className="flex justify-center text-white mt-3 cursor-pointer"
          onClick={() => navigate("/scrape")}
        >
          got to web scrape
        </Paragraph>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            // display: "flex",
            // alignItems: "center",
            textAlign: "center",
          }}
        >
          Logged as <span className="text-lime-600">{user?.username}</span>
        </Header>
        <Content
          style={{
            margin: "34px 16px 0",
          }}
        >
          <div className="relative flex flex-col justify-between h-[75vh] bg-gray-100 rounded-lg overflow-hidden">
            <div className="overflow-y-auto flex flex-col pb-20">
              {currentReceiverId !== null ? (
                <>
                  {currentReceiverId !== null &&
                    chatMessages.map((msg) => (
                      <div
                        key={msg?.id}
                        className={`${
                          msg.sender_id === user.userid ? "ml-auto" : ""
                        } w-1/2 rounded-lg p-4 my-2 ${
                          msg.sender_id === user.userid
                            ? "bg-blue-300"
                            : "bg-gray-300"
                        }`}
                      >
                        {msg.message}
                      </div>
                    ))}
                </>
              ) : (
                <div className="text-center p-4">
                  Select a friend and start chatting.
                </div>
              )}
            </div>
            {currentReceiverId !== null && (
              <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t">
                <div className="flex">
                  <Input
                    className="flex-grow"
                    placeholder="Type a message..."
                    onChange={handleInput}
                    value={currentMessage}
                  />
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    className="ml-2"
                    onClick={() => handleSend()}
                  >
                    Send
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Chat App ©{new Date().getFullYear()} Created by Shaheer
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Home;
