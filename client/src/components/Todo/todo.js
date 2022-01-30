import React, { useContext } from "react";
import { Container } from "reactstrap";
import CreateItem from "./CreateItem";
import UserContext from "../../context/UserContext";

const Todo = () => {
  const { userData } = useContext(UserContext);
  return (
    <Container>
      {userData.user && (
        <>
          <h3>Welcome {userData.user.displayName} to your TodoList!</h3>
          <CreateItem />
        </>
      )}
    </Container>
  );
};

export default Todo;
