import { AuthUser, fetchAuthSession, JWT } from 'aws-amplify/auth';
import { createContext, Dispatch, SetStateAction, useEffect, useState } from 'react';

interface IUserContext {
    authUser: AuthUser | null | undefined;
    accessToken: JWT | null;
    refresh: boolean;
    setRefresh: Dispatch<SetStateAction<boolean>>;
    getAccessToken: () => Promise<JWT | null>;
}

interface Props {
    children: JSX.Element | Array<JSX.Element>;
    user?: AuthUser;
}

const defaultContext: IUserContext = {
    authUser: null,
    accessToken: null,
    refresh: false,
    setRefresh: () => {},
    getAccessToken: () => Promise.resolve(null),
};

const UserContext = createContext(defaultContext);

const getAccessToken = async (): Promise<JWT | null> => {
    const authSession = await fetchAuthSession();
    if (!authSession.tokens) return null;

    if (!authSession.tokens.idToken) return null;

    return authSession.tokens?.idToken;
};

const UserContextProvider = (props: Props) => {
    const [refresh, setRefresh] = useState(false);
    const [accessToken, setAccessToken] = useState<JWT | null>(null);

    useEffect(() => {
        getAccessToken().then((accessToken: JWT | null) => {
            if (accessToken) setAccessToken(accessToken);
        });
    }, []);

    return (
        <UserContext.Provider
            value={{
                authUser: props.user,
                accessToken: accessToken,
                refresh: refresh,
                setRefresh: setRefresh,
                getAccessToken: getAccessToken,
            }}
        >
            {props.children}
        </UserContext.Provider>
    );
};

export { UserContext, UserContextProvider };
export type { IUserContext };
