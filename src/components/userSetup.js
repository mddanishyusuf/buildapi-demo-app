import { Button, Input, Text } from '@geist-ui/core';
import { useState } from 'react';

const UserSetup = ({ authUser, refreshPage }) => {
    const [name, setName] = useState('');

    const setupProfile = async () => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/user/profile`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: authUser.uid,
                    email: authUser.email,
                }),
            }
        );
        const data = await res.json();
        if (!data.error) {
            refreshPage();
        }
    };

    return (
        <div className="form-box">
            <Text h4 my={0}>
                Finish Profile
            </Text>
            <div className="form-input">
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    width="100%"
                />
            </div>
            <Button
                onClick={() => setupProfile()}
                type="secondary"
                width="100%"
                shadow
                scale={3 / 4}
            >
                Setup profile
            </Button>
        </div>
    );
};

export default UserSetup;
