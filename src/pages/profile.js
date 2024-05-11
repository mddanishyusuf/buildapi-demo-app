import Head from 'next/head';
import firebase from '../lib/firebase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
    Button,
    Checkbox,
    Divider,
    Input,
    Snippet,
    Spacer,
    Tabs,
    Text,
} from '@geist-ui/core';
import Link from 'next/link';

const Todos = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userObj, setUserObj] = useState(null);
    const [authUser, setAuthUser] = useState(null);
    const [refreshPage, setRefreshPage] = useState(0);

    const getUserTodos = async (uid) => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/user/profile`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    uid: uid,
                },
            }
        );
        const data = await res.json();
        if (!data.error) {
            setUserObj(data.user);
        } else {
            router.push('/');
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

    const redirectToCheckout = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/billing/stripe/createCheckoutLink`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    clientReferenceId: userObj?.uid,
                    price: process.env.NEXT_PUBLIC_PRICE_ID,
                    mode: 'subscription',
                    quantity: 1,
                }),
            }
        );

        const data = await response.json();
        if (!data.error) {
            window.open(data.url);
        }
    };

    const openBillingPortal = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/billing/stripe/portal`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customer: userObj?.stripe_customer,
                }),
            }
        );

        const data = await response.json();
        if (!data.error) {
            window.open(data.url);
        }
    };

    return (
        <div className="profile-container">
            <div>
                <div>
                    <Link href="/todos">
                        <Text small>View todos</Text>
                    </Link>
                    <div>
                        <Text my={0}>{userObj?.email}</Text>
                        <Text small type="secondary">
                            Joined at - {userObj?.createdAt}
                        </Text>
                        <Text my={0}>API key</Text>
                        <Text small type="secondary">
                            {userObj?.api_key}
                        </Text>
                        <Text my={0}>Public APIs docs</Text>
                        <Tabs initialValue="1">
                            <Tabs.Item label="Get Todos" value="1">
                                <Text small>
                                    Make <b>GET</b> API call to this endpoint
                                    with API key
                                </Text>
                                <Snippet
                                    text={`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos?api_key=${userObj?.api_key}`}
                                    width="100%"
                                    symbol=""
                                />
                            </Tabs.Item>
                            <Tabs.Item label="Get a Todo" value="2">
                                <Text small>
                                    Make <b>GET</b> API call to this endpoint
                                    with API key
                                </Text>
                                <Snippet
                                    text={`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos/<id>?api_key=${userObj?.api_key}`}
                                    width="100%"
                                    symbol=""
                                />
                            </Tabs.Item>
                            <Tabs.Item label="Add todo" value="3">
                                <Text small>
                                    Make <b>POST</b> API call to this endpoint
                                    with API key and Body params.
                                </Text>
                                <Snippet
                                    text={`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos?api_key=${userObj?.api_key}`}
                                    width="100%"
                                    symbol=""
                                />
                                <Text small type="secondary">
                                    Body param
                                </Text>
                                <pre>
                                    {JSON.stringify({ title: 'New todo task' })}
                                </pre>
                            </Tabs.Item>
                            <Tabs.Item label="Update todo" value="4">
                                <Text small>
                                    Make <b>PUT</b> API call to this endpoint
                                    with API key and Body params.
                                </Text>
                                <Snippet
                                    text={`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos?api_key=${userObj?.api_key}`}
                                    width="100%"
                                    symbol=""
                                />
                                <Text small type="secondary">
                                    Body param
                                </Text>
                                <pre>
                                    {JSON.stringify({
                                        _id: 'todo id',
                                        completed: true,
                                    })}
                                </pre>
                            </Tabs.Item>
                            <Tabs.Item label="Delete todo" value="5">
                                <Text small>
                                    Make <b>DELETE</b> API call to this endpoint
                                    with API key and Body params.
                                </Text>
                                <Snippet
                                    text={`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos?api_key=${userObj?.api_key}`}
                                    width="100%"
                                    symbol=""
                                />
                                <Text small type="secondary">
                                    Body param
                                </Text>
                                <pre>
                                    {JSON.stringify({
                                        _id: 'todo id',
                                    })}
                                </pre>
                            </Tabs.Item>
                        </Tabs>
                        <Text my={0}>Plan ({userObj?.status})</Text>
                        <Text small type="secondary">
                            Upgrade your plan
                        </Text>
                        <br />
                        <Button
                            scale={3 / 4}
                            type="secondary"
                            shadow
                            onClick={() => redirectToCheckout()}
                        >
                            Buy
                        </Button>

                        {userObj?.stripe_customer && (
                            <div>
                                <br />
                                <Button
                                    scale={3 / 4}
                                    onClick={() => openBillingPortal()}
                                >
                                    Manage plan
                                </Button>
                            </div>
                        )}
                    </div>
                    {/* {JSON.stringify(userObj, null)} */}
                </div>
            </div>
        </div>
    );
};

export default Todos;
