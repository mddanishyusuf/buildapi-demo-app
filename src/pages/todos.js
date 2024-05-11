import Head from 'next/head';
import firebase from '../lib/firebase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Checkbox, Input, Spacer, Text } from '@geist-ui/core';
import UserSetup from '@/components/userSetup';
import { TdesignDelete } from '@/lib/icons';
import Link from 'next/link';

const Todos = () => {
    const [loading, setLoading] = useState(true);
    const [todos, setTodos] = useState([]);
    const [userObj, setUserObj] = useState(null);
    const [authUser, setAuthUser] = useState(null);
    const [refreshPage, setRefreshPage] = useState(0);
    const [taskTitle, setTaskTitle] = useState('');

    const getUserTodos = async (uid) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/todos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                uid: uid,
            },
        });
        const data = await res.json();
        if (!data.error) {
            setUserObj(data.user);
            setTodos(data.todos);
        }
        setLoading(false);
    };

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                setAuthUser(user);
                getUserTodos(user.uid);
            }
        });
        return unsubscribe;
    }, [refreshPage]);

    if (loading) return 'Loading...';

    if (userObj === null)
        return (
            <UserSetup
                refreshPage={() => setRefreshPage(refreshPage + 1)}
                authUser={authUser}
            />
        );

    const todoHandler = async (status, id) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/todos`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                uid: authUser.uid,
            },
            body: JSON.stringify({
                _id: id,
                status,
            }),
        });
        const data = await res.json();
        if (!data.error) {
            setRefreshPage(refreshPage + 1);
        }
    };

    const addTask = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                uid: authUser.uid,
            },
            body: JSON.stringify({
                title: taskTitle,
            }),
        });
        const data = await res.json();
        if (!data.error) {
            setRefreshPage(refreshPage + 1);
        }
    };

    const deleteTodo = async (id) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/todos`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                uid: authUser.uid,
            },
            body: JSON.stringify({
                _id: id,
            }),
        });
        const data = await res.json();
        if (!data.error) {
            setRefreshPage(refreshPage + 1);
        }
    };

    return (
        <div className="todo-container">
            <div>
                <div>
                    <Link href="/profile">
                        <Text small>User profile</Text>
                    </Link>
                </div>
                <Text h4>Todos</Text>
                {todos.length === 0 && (
                    <Text small type="secondary">
                        There is no active tasks.
                    </Text>
                )}
                <div style={{ padding: '20px 0px' }}>
                    <div className="todo-list">
                        {todos.map((todo, key) => (
                            <div key={key}>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '5px',
                                    }}
                                >
                                    <Checkbox
                                        onChange={(e) =>
                                            todoHandler(
                                                e.target.checked,
                                                todo._id
                                            )
                                        }
                                        value={todo._id}
                                        checked={todo.completed}
                                    >
                                        {todo.title}
                                    </Checkbox>
                                    <TdesignDelete
                                        onClick={() => deleteTodo(todo._id)}
                                    />
                                </div>
                                <Spacer h={0.5} />
                            </div>
                        ))}
                    </div>
                </div>

                <Input
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Add a todo task in the list"
                    width="100%"
                />
                <br />
                <br />
                <Button
                    type="secondary"
                    onClick={() => addTask()}
                    shadow
                    scale={3 / 4}
                >
                    Add
                </Button>
            </div>
        </div>
    );
};

export default Todos;
