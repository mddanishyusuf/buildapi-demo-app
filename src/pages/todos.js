import Head from 'next/head';
import firebase from '../lib/firebase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Input, Text } from '@geist-ui/core';
import UserSetup from '@/components/userSetup';

const Todos = () => {
    const [loading, setLoading] = useState(true);
    const [userObj, setUserObj] = useState(null);

    const getUserProfile = async (uid, email) => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/user/profile`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid,
                    email,
                }),
            }
        );
        const userData = await res.json();
        setUserObj(userData);
    };

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                getUserProfile(user.uid, user.email);
            }
        });
        return unsubscribe;
    }, []);

    if (loading) return 'Loading...';

    if (userObj === null) return <UserSetup />;
    return <div>todos</div>;
};

export default Todos;
