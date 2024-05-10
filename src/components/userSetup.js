import { Button, Input, Text } from '@geist-ui/core';
import { useState } from 'react';

const UserSetup = () => {
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
                    uid: u.uid,
                    email: u.email,
                    displayName: u.displayName,
                }),
            }
        );
        const userData = await res.json();
        setUserObj(userData);
    };

    return (
        <div className="form-box">
            <Text h4 my={0}>
                Finish Profile
            </Text>
            <br />
            <br />
            <div className="form-input">
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    width="100%"
                />
            </div>
            <br />
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
