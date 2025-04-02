import './Header.css';
import logo from '../../../../public/logo.svg'

const Header = () => {
    return (
        <header className="!py-3 !px-3 flex gap-5 justify-between w-full">
            <div className='flex gap-4 cursor-pointer'>
                <img src={logo} alt="" />
                <h1 className="text-3xl logo-font">Slide Banai</h1>
            </div>
            <div className="flex gap-7 text-center justify-center items-center">


                <img
                    src="https://cdn.builder.io/api/v1/image/assets/c31b94cef01f43a1b57944b9708534d9/1e8b4edfdafeaeacfb35a36422b8da3363ae38ef?placeholderIfAbsent=true"
                    alt="Notification icon"
                    className="w-6 cursor-pointer"
                />
                <img
                    src="https://cdn.builder.io/api/v1/image/assets/c31b94cef01f43a1b57944b9708534d9/bf04ada5bd03fe8d9112647d33a4636b24321cda?placeholderIfAbsent=true"
                    alt="Settings icon"
                    className="w-6  cursor-pointer"
                />

                <img
                    src="https://cdn.builder.io/api/v1/image/assets/c31b94cef01f43a1b57944b9708534d9/4ae148c3692bb0e9c7918ed5f3c56a45df9974a7?placeholderIfAbsent=true"
                    alt="Divider"
                    className="my-auto w-7  cursor-pointer"
                />
                <span className=" cursor-pointer text-xs font-semibold uppercase text-neutral-800">
                    Esther Howard
                </span>

                <img
                    src="https://cdn.builder.io/api/v1/image/assets/c31b94cef01f43a1b57944b9708534d9/3dbc83ae6e7f2ebf15154335ce4fd3edbf3bf42a?placeholderIfAbsent=true"
                    alt="User profile"
                    className="rounded-full cursor-pointer aspect-square"
                />
            </div>
        </header>
    );
}

export default Header;
