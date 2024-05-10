import Head from 'next/head';
import firebase from '../lib/firebase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Input, Text } from '@geist-ui/core';

export default function Home() {
    const [isNewUser, setIsNewUser] = useState(true);
    const [refreshPage, setRefreshPage] = useState(0);
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const router = useRouter();
    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                router.push('/todos');
            }
        });
        return unsubscribe;
    }, [refreshPage]);

    const authenticateUser = async (evt) => {
        try {
            if (isNewUser) {
                await firebase
                    .auth()
                    .createUserWithEmailAndPassword(email, pwd);
            } else {
                await firebase.auth().signInWithEmailAndPassword(email, pwd);
            }
            setRefreshPage(refreshPage + 1);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Head>
                <title>Build API Demo App</title>
                <meta
                    name="description"
                    content="Build API is a boilerplate for API development"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>
                <div className="form-box">
                    <Text h4 my={0}>
                        {isNewUser ? 'Sign up' : 'Log in'}
                    </Text>
                    {isNewUser ? (
                        <Text small type="secondary">
                            I already have an account —{' '}
                            <span
                                style={{ color: '#000' }}
                                onClick={() => setIsNewUser(false)}
                            >
                                Sign in
                            </span>
                        </Text>
                    ) : (
                        <Text small type="secondary">
                            New to Build Demo?{' '}
                            <span
                                style={{ color: '#000' }}
                                onClick={() => setIsNewUser(true)}
                            >
                                Sign up
                            </span>
                        </Text>
                    )}
                    <br />
                    <br />
                    <div className="form-input">
                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email address"
                            width="100%"
                        />
                    </div>
                    <div className="form-input">
                        <Input
                            value={pwd}
                            onChange={(e) => setPwd(e.target.value)}
                            htmlType="password"
                            placeholder="Password"
                            width="100%"
                        />
                    </div>
                    <br />
                    <Button
                        onClick={() => authenticateUser()}
                        type="secondary"
                        width="100%"
                        shadow
                        scale={3 / 4}
                    >
                        {isNewUser ? 'Create account' : 'Login now'}
                    </Button>
                </div>
            </div>
        </>
    );
}
