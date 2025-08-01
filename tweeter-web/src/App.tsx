import "./App.css";
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
    useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import useUserInfo from "./components/userInfo/UserInfoHook";
import { FolloweePresenter } from "./presenters/FolloweePresenter";
import { UserItemView } from "./presenters/UserItemPresenter";
import { FollowerPresenter } from "./presenters/FollowerPresenter";
import { StatusItemView } from "./presenters/StatusItemPresenter";
import { FeedPresenter } from "./presenters/FeedPresenter";
import { StoryPresenter } from "./presenters/StoryPresenter";
import PagedItemScroller from "./components/mainLayout/PagedItemScroller";
import { Status, User } from "tweeter-shared";
import StatusItem from "./components/statusItem/StatusItem";
import UserItem from "./components/userItem/UserItem";

const App = () => {
    const { currentUser, authToken } = useUserInfo();

    const isAuthenticated = (): boolean => {
        return !!currentUser && !!authToken;
    };

    return (
        <div>
            <Toaster position="top-right" />
            <BrowserRouter>
                {isAuthenticated() ? (
                    <AuthenticatedRoutes />
                ) : (
                    <UnauthenticatedRoutes />
                )}
            </BrowserRouter>
        </div>
    );
};

const AuthenticatedRoutes = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route index element={<Navigate to="/feed" />} />
                <Route
                    path="feed"
                    element={
                        <PagedItemScroller
                            key={1}
                            presenterGenerator={(view: StatusItemView) => new FeedPresenter(view)}
                            itemComponentGenerator={(item: Status) => <StatusItem status={item} />}
                        />
                    }
                />
                <Route
                    path="story"
                    element={
                        <PagedItemScroller
                            key={2}
                            presenterGenerator={(view: StatusItemView) => new StoryPresenter(view)}
                            itemComponentGenerator={(item: Status) => <StatusItem status={item} />}
                        />
                    }
                />
                <Route
                    path="followees"
                    element={
                        <PagedItemScroller
                            key={3}
                            presenterGenerator={(view: UserItemView) => new FolloweePresenter(view)}
                            itemComponentGenerator={(item: User) => <UserItem value={item} />}
                        />
                    }
                />
                <Route
                    path="followers"
                    element={
                        <PagedItemScroller
                            key={4}
                            presenterGenerator={(view: UserItemView) => new FollowerPresenter(view)}
                            itemComponentGenerator={(item: User) => <UserItem value={item} />}
                        />
                    }
                />
                <Route path="logout" element={<Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/feed" />} />
            </Route>
        </Routes>
    );
};

const UnauthenticatedRoutes = () => {
    const location = useLocation();

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="*"
                element={<Login originalUrl={location.pathname} />}
            />
        </Routes>
    );
};

export default App;
