import { Outlet } from "react-router-dom";
import Header from "../Shared/Header/Header";
import Sidebar from "../Shared/Sidebar/Sidebar";

const Root = () => {
    return (
        <div className="!pt-32">
            <div className="flex">
                <Sidebar></Sidebar>
                <div>
                    <Header></Header>
                    <Outlet></Outlet>
                </div>
            </div>
        </div>
    );
};

export default Root;