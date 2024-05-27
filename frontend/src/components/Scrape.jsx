import { useState, useEffect } from "react";
import { Divider, List, Input, Button, message } from "antd";
import axios from "axios";
import { SendOutlined } from "@ant-design/icons";

const data = [
  "Racing car sprays burning fuel into crowd.",
  "Japanese princess to wed commoner.",
  "Australian walks 100km after outback crash.",
  "Man charged over missing wedding girl.",
  "Los Angeles battles huge wildfires.",
];
const Scrape = () => {
  const [url, setUrl] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [data, setData] = useState([]);
  const handleInput = (event) => {
    console.log("value:", event.target.value);
    setUrl(event.target.value);
  };
  //calling scraping function
  const handleScrape = () => {
    axios
      .post(
        "https://chatapp-with-scraping-task-server.onrender.com/url/scrape",
        {
          url: url,
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
        setUrl(null);
        console.log("scraped response:", data);
        message.success("url scrapped");
        setTimeout(() => {
          setRefresh(false);
        }, 500);
      })
      .catch((error) => {
        console.error("Error during scraped:", error);
        message.error("failed scrape");
      });
  };
  useEffect(() => {
    getScrape();
  }, [refresh]);

  useEffect(() => {
    getScrape();
  }, []);
  //getting list of scrapped headlines
  const getScrape = () => {
    axios
      .get(`https://chatapp-with-scraping-task-server.onrender.com/url/getheadlines`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("response:", response);
        console.log("messages of current user:", response.data);
        console.log("messages refetched");
        setData(response.data?.scrapes);
      })
      .catch((error) => {
        console.error("Error during friends fetching:", error);
      });
  };

  return (
    <>
      <Divider orientation="left">Scraping</Divider>
      <List
        size="large"
        header={
          <div>
            <div className="flex">
              <Input
                className="flex-grow"
                placeholder="Type a url..."
                onChange={handleInput}
                value={url}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                className="ml-2"
                onClick={() => handleScrape()}
              >
                Send
              </Button>
            </div>
          </div>
        }
        footer={<div></div>}
        bordered
        dataSource={data}
        renderItem={(item) => <List.Item>{item?.headline}</List.Item>}
      />
    </>
  );
};

export default Scrape;
