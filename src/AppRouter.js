import React from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import About from "../../../About";
import Posts from "../../../Posts";
import Error from "../../../Error";
import PostIdPage from "../../../PostIdPage";
import {routes} from "../../../router/routes";

const AppRouter = () => {
    return (
        <Routes>
            {routes.map(route =>
                <Route
                    path={route.path}
                    element={<route.component/>}
                    exact={route.exact}
                    key={route.path}
                />
            )}
            <Route path="*"
                   element={<Navigate to="/posts" replace/>}
            />
        </Routes>
    );
};

export default AppRouter;