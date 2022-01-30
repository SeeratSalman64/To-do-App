import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Container,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import axios from "axios";

const CreateItem = () => {
  const [inputData, setInputData] = useState([]);
  const [text, setText] = useState({
    title: "",
  });

  useEffect(() => {
    requestToDoList();
  }, []);

  const requestToDoList = async () => {
    await axios
      .get("http://localhost:5000/all/", {
        headers: { "x-auth-token": localStorage.getItem("auth-token") },
      })
      .then((res) => {
        setInputData(res.data);
      })
      .catch((error) => {
        console.error("error: ", error);
      });
  };

  const handleChange = (event) => {
    const newData = event.target.value;
    setText({ title: newData });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post("http://localhost:5000/", text, {
        headers: { "x-auth-token": localStorage.getItem("auth-token") },
      })
      .then((res) =>
        setInputData((prevData) => {
          return [...prevData, res.data];
        })
      )
      .catch((err) => console.log(err));
    setText({ title: "" });
  };

  const deleteTodo = (id) => {
    axios
      .delete(`http://localhost:5000/${id}`, {
        headers: { "x-auth-token": localStorage.getItem("auth-token") },
      })
      .then((res) => {
        setInputData((prevData) => {
          return prevData.filter((data) => {
            return data._id !== id;
          });
        });
      });
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Input type="text" value={text.title} onChange={handleChange} />
        <Button type="submit" className="btn-sm">
          Add
        </Button>
      </Form>
      <ListGroup>
        {inputData.map((item, index) => {
          return (
            <ListGroupItem
              key={index}
              className="list"
              onClick={() => deleteTodo(item._id)}
            >
              {item.title}
            </ListGroupItem>
          );
        })}
      </ListGroup>
    </Container>
  );
};

export default CreateItem;
