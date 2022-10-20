
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

// REDUX
import { useHistory } from 'react-router-dom';
import { isLoginSelector } from '../../app_state/login';
import { ROUTES } from '../../_config/route';
import { GeneralHeader } from '../../com/app_layout/general_header';
import { useEffect } from 'react';

function PrivateRoute({ children, ...rest }) {
    const isLogin = useSelector(isLoginSelector);
    return (
        <Route
            {...rest}
            render={({ location }) =>
                isLogin ?
                    <div>
                        {/* <GeneralHeader /> */}
                        {children}
                    </div> : (
                        <Redirect
                            to={{
                                pathname: `/${ROUTES.LOGIN}`,
                                state: { from: location }
                            }}
                        />
                    )
            }
        />
    );
}

export default PrivateRoute;

