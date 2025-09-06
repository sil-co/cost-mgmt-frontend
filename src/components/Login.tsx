import React, { useState } from "react";
import styled from "styled-components";

const LoginButton = styled.button`
  margin-left: 16px;
  padding: 6px 12px;
  background: ${p => p.theme.primary};
  color: #0c0c17;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #8a8afe;
  }
`;

const LoginWrapper = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  background: #1d1f2f;
  border-radius: 12px;
  padding: 40px 20px;
  width: 280px;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.3);
  color: #fff;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border: none;
  border-radius: 8px;
  background: #2a2d44;
  color: #fff;
  font-size: 14px;

  &:focus {
    outline: 2px solid #41466f;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  /* background: #2a2d44; */
  background: ${p => p.theme.primary};
  color: #fff;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: #8a8afe;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 6px;
  right: 8px;
  background: transparent;
  border: none;
  color: #aaa;
  font-size: 18px;
  cursor: pointer;

  &:hover {
    color: #fff;
  }
`;

interface LoginProps {
    handleLogin: (name: string, password: string) => void;
}

export const Login: React.FC<LoginProps> = ({ handleLogin }) => {
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        handleLogin(name, password);
    }

    return (
        <>
            <LoginButton onClick={() => setShowForm(true)}>Sign In</LoginButton>

            {showForm && (
                <LoginWrapper>
                    <CloseButton onClick={() => setShowForm(false)}>×</CloseButton>
                    <form onSubmit={onSubmit}>
                        <Input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button type="submit">Sign In</Button>
                    </form>
                </LoginWrapper>
            )}
        </>
    );
};
