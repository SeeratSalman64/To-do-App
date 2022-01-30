import React, { useContext } from 'react';
import Todo from '../Todo/todo';
import UserContext from '../../context/UserContext';

const Home = () => {

    const { userData } = useContext(UserContext);

    return (
        <div className="row heading">
            {userData.user ? <Todo />
                : <p>
                    Welcome to ToDo App
                    </p>
            }
        </div>
    );
}

export default Home;